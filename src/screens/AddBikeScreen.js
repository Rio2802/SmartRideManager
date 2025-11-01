import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useBike } from '../context/BikeContext';

const AddBikeScreen = ({ navigation }) => {
  const { addBike } = useBike();
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [currentOdometer, setCurrentOdometer] = useState('');

  const handleSave = async () => {
    if (!name || !model || !currentOdometer) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const bikeData = {
      name,
      model,
      year: parseInt(year) || new Date().getFullYear(),
      currentOdometer: parseFloat(currentOdometer) || 0,
    };

    const result = await addBike(bikeData);
    if (result.success) {
      Alert.alert('Success', 'Bike added successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., My Honda"
        />

        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="e.g., Honda CBR 650R"
        />

        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          placeholder="e.g., 2023"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Current Odometer (km) *</Text>
        <TextInput
          style={styles.input}
          value={currentOdometer}
          onChangeText={setCurrentOdometer}
          placeholder="e.g., 5000"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Bike</Text>
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

export default AddBikeScreen;
