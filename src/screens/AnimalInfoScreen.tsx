// src/screens/AnimalInfoScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AnimalInfoScreen({ route, navigation }: any) {
    const insets = useSafeAreaInsets();
    
    // Grab both the animal data AND the selected language passed from LiveSafariScreen
    const { animal, language = 'en' } = route.params || {};

    // --- Dynamic Data Mapping ---
    // Safely pull the name in the active language, falling back to English, then Unknown
    const displayName = animal?.name?.[language] || animal?.name?.['en'] || animal?.name || 'Unknown Species';
    
    // Local names for the secondary display
    const sinhalaName = animal?.name?.si || 'නම නොදනී';
    const tamilName = animal?.name?.ta || 'பெயர் தெரியவில்லை';
    const localNames = `${sinhalaName} / ${tamilName}`;

    const scientificName = animal?.scientificName || 'Scientific name unavailable';
    const status = animal?.status || 'Unknown Status';
    
    // Support either 'about' or 'narration' fields as the description
    let aboutText = 'No description available for this species.';
    if (animal?.about) {
        aboutText = typeof animal.about === 'string' ? animal.about : (animal.about[language] || animal.about['en']);
    } else if (animal?.narration) {
        aboutText = typeof animal.narration === 'string' ? animal.narration : (animal.narration[language] || animal.narration['en']);
    }

    const imageUrl = animal?.imageUrl || 'https://images.unsplash.com/photo-1615562761899-706f3630f997?q=80&w=1000&auto=format&fit=crop';

    const keyFacts = animal?.keyFacts && animal.keyFacts.length > 0 ? animal.keyFacts : [
        { title: 'Habitat', desc: 'Data unavailable', icon: 'leaf' },
    ];

    return (
        <View style={styles.container}>
            {/* Header Image Section */}
            <ImageBackground source={{ uri: imageUrl }} style={styles.headerImage}>
                <View style={styles.imageOverlay}>
                    
                    <SafeAreaView edges={['top']} style={styles.headerTop}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{displayName}</Text>
                        <Text style={styles.subtitle}>{scientificName}</Text>
                    </View>
                </View>
            </ImageBackground>

            {/* Scrollable Content Section */}
            <View style={styles.contentWrapper}>
                <ScrollView 
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.statusBadge}>
                        <Ionicons name="warning" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                        <Text style={styles.statusText}>Conservation Status: {status}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Local Names</Text>
                        <Text style={styles.bodyText}>{localNames}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bodyText}>{aboutText}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Key Facts</Text>
                        {/* FIX: Using 'index' as the key prevents the React warning */}
                        {keyFacts.map((fact: any, index: number) => (
                            <View key={index.toString()} style={styles.factCard}>
                                <View style={styles.factIconContainer}>
                                    {/* Ensure icon name matches Ionicons. Default to 'information-circle' if invalid */}
                                    <Ionicons name={(fact.icon || 'information-circle') as any} size={20} color="#00C853" />
                                </View>
                                <View style={styles.factTextContainer}>
                                    <Text style={styles.factTitle}>{fact.title}</Text>
                                    <Text style={styles.factDesc}>{fact.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Floating Back Button */}
                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Back to Camera</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerImage: {
        width: '100%',
        height: 320, 
        justifyContent: 'flex-end',
    },
    imageOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', 
        justifyContent: 'space-between',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        padding: 24,
        paddingBottom: 30,
        backgroundColor: 'rgba(0,0,0,0.4)', 
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#f0f0f0',
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 4,
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20, 
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 24,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    statusText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A237E', 
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    factCard: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E9', 
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    factIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    factTextContainer: {
        flex: 1,
    },
    factTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    factDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        backgroundColor: '#00C853',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});