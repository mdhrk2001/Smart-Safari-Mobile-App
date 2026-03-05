// src/screens/DiaryScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define the interface for a single sighting log
interface Sighting {
    id: string;
    animalName: string;
    location: string;
    date: string;
    imageUrl: string;
}

// Mock Data representing the user's synchronized logs
const MOCK_SIGHTINGS: Sighting[] = [
    {
        id: '1',
        animalName: 'Sri Lankan Elephant',
        location: 'Buttuwa Tank, Yala',
        date: 'Dec 24, 2025 • 08:45 AM',
        imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80', // Placeholder elephant
    },
    {
        id: '2',
        animalName: 'Sri Lankan Leopard',
        location: 'Akasa Chaitya Road, Yala',
        date: 'Dec 24, 2025 • 10:20 AM',
        imageUrl: 'https://images.unsplash.com/photo-1615038552039-f1fbab43ae8e?w=400&q=80', // Placeholder leopard
    },
    {
        id: '3',
        animalName: 'Indian Peafowl',
        location: 'Pilinnawa Lagoon, Yala',
        date: 'Apr 23, 2026 • 04:15 PM',
        imageUrl: 'https://images.unsplash.com/photo-1571406082496-e27e8fa1219b?w=400&q=80', // Placeholder peafowl
    },
];

export default function DiaryScreen({ navigation }: any) {
    
    // Component to render individual sighting cards
    const renderSighting = ({ item }: { item: Sighting }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.animalName}>{item.animalName}</Text>
                
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.infoText}> {item.location}</Text>
                </View>
                
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.infoText}> {item.date}</Text>
                </View>

                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={16} color="#00C853" />
                    <Text style={styles.shareText}> Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>My Wildlife Diary</Text>
                <Text style={styles.pageSubtitle}>{MOCK_SIGHTINGS.length} sightings recorded</Text>
            </View>

            {/* Cloud Sync Status */}
            <View style={styles.syncStatus}>
                <View style={styles.syncLeft}>
                    <Ionicons name="cloud-done-outline" size={18} color="#00C853" />
                    <Text style={styles.syncText}> Synced to Cloud</Text>
                </View>
                <Text style={styles.syncTime}>Last sync: 2m ago</Text>
            </View>

            {/* List of Sightings */}
            <FlatList
                data={MOCK_SIGHTINGS}
                keyExtractor={(item) => item.id}
                renderItem={renderSighting}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Stats Journey Card */}
            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Your Journey</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Species</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>2</Text>
                        <Text style={styles.statLabel}>Safari Counts</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>5h</Text>
                        <Text style={styles.statLabel}>Safari Time</Text>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    
    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
    backButton: { padding: 8 },
    addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00C853', justifyContent: 'center', alignItems: 'center' },
    titleContainer: { paddingHorizontal: 24, marginTop: 10 },
    pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    pageSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },

    // Sync Status
    syncStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 24, marginTop: 20, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
    syncLeft: { flexDirection: 'row', alignItems: 'center' },
    syncText: { color: '#00C853', fontWeight: '600', fontSize: 14 },
    syncTime: { color: '#999', fontSize: 12 },

    // List
    listContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 }, // Extra padding bottom for stats card
    
    // Sighting Card
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    cardImage: { width: 100, height: '100%', backgroundColor: '#e0e0e0' },
    cardContent: { flex: 1, padding: 16 },
    animalName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { fontSize: 13, color: '#666' },
    shareButton: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    shareText: { color: '#00C853', fontWeight: 'bold', fontSize: 14 },

    // Bottom Stats Card
    statsCard: { position: 'absolute', bottom: 20, left: 24, right: 24, backgroundColor: '#00C853', borderRadius: 20, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    statsTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    statLabel: { color: '#e8f5e9', fontSize: 12, marginTop: 4 },
    statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' }
});