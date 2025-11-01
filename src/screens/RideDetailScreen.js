import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { formatDuration } from '../utils/calculations';
import { exportRideToGPX } from '../utils/exportUtils';
import { format } from 'date-fns';

const RideDetailScreen = ({ route }) => {
  const { ride } = route.params;

  const handleExportGPX = async () => {
    const result = await exportRideToGPX(ride);
    if (result.success) {
      Alert.alert('Success', 'GPX file exported successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const region = ride.coordinates && ride.coordinates.length > 0 ? {
    latitude: ride.coordinates[0].latitude,
    longitude: ride.coordinates[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.rideName}>{ride.name}</Text>
        <Text style={styles.rideDate}>
          {ride.startTime ? format(new Date(ride.startTime.seconds * 1000), 'MMM dd, yyyy HH:mm') : 'N/A'}
        </Text>
      </View>

      {region && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
          >
            {ride.coordinates && ride.coordinates.length > 0 && (
              <Polyline
                coordinates={ride.coordinates}
                strokeColor="#4285F4"
                strokeWidth={4}
              />
            )}
          </MapView>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{ride.distance} km</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{formatDuration(ride.duration)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Speed</Text>
          <Text style={styles.statValue}>{ride.avgSpeed} km/h</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Max Speed</Text>
          <Text style={styles.statValue}>{ride.maxSpeed} km/h</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleExportGPX}>
        <Text style={styles.exportButtonText}>Export as GPX</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  rideName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    margin: '1%',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginTop: 5,
  },
  exportButton: {
    backgroundColor: '#34A853',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideDetailScreen;
