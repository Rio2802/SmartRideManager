# Mobile App Development Note

## Important: This is a Mobile-First Application

SmartRide Manager is designed primarily for **mobile devices** (iOS and Android) using React Native and Expo. 

### Running the App

**Recommended Method (Mobile):**
1. Install Expo Go on your iOS or Android device
2. Run `npm start` in the project directory
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)
4. The app will load on your device

**Alternative Methods:**
- iOS Simulator (Mac only): Run `npm run ios`
- Android Emulator: Run `npm run android`

### Web Support Limitation

The web version (`npm run web`) may have compatibility issues due to React Native's mobile-first architecture. Some React Native modules don't have web equivalents, which can cause bundling errors.

**If you need web support**, you would need to:
1. Use `react-native-web` polyfills for all native modules
2. Configure webpack to handle React Native imports
3. Potentially create separate web components for features that use native modules (GPS, notifications, etc.)

### Development Environment

This project runs in Replit, which is excellent for development, but:
- The primary testing should be done on physical devices or emulators
- Use Expo Go app to test on your phone/tablet
- The Expo QR code allows instant testing on multiple devices

### Production Deployment

For production builds:
- **iOS**: Use `eas build --platform ios` (requires Apple Developer account)
- **Android**: Use `eas build --platform android`
- Or use Expo's classic build service: `expo build:ios` or `expo build:android`

This is standard practice for React Native mobile development.
