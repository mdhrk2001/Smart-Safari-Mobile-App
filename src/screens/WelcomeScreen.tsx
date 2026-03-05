import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    // 1. Wrap the entire screen in ImageBackground
    <ImageBackground 
      source={require('../../assets/bgphoto.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* 2. Add an overlay view to darken the image slightly so text pops */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>

            {/* Top Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>WildLens</Text>
              <Text style={styles.subtitle}>Your Intelligent Safari Companion</Text>
            </View>
            
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/WildLensLogo.png')}
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>

            {/* Bottom Action Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.buttonText}>Start Adventure</Text>
              </TouchableOpacity>
              
              <Text style={styles.langText}>English • සිංහල • தமிழ்</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // New styles for the background and overlay
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 32, 39, 0.45)' }, // 65% opacity dark blue/black
  
  // Updated container (removed the solid background color)
  container: { flex: 1 }, 
  content: { flex: 1, justifyContent: 'space-between', padding: 24 },

  logoContainer: { alignItems: 'center' },
  logo: { width: 150, height: 150, marginBottom: 20, borderRadius: 100 }, 
  
  bottomSection: { alignItems: 'center', marginBottom: 40 },
  button: { 
    backgroundColor: '#00C853', 
    paddingVertical: 16, 
    paddingHorizontal: 60, 
    borderRadius: 30, 
    marginBottom: 20,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }, 
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  langText: { color: '#cfd8dc', fontSize: 14 },

  textContainer: { alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: '#e0e0e0', fontWeight: '600' },
});