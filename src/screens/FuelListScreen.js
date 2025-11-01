import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useBike } from '../context/BikeContext';
import { useData } from '../context/DataContext';
import { exportFuelsToCSV } from '../utils/exportUtils';
import { format } from 'date-fns';

const FuelListScreen = ({ navigation }) => {
  const { selectedBike } = useBike();
  const { fuels, loadFuels } = useData();

  useEffect(() => {
    if (selectedBike) {
      loadFuels(selectedBike.id);
    }
  }, [selectedBike]);

  const handleExport = async () => {
    const result = await exportFuelsToCSV(fuels);
    if (result.success) {
      alert('Fuel records exported successfully');
    } else {
      alert('Export failed: ' + result.error);
    }
  };

  const renderFuel = ({ item }) => (
    <View style={styles.fuelCard}>
      <Text style={styles.fuelDate}>
        {item.date ? format(new Date(item.date.seconds * 1000), 'MMM dd, yyyy') : 'N/A'}
      </Text>
      <Text style={styles.fuelInfo}>Odometer: {item.odometer} km</Text>
      <Text style={styles.fuelInfo}>Liters: {item.liters} L</Text>
      <Text style={styles.fuelInfo}>Cost: ${item.cost?.toFixed(2)}</Text>
      {item.mileage && (
        <Text style={styles.mileageText}>Mileage: {item.mileage} km/L</Text>
      )}
      {item.station && (
        <Text style={styles.fuelInfo}>Station: {item.station}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fuels}
        renderItem={renderFuel}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No fuel records yet</Text>
        }
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.exportButton]}
          onPress={handleExport}
          disabled={fuels.length === 0}
        >
          <Text style={styles.buttonText}>Export CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => navigation.navigate('AddFuel')}
        >
          <Text style={styles.buttonText}>+ Add Fuel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fuelCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fuelDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fuelInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mileageText: {
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
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4285F4',
  },
  exportButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FuelListScreen;
