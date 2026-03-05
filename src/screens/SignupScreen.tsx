// src/screens/SignupScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Adjust path if needed

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subHeader}>Start your wildlife journey</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
             <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
             <TextInput 
                style={styles.input} 
                placeholder="Your name" 
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
             />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
             <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
             <TextInput 
                style={styles.input} 
                placeholder="your@email.com" 
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
             />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
             <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
             <TextInput 
                style={styles.input} 
                placeholder="........" 
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
             />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>G   Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 24, justifyContent: 'center', flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 12 },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#333' },
  signupButton: { backgroundColor: '#00C853', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 24 },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  orText: { marginHorizontal: 16, color: '#999', fontSize: 14 },
  googleButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 16, alignItems: 'center' },
  googleText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  loginText: { color: '#666', fontSize: 14, fontWeight: 'bold' },
  loginLink: { color: '#00C853', fontSize: 14, fontWeight: 'bold' },
});