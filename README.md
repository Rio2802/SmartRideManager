# SmartRide Manager

A comprehensive cross-platform mobile application for tracking vehicle maintenance, fuel consumption, services, expenses, and GPS-tracked rides. Built with React Native (Expo) and Firebase.

## Features

### Core Functionality
- **Authentication**: Optional Google Sign-In or anonymous mode
- **Multi-Bike Management**: Add and manage multiple vehicles
- **Fuel Tracking**: Record fuel fill-ups with automatic mileage calculations
- **Service Tracking**: Log maintenance services with reminder notifications
- **Expense Management**: Track all vehicle-related expenses with receipt attachments
- **GPS Ride Recording**: Track rides with real-time GPS, view on map, and export as GPX
- **Analytics & Charts**: Visualize monthly fuel costs, expense breakdowns, and mileage trends
- **Offline-First**: Local caching with automatic cloud sync when online
- **Data Export**: Export fuel, service, and expense data as CSV; export rides as GPX

### Technical Features
- Firebase Authentication (Google + Anonymous)
- Firestore for real-time data sync
- Firebase Storage for receipt and image uploads
- Local notifications for service reminders
- React Navigation for seamless app navigation
- Context API for state management
- Victory Native for beautiful charts
- Comprehensive unit tests with Jest

## Project Structure

```
smartride-manager/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── firestore.rules             # Firebase Security Rules
├── .env.example                # Environment variables template
├── src/
│   ├── screens/                # All app screens
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── BikesScreen.js
│   │   ├── AddBikeScreen.js
│   │   ├── FuelListScreen.js
│   │   ├── AddFuelScreen.js
│   │   ├── ServiceListScreen.js
│   │   ├── AddServiceScreen.js
│   │   ├── ExpenseListScreen.js
│   │   ├── AddExpenseScreen.js
│   │   ├── RideRecordScreen.js
│   │   ├── RideHistoryScreen.js
│   │   ├── RideDetailScreen.js
│   │   └── SettingsScreen.js
│   ├── components/             # Reusable components
│   ├── services/               # Firebase and service integrations
│   │   ├── firebaseConfig.js
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   ├── storageService.js
│   │   └── notificationService.js
│   ├── context/                # React Context providers
│   │   ├── AuthContext.js
│   │   ├── BikeContext.js
│   │   └── DataContext.js
│   ├── navigation/             # Navigation configuration
│   │   └── AppNavigator.js
│   ├── utils/                  # Utility functions
│   │   ├── calculations.js
│   │   └── exportUtils.js
│   └── constants/              # App constants
├── __tests__/                  # Unit tests
│   ├── calculations.test.js
│   └── notifications.test.js
└── assets/                     # Images and assets
```

## Database Schema

### Firestore Collections

#### `bikes`
```javascript
{
  userId: string,
  name: string,
  model: string,
  year: number,
  currentOdometer: number,
  imageUrl: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `fuels`
```javascript
{
  userId: string,
  bikeId: string,
  odometer: number,
  liters: number,
  cost: number,
  pricePerLiter: number,
  station: string (optional),
  mileage: number (calculated),
  date: timestamp,
  createdAt: timestamp
}
```

#### `services`
```javascript
{
  userId: string,
  bikeId: string,
  type: string,
  description: string,
  odometer: number,
  cost: number,
  nextServiceKm: number (optional),
  date: timestamp,
  createdAt: timestamp
}
```

#### `rides`
```javascript
{
  userId: string,
  bikeId: string,
  name: string,
  coordinates: array of {latitude, longitude, altitude, timestamp},
  startTime: timestamp,
  endTime: timestamp,
  duration: number (milliseconds),
  distance: number (km),
  avgSpeed: number,
  maxSpeed: number,
  createdAt: timestamp
}
```

#### `expenses`
```javascript
{
  userId: string,
  bikeId: string,
  category: string,
  description: string,
  amount: number,
  receiptUrl: string (optional),
  date: timestamp,
  createdAt: timestamp
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Firebase project created

### 1. Clone and Install

```bash
git clone <repository-url>
cd smartride-manager
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Google and Anonymous providers)
3. Create a Firestore database (start in test mode, then apply security rules)
4. Enable Firebase Storage
5. Get your Firebase configuration

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase credentials:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Google Sign-In Setup

1. In Firebase Console, enable Google Authentication
2. For iOS: Add iOS app in Firebase and download `GoogleService-Info.plist`
3. For Android: Add Android app in Firebase and download `google-services.json`
4. Get your Web Client ID from Firebase Console → Authentication → Sign-in method → Google

### 5. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps SDK for Android and iOS
3. Create API credentials
4. Add the API key to your `.env` file and `app.json`

### 6. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 7. Run the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### 8. Testing on Physical Device

1. Install Expo Go app on your iOS or Android device
2. Scan the QR code from the Expo development server
3. The app will load on your device

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Key Implementation Details

### Mileage Calculation

The app calculates fuel mileage using the formula:
```javascript
mileage = (current_odometer - previous_fill_odometer) / liters_filled
```

If there's no previous fuel record, the calculation is skipped for the first entry. Subsequent entries will use the previous odometer reading.

### GPS Ride Tracking

- Uses `expo-location` for foreground GPS tracking
- Records coordinates every 5 seconds or 10 meters
- Calculates distance using Haversine formula
- Computes average and maximum speed
- Exports polyline as GPX format

### Service Reminders

- Local notifications using `expo-notifications`
- Checks service due by kilometers OR date
- Schedules reminders when next service is approaching
- Notifications appear even when app is closed

### Offline Support

- All data cached locally using AsyncStorage
- Reads from cache when offline
- Automatically syncs to Firestore when online
- Anonymous users work entirely offline

### Data Security

- Firestore security rules enforce user isolation
- Each user can only access their own data
- Receipt images stored in user-specific Firebase Storage paths
- No data shared between users

## Building for Production

### Android

```bash
# Build APK
eas build --platform android

# Or using Expo classic build
expo build:android
```

### iOS

```bash
# Build IPA
eas build --platform ios

# Or using Expo classic build
expo build:ios
```

## CI/CD

The project includes a GitHub Actions workflow that:
- Runs unit tests on every push and PR
- Lints the code
- Builds the Expo app

## Known Limitations

### Offline Support
This app uses the Firebase Web SDK which has limited offline persistence in React Native/Expo. An AsyncStorage caching layer provides basic offline functionality, but for production use with robust offline support, consider migrating to `@react-native-firebase` which uses the native Firebase SDK with full offline capabilities.

### Web Version
The web build has compatibility issues due to React Native modules. This is a mobile-first app designed for iOS/Android using Expo Go.

## Future Enhancements

- Migrate to `@react-native-firebase` for full native offline support
- Cloud-scheduled notifications using Firebase Cloud Functions
- PDF export for comprehensive reports
- Advanced chart filtering by date range
- Multi-bike comparison charts
- Social features for sharing rides
- Integration with OBD-II devices
- Maintenance cost predictions using ML

## Troubleshooting

### Google Sign-In not working
- Ensure `GOOGLE_WEB_CLIENT_ID` is correct in `.env`
- Verify Google authentication is enabled in Firebase
- Check SHA-1 fingerprint is added to Firebase (Android)

### Maps not displaying
- Verify Google Maps API key is correct
- Check Maps SDK is enabled for your platform
- Ensure API key has no restrictions blocking your app

### Notifications not showing
- Request notification permissions on app start
- Check notification settings in device Settings app
- Android: Verify notification channel is created

## License

MIT

## Support

For issues and feature requests, please create an issue on GitHub.
