// src/screens/TourPlannerScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { calculateOptimalRoute, Interest, ParkNode } from '../utils/TourPlanner';

export default function TourPlannerScreen({ navigation }: any) {
    const [selectedTime, setSelectedTime] = useState('3 Hours');
    const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
    const [generatedRoute, setGeneratedRoute] = useState<ParkNode[] | null>(null);

    const toggleInterest = (interest: Interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleGenerateRoute = () => {
        // In a full app, the start/end points would be dynamic based on GPS or dropdowns.
        // For demonstration, we route from the Gate to the End Camp.
        const route = calculateOptimalRoute('gate', 'end_camp', selectedInterests);
        setGeneratedRoute(route);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Header */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plan Your Yala Safari</Text>
                <Text style={styles.headerSubtitle}>Customize your wildlife adventure</Text>

                {/* Time Selection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="time-outline" size={20} color="#00C853" />
                        <Text style={styles.sectionTitle}> How much time do you have?</Text>
                    </View>
                    <View style={styles.grid}>
                        {['2 Hours', '3 Hours', '4 Hours', 'Full Day'].map(time => (
                            <TouchableOpacity 
                                key={time}
                                style={[styles.timeCard, selectedTime === time && styles.cardSelected]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[styles.timeText, selectedTime === time && styles.textSelected]}>{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Interest Selection */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="heart-outline" size={20} color="#00C853" />
                        <Text style={styles.sectionTitle}> What do you want to see?</Text>
                    </View>
                    <View style={styles.grid}>
                        {(['Elephants', 'Leopards', 'Birds', 'Bears'] as Interest[]).map(animal => {
                            const isSelected = selectedInterests.includes(animal);
                            return (
                                <TouchableOpacity 
                                    key={animal}
                                    style={[styles.animalCard, isSelected && styles.cardSelected]}
                                    onPress={() => toggleInterest(animal)}
                                >
                                    <Text style={[styles.animalText, isSelected && styles.textSelected]}>{animal}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateRoute}>
                    <Ionicons name="sparkles" size={20} color="#fff" />
                    <Text style={styles.generateBtnText}> Generate Optimized Route</Text>
                </TouchableOpacity>

                {/* Results Display */}
                {generatedRoute && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsHeader}>Your Optimized Route</Text>
                        <View style={styles.timeline}>
                            {generatedRoute.map((node, index) => (
                                <View key={node.id} style={styles.timelineItem}>
                                    <View style={styles.timelineNode}>
                                        <Text style={styles.timelineIndex}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.nodeName}>{node.name}</Text>
                                        {node.primaryWildlife && (
                                            <Text style={styles.nodeWildlife}>
                                                High probability: {node.primaryWildlife.join(', ')}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContent: { padding: 24, paddingBottom: 60 },
    backBtn: { marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
    
    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    timeCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
    animalCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
    cardSelected: { backgroundColor: '#00C853', borderColor: '#00C853' },
    timeText: { fontSize: 14, color: '#333', fontWeight: '500' },
    animalText: { fontSize: 16, color: '#333', fontWeight: 'bold', marginTop: 8 },
    textSelected: { color: '#fff' },

    generateBtn: { backgroundColor: '#00C853', flexDirection: 'row', padding: 18, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    generateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    resultsContainer: { marginTop: 40, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#eee' },
    resultsHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    timeline: { marginLeft: 10 },
    timelineItem: { flexDirection: 'row', marginBottom: 20 },
    timelineNode: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#00C853', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    timelineIndex: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    timelineContent: { flex: 1, justifyContent: 'center' },
    nodeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    nodeWildlife: { fontSize: 13, color: '#666', marginTop: 4 },
});