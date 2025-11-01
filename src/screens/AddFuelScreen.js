import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useBike } from '../context/BikeContext';
import { useData } from '../context/DataContext';
import { calculateMileage } from '../utils/calculations';

const AddFuelScreen = ({ navigation }) => {
  const { selectedBike } = useBike();
  const { fuels, loadFuels, addFuelRecord } = useData();
  const [odometer, setOdometer] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [station, setStation] = useState('');
  const [calculatedMileage, setCalculatedMileage] = useState(null);

  useEffect(() => {
    if (selectedBike) {
      loadFuels(selectedBike.id);
      setOdometer(selectedBike.currentOdometer.toString());
    }
  }, [selectedBike]);

  useEffect(() => {
    if (odometer && liters && fuels.length > 0) {
      const previousOdometer = fuels[0]?.odometer;
      const mileage = calculateMileage(
        parseFloat(odometer),
        previousOdometer,
        parseFloat(liters)
      );
      setCalculatedMileage(mileage);
    }
  }, [odometer, liters, fuels]);

  const handleSave = async () => {
    if (!odometer || !liters || !cost) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const fuelData = {
      odometer: parseFloat(odometer),
      liters: parseFloat(liters),
      cost: parseFloat(cost),
      pricePerLiter: (parseFloat(cost) / parseFloat(liters)).toFixed(2),
      station,
      mileage: calculatedMileage,
      date: new Date(),
    };

    const result = await addFuelRecord(fuelData);
    if (result.success) {
      Alert.alert('Success', 'Fuel record added successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Odometer (km) *</Text>
        <TextInput
          style={styles.input}
          value={odometer}
          onChangeText={setOdometer}
          placeholder="Current odometer reading"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Liters *</Text>
        <TextInput
          style={styles.input}
          value={liters}
          onChangeText={setLiters}
          placeholder="Fuel amount in liters"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Total Cost *</Text>
        <TextInput
          style={styles.input}
          value={cost}
          onChangeText={setCost}
          placeholder="Total cost"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Station</Text>
        <TextInput
          style={styles.input}
          value={station}
          onChangeText={setStation}
          placeholder="Gas station name (optional)"
        />

        {calculatedMileage && (
          <View style={styles.mileageContainer}>
            <Text style={styles.mileageLabel}>Calculated Mileage:</Text>
            <Text style={styles.mileageValue}>{calculatedMileage} km/L</Text>
          </View>
        )}

        {!calculatedMileage && fuels.length === 0 && (
          <Text style={styles.infoText}>
            Add another fuel record to calculate mileage
          </Text>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Fuel Record</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  mileageContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  mileageLabel: {
    fontSize: 14,
    color: '#666',
  },
  mileageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34A853',
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddFuelScreen;
