// src/screens/ProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
    const [pushEnabled, setPushEnabled] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Manage your preferences</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Section 1: Language & Audio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Language & Audio</Text>
                    
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <Ionicons name="globe-outline" size={20} color="#00C853" style={styles.icon} />
                            <View style={styles.settingTextContent}>
                                <Text style={styles.settingLabel}>Audio Narration Language</Text>
                                {/* Simulated Dropdown UI */}
                                <View style={styles.dropdownBox}>
                                    <Text style={styles.dropdownText}>English</Text>
                                    <Ionicons name="chevron-down" size={16} color="#333" />
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingRow}>
                            <Ionicons name="download-outline" size={20} color="#00C853" style={styles.icon} />
                            <View style={styles.settingTextContent}>
                                <Text style={styles.settingLabel}>Download Offline Maps</Text>
                                <Text style={styles.settingSubtext}>Yala National Park - 45 MB</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section 2: Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <Ionicons name="notifications-outline" size={20} color="#00C853" style={styles.icon} />
                            <View style={styles.settingTextContent}>
                                <Text style={styles.settingLabel}>Push Notifications</Text>
                                <Text style={styles.settingSubtext}>Get alerts for geofence zones</Text>
                            </View>
                            <Switch 
                                trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
                                thumbColor={pushEnabled ? '#00C853' : '#f4f3f4'}
                                onValueChange={setPushEnabled}
                                value={pushEnabled}
                            />
                        </View>
                    </View>
                </View>

                {/* Section 3: Data & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data & Privacy</Text>
                    
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.settingRow}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#00C853" style={styles.icon} />
                            <Text style={[styles.settingLabel, { flex: 1 }]}>Privacy Policy</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.settingRow}>
                            <Ionicons name="cloud-download-outline" size={20} color="#00C853" style={styles.icon} />
                            <Text style={[styles.settingLabel, { flex: 1 }]}>Download My Data</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section 4: Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.settingRow}>
                            <Ionicons name="help-circle-outline" size={20} color="#00C853" style={styles.icon} />
                            <Text style={[styles.settingLabel, { flex: 1 }]}>Help & FAQ</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.versionText}>Version 1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 24, paddingBottom: 10 },
    backBtn: { marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' }, // "Settings" [cite: 777]
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 }, // "Manage your preferences" [cite: 778]
    scrollContent: { padding: 20, paddingBottom: 40 },
    
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 }, // e.g., "Language & Audio" [cite: 779]
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee' },
    settingRow: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 16, width: 24 },
    settingTextContent: { flex: 1 },
    settingLabel: { fontSize: 16, color: '#333', fontWeight: '500' }, // e.g., "Audio Narration Language" [cite: 780]
    settingSubtext: { fontSize: 13, color: '#999', marginTop: 4 }, // e.g., "Yala National Park - 45 MB" [cite: 784]
    
    dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10, backgroundColor: '#f9f9f9' },
    dropdownText: { fontSize: 14, color: '#333' }, // "English" [cite: 781]
    
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 16 },
    versionText: { textAlign: 'center', color: '#ccc', fontSize: 14, marginTop: 20 } // "Version 1.0.0" [cite: 796]
});