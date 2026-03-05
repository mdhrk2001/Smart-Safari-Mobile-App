// src/screens/ParkSelectionScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Data representing the parks shown in Figure B.4
const PARKS = [
    { id: 'yala', name: 'Yala National Park', active: true, image: 'https://images.unsplash.com/photo-1588611910246-13d87d9f75ec?w=600&q=80' }, // "Yala National Park" [cite: 709]
    { id: 'wilpattu', name: 'Wilpattu National Park', active: false, image: 'https://images.unsplash.com/photo-1544605481-2292025baac0?w=600&q=80' }, // "Wilpattu National Park" [cite: 711]
    { id: 'udawalawe', name: 'Udawalawe National Park', active: false, image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80' }, // "Udawalawe National Park" [cite: 713]
    { id: 'ridiyagama', name: 'Ridiyagama Safari Park', active: false, image: 'https://images.unsplash.com/photo-1615038552039-f1fbab43ae8e?w=600&q=80' }, // "Ridiyagama Safari Park" [cite: 714]
    { id: 'minneriya', name: 'Minneriya National Park', active: false, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&q=80' } // "Minneriya National Park" [cite: 715]
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParkSelection'>;
};

export default function ParkSelectionScreen({ navigation }: Props) {
    const [selectedPark, setSelectedPark] = useState('yala');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Your Destination</Text>
                <Text style={styles.subtitle}>Choose a park to download maps and data</Text>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {PARKS.map((park) => {
                    const isSelected = selectedPark === park.id;
                    return (
                        <TouchableOpacity 
                            key={park.id} 
                            style={[styles.cardContainer, isSelected && styles.cardSelected]}
                            onPress={() => park.active && setSelectedPark(park.id)}
                            disabled={!park.active}
                        >
                            <ImageBackground 
                                source={{ uri: park.image }} 
                                style={styles.cardBackground}
                                imageStyle={{ borderRadius: 12, opacity: park.active ? 0.8 : 0.4 }}
                            >
                                <View style={styles.cardOverlay}>
                                    <View style={styles.cardContent}>
                                        {park.active ? (
                                           <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                                               {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                                           </View>
                                        ) : (
                                            <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.lockIcon} /> // Locked icon [cite: 712]
                                        )}
                                        <Text style={styles.parkName}>{park.name}</Text>
                                    </View>
                                    
                                    {park.active && (
                                        <View style={styles.activeBadge}>
                                            <Text style={styles.activeText}>Active</Text>
                                        </View>
                                    )}
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.enterButton} 
                    onPress={() => navigation.navigate('MainTabs')}
                >
                    <Text style={styles.enterButtonText}>Enter Park {'>'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 24, paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' }, // "Select Your Destination" [cite: 707]
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 }, // "Choose a park to download maps and data" [cite: 708]
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    cardContainer: { height: 100, marginBottom: 16, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
    cardSelected: { borderColor: '#00C853' }, // Active green border [cite: 710]
    cardBackground: { flex: 1, borderRadius: 12, backgroundColor: '#000' },
    cardOverlay: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    checkCircleActive: { backgroundColor: '#00C853', borderColor: '#00C853' },
    lockIcon: { marginRight: 12 },
    parkName: { fontSize: 18, fontWeight: 'bold', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 },
    activeBadge: { backgroundColor: '#00C853', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    activeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, // "Active" [cite: 710]
    footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    enterButton: { backgroundColor: '#00C853', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
    enterButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' } // "Enter Park >" [cite: 716]
});