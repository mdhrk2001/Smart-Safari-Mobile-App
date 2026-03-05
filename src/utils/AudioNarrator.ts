// src/utils/AudioNarrator.ts

import * as Speech from 'expo-speech';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av'; // Updated imports

// Supported languages as per the project requirements
export type SupportedLanguage = 'en' | 'si' | 'ta';

const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
    'en': 'en-US', // English
    'si': 'si-LK', // Sinhala (Requires Sinhala TTS pack on device)
    'ta': 'ta-IN'  // Tamil (ta-IN is more reliably pre-installed offline than ta-LK)
};

/**
 * Speaks the provided text in the specified language, overriding silent mode
 * and ducking background music.
 */
export const speakNarration = async (text: string, lang: SupportedLanguage = 'en') => {
    // 1. Stop any ongoing speech before starting a new one
    Speech.stop();

    // 2. Configure the OS Audio Session
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true, // Forces audio even if iPhone switch is on Silent
            interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Updated constant
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Updated constant
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    } catch (error) {
        console.warn('Failed to set audio mode for ducking:', error);
    }

    // 3. Play the narration
    Speech.speak(text, {
        language: LANGUAGE_CODES[lang],
        pitch: 1.0,
        rate: 0.9, // Slightly slower rate for clearer educational narration
        onDone: () => console.log('Narration finished'),
        onError: (err) => console.error('TTS Error:', err),
    });
};

/**
 * Stops the current narration.
 */
export const stopNarration = () => {
    Speech.stop();
};