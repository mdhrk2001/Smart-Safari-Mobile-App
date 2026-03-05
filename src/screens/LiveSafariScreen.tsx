// src/screens/LiveSafariScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Worklets } from 'react-native-worklets-core';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { postProcessYOLO, Detection } from '../utils/ObjectDetection';
import { useGeofencing } from '../hooks/useGeofencing';
import { speakNarration, stopNarration } from '../utils/AudioNarrator'; 

// 1. Load the Model
const MODEL_PATH = require('../../assets/models/wildlens_v2.tflite');

// Dictionary to map class indices to UI info and TTS Narration
const ANIMAL_DATA: Record<number, any> = {
    0: {
        name: 'Sri Lankan Elephant',
        scientificName: 'Elephas maximus maximus',
        status: 'Endangered',
        narration: {
            en: "The Sri Lankan elephant is one of three recognized subspecies of the Asian elephant. They are native to Sri Lanka and can often be found near water sources.",
            si: "ශ්‍රී ලංකා අලියා ආසියානු අලියාගේ උප විශේෂයකි...",
            ta: "இலங்கை யானை ஆசிய யானையின் ஒரு துணை இனமாகும்..."
        }
    },
    1: {
        name: 'Sri Lankan Leopard',
        scientificName: 'Panthera pardus kotiya',
        status: 'Endangered',
        narration: {
            en: "The Sri Lankan leopard is an apex predator endemic to Sri Lanka. It is highly adaptable and can be found in various habitats, including the dry evergreen forests of Yala.",
            si: "ශ්‍රී ලංකා කොටියා ශ්‍රී ලංකාවට ආවේණික විලෝපිකයෙකි...",
            ta: "இலங்கை சிறுத்தை இலங்கைக்கு உரித்தான ஒரு கொன்றுண்ணி..."
        }
    },
    2: {
        name: 'Sloth Bear',
        scientificName: 'Melursus ursinus inornatus',
        status: 'Vulnerable',
        narration: {
            en: "The Sri Lankan sloth bear is a subspecies of the sloth bear. They are primarily insectivorous, feeding heavily on termites and ants.",
            si: "ශ්‍රී ලංකා මන්ද වලසා...",
            ta: "இலங்கை கரடி..."
        }
    },
};

export default function LiveSafariScreen({ navigation }: any) {
    // Setup Camera & Geofencing
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { currentZone } = useGeofencing();

    // Setup AI Model
    const objectDetection = useTensorflowModel(MODEL_PATH);
    const { resize } = useResizePlugin();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // UI State for Bottom Sheet
    const [detectedAnimal, setDetectedAnimal] = useState<any | null>(null);
    const [confidenceText, setConfidenceText] = useState("0%");

    // Shared Values for AR Bounding Box (Runs on UI Thread)
    const boxTop = useSharedValue(0);
    const boxLeft = useSharedValue(0);
    const boxWidth = useSharedValue(0);
    const boxHeight = useSharedValue(0);
    const isDetected = useSharedValue(false);
    const currentDetectedClass = useSharedValue<number | null>(null);

    useEffect(() => {
        requestPermission();
    }, []);

    // TTS: Automatically trigger audio when entering a new Geofence Zone
    useEffect(() => {
        if (currentZone && currentZone.audioAutoPlay) {
            speakNarration(`Alert: ${currentZone.name}. ${currentZone.alertMessage}`, 'en');
        }

        // Cleanup: Stop audio if the user leaves the screen or zone changes
        return () => stopNarration();
    }, [currentZone]);

    // TTS: Manual trigger for animal narration
    const handleListenPress = () => {
        if (detectedAnimal && detectedAnimal.narration) {
            speakNarration(detectedAnimal.narration.en, 'en');
        }
    };

    // Function to update standard React State from the Worklet
    const updateUIState = Worklets.createRunOnJS((classIndex: number | null, confidence: number) => {
        if (classIndex === null) {
            setDetectedAnimal(null);
            setConfidenceText("");
        } else {
            setDetectedAnimal(ANIMAL_DATA[classIndex] || { name: 'Unknown Species', scientificName: '...', status: 'Unknown' });
            setConfidenceText(`${(confidence * 100).toFixed(0)}%`);
        }
    });

    // Frame Processor - Runs on a separate thread at 30+ FPS
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        if (objectDetection.state !== 'loaded') return;

        // 1. Run Model
        const resized = resize(frame, { scale: { width: 640, height: 640 }, pixelFormat: 'rgb', dataType: 'float32' });
        const output = objectDetection.model.runSync([resized]);
        const rawData = output[0] as Float32Array;

        // 2. Decode Output
        const detections = postProcessYOLO(rawData, 640, 640);

        // 3. Update UI
        if (detections.length > 0) {
            const topResult = detections[0];

            // Scale bounding box to screen dimensions
            const scaleX = screenWidth / 640;
            const scaleY = screenHeight / 640;

            boxTop.value = topResult.box.y * scaleY;
            boxLeft.value = topResult.box.x * scaleX;
            boxWidth.value = topResult.box.w * scaleX;
            boxHeight.value = topResult.box.h * scaleY;

            isDetected.value = true;

            // PERFORMANCE FIX: Only cross the JS bridge if it is a NEW detection
            if (currentDetectedClass.value !== topResult.classIndex) {
                currentDetectedClass.value = topResult.classIndex;
                updateUIState(topResult.classIndex, topResult.confidence);
            }
        } else {
            isDetected.value = false;

            // PERFORMANCE FIX: Only clear the JS state once when the animal leaves
            if (currentDetectedClass.value !== null) {
                currentDetectedClass.value = null;
                updateUIState(null, 0); // Triggers the clear command
            }
        }
    }, [objectDetection]); // <--- THIS WAS THE MISSING CLOSING BRACKET

    // Animated Style for the Bounding Box
    const animatedBoxStyle = useAnimatedStyle(() => ({
        top: withSpring(boxTop.value),
        left: withSpring(boxLeft.value),
        width: withSpring(boxWidth.value),
        height: withSpring(boxHeight.value),
        opacity: isDetected.value ? 1 : 0,
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#00E676',
        zIndex: 10,
    }));

    if (!hasPermission) return <View style={styles.container}><Text style={{ color: 'white' }}>Requesting Camera...</Text></View>;
    if (device == null) return <View style={styles.container}><Text style={{ color: 'white' }}>Loading Camera...</Text></View>;

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                pixelFormat="yuv"
            />

            {/* Top Overlay: Back Button & Live Badge */}
            <SafeAreaView style={styles.topOverlay} edges={['top']}>
                <TouchableOpacity onPress={() => { stopNarration(); navigation.goBack(); }} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.liveBadge}>
                    <View style={styles.redDot} />
                    <Text style={styles.liveText}>LIVE AI</Text>
                </View>
            </SafeAreaView>

            {/* AR Bounding Box Overlay */}
            <Animated.View style={animatedBoxStyle}>
                <View style={styles.labelTag}>
                    <Text style={styles.labelText}>
                        {detectedAnimal?.name || 'Scanning...'} <Text style={{ fontWeight: '300' }}>{confidenceText}</Text>
                    </Text>
                </View>
                {/* Target Corners */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </Animated.View>

            {/* Bottom Information Panel (Only shows when animal detected) */}
            {detectedAnimal && (
                <View style={styles.bottomSheet}>
                    <TouchableOpacity style={styles.recordButtonOuter}>
                        <View style={styles.recordButtonInner} />
                    </TouchableOpacity>

                    <View style={styles.animalInfoContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.animalName}>{detectedAnimal.name}</Text>
                            <Text style={styles.scientificName}>{detectedAnimal.scientificName}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{detectedAnimal.status}</Text>
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <ActionButton icon="information-circle" label="Info" color="#2962FF" />
                        <ActionButton
                            icon="volume-high"
                            label="Listen"
                            color="#00C853"
                            onPress={handleListenPress} 
                        />
                        <ActionButton icon="book" label="Log" color="#FF9100" />
                        <ActionButton icon="warning" label="Alert" color="#D50000" />
                    </View>
                </View>
            )}

            {/* Geofence Alert Overlay */}
            {currentZone && (
                <View style={styles.alertOverlay}>
                    <View style={styles.alertCard}>
                        <Ionicons name="warning" size={40} color="#FF3D00" />
                        <Text style={styles.alertTitle}>{currentZone.name}</Text>
                        <Text style={styles.alertSubtitle}>You are entering a high-alert area</Text>

                        <View style={styles.alertBody}>
                            <Text style={styles.alertBodyTitle}>⚠️ Safety Guidelines</Text>
                            <Text style={styles.alertListItem}>• {currentZone.alertMessage}</Text>
                            <Text style={styles.alertListItem}>• Expected Wildlife: {currentZone.expectedWildlife}</Text>
                        </View>

                        <TouchableOpacity style={styles.ackButton} onPress={() => stopNarration()}>
                            <Text style={styles.ackButtonText}>I Understand, Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

// Helper Component for Actions
const ActionButton = ({ icon, label, color, onPress }: { icon: any, label: string, color: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
        <View style={[styles.actionIconCircle, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },

    // Top Section
    topOverlay: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, zIndex: 50 },
    iconButton: { padding: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF3D00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, height: 32 },
    redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 6 },
    liveText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    // Bounding Box AR
    labelTag: { position: 'absolute', top: -30, left: -2, backgroundColor: '#00E676', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
    labelText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
    corner: { position: 'absolute', width: 20, height: 20, borderColor: '#FF3D00', borderWidth: 4 },
    topLeft: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
    topRight: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
    bottomLeft: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
    bottomRight: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },

    // Bottom Sheet UI
    bottomSheet: { position: 'absolute', bottom: 0, width: '100%', padding: 24, paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.85)', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    recordButtonOuter: { position: 'absolute', top: -35, alignSelf: 'center', width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    recordButtonInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#D50000' },
    animalInfoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
    animalName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    scientificName: { color: '#bbb', fontSize: 14, fontStyle: 'italic', marginTop: 2 },
    statusBadge: { backgroundColor: '#D50000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    actionBtn: { alignItems: 'center' },
    actionIconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    actionLabel: { color: '#fff', fontSize: 12 },

    // Geofence Alert Overlay
    alertOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20, zIndex: 100 },
    alertCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center' },
    alertTitle: { fontSize: 24, fontWeight: 'bold', color: '#FF3D00', marginTop: 10 },
    alertSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    alertBody: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, width: '100%', marginBottom: 20 },
    alertBodyTitle: { fontWeight: 'bold', color: '#E65100', marginBottom: 8 },
    alertListItem: { color: '#333', marginBottom: 4, lineHeight: 20 },
    ackButton: { backgroundColor: '#00C853', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, width: '100%', alignItems: 'center' },
    ackButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});