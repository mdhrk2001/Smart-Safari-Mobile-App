// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom asset extensions here
config.resolver.assetExts.push(
  'tflite', // For TensorFlow Lite models
  'txt'     // Often needed for model label files
);

module.exports = config;