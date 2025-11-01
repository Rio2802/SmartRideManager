# Offline-First Architecture

## Overview

SmartRide Manager implements a comprehensive offline-first architecture using multiple layers of data persistence and caching.

## Persistence Layers

### 1. Firebase Authentication Persistence
- **Platform**: All (iOS, Android, Web)
- **Implementation**: `getReactNativePersistence(AsyncStorage)` in `firebaseConfig.js`
- **Behavior**: User authentication state persists across app restarts
- **Storage**: AsyncStorage (React Native) or LocalStorage (Web)

### 2. Firestore Offline Support

#### Mobile (iOS/Android)
- **Important Note**: This app uses Firebase Web SDK (not native SDK)
- **Limitation**: Firestore Web SDK doesn't support automatic offline persistence in Expo/React Native
- **Solution**: AsyncStorage caching layer provides offline functionality (see below)
- **For Production**: Consider migrating to `@react-native-firebase/firestore` for full native offline support
- **Reference**: [Firebase Offline Persistence](https://firebase.google.com/docs/firestore/manage-data/enable-offline)

#### Web
- **Implementation**: `enableIndexedDbPersistence(db)` in `firebaseConfig.js`
- **Storage**: IndexedDB
- **Limitations**: Only one tab can have persistence enabled at a time

### 3. AsyncStorage Caching Layer
- **Platform**: All
- **Location**: `src/services/firestoreService.js`
- **Purpose**: Fallback caching and enhanced offline reliability
- **Implementation**:
  ```javascript
  // All get* functions support caching
  getBikes(userId, useCache = true)
  getFuels(userId, bikeId, useCache = true)
  getServices(userId, bikeId, useCache = true)
  getRides(userId, bikeId, useCache = true)
  getExpenses(userId, bikeId, useCache = true)
  ```

#### Caching Strategy
1. **On Read**:
   - Check `useCache` parameter
   - If true and offline, return cached data from AsyncStorage
   - If online, fetch from Firestore and update cache

2. **On Write**:
   - Save to Firestore
   - Update AsyncStorage cache
   - If offline, Firestore queues the write automatically

3. **Cache Keys**:
   - Bikes: `bikes_all`
   - Fuels: `fuels_{bikeId}_all`
   - Services: `services_{bikeId}_all`
   - Rides: `rides_{bikeId}_all`
   - Expenses: `expenses_{bikeId}_all`

## Offline Behavior

### Anonymous Mode
- **Storage**: AsyncStorage only (no cloud sync)
- **Data**: Persists across app restarts
- **Limitation**: Data is device-specific and not synced

### Authenticated Mode
- **When Online**:
  1. Read from Firestore cache
  2. Update from server
  3. Save to AsyncStorage as fallback
  
- **When Offline**:
  1. Read from Firestore cache (automatic)
  2. Fallback to AsyncStorage if Firestore cache empty
  3. Queue writes for sync when online

### Sync Strategy
- **Automatic**: Firestore handles all sync automatically
- **User-Initiated**: Pull-to-refresh triggers data reload
- **Background**: Not implemented (would require background tasks)

## Testing Offline Mode

### Mobile
1. Open app while online
2. Navigate to different screens (loads data into cache)
3. Enable airplane mode on device
4. Navigate to previously loaded screens - data should load from cache
5. Add new records - they will queue for sync
6. Disable airplane mode - queued writes sync automatically

### Web
1. Open app while online
2. Navigate to load data
3. Open DevTools → Network tab → Switch to "Offline"
4. Refresh page and navigate - data loads from IndexedDB
5. Switch back to "Online" - queued writes sync

## Known Limitations

1. **Image Uploads**: Require internet connection (Firebase Storage)
2. **GPS Ride Recording**: Works offline, but map tiles may not load
3. **Push Notifications**: Scheduling works offline, delivery requires internet
4. **First Launch**: Requires internet to authenticate and load initial data

## Future Enhancements

1. **Background Sync**: Implement using Expo TaskManager
2. **Conflict Resolution**: Handle simultaneous edits from multiple devices
3. **Selective Sync**: Allow users to choose what data to sync
4. **Data Size Limits**: Implement cache cleanup for old data
5. **Offline Indicator**: Show UI indicator when offline/sync in progress
