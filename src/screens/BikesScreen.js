import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useBike } from '../context/BikeContext';

const BikesScreen = ({ navigation }) => {
  const { bikes, selectedBike, selectBike } = useBike();

  const renderBike = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bikeCard,
        selectedBike && selectedBike.id === item.id && styles.selectedBike
      ]}
      onPress={() => selectBike(item)}
    >
      <Text style={styles.bikeName}>{item.name}</Text>
      <Text style={styles.bikeInfo}>Model: {item.model}</Text>
      <Text style={styles.bikeInfo}>Year: {item.year}</Text>
      <Text style={styles.bikeInfo}>Odometer: {item.currentOdometer} km</Text>
      {selectedBike && selectedBike.id === item.id && (
        <Text style={styles.selectedText}>✓ Selected</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bikes}
        renderItem={renderBike}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bikes added yet</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddBike')}
      >
        <Text style={styles.addButtonText}>+ Add Bike</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  bikeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedBike: {
    borderColor: '#4285F4',
    borderWidth: 2,
  },
  bikeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bikeInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  selectedText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BikesScreen;
