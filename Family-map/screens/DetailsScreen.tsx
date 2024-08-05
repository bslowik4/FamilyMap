import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';

interface Pin {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  value: number;
}

const DetailsScreen = ({ route, navigation }: any) => {
  const [pins, setPins] = useState(route.params.pins);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editValue, setEditValue] = useState('');

  const startEditPin = (pin: Pin) => {
    setEditingPin(pin);
    setEditTitle(pin.title);
    setEditDescription(pin.description);
    setEditValue(pin.value.toString());
  };

  const savePinChanges = () => {
    if (editingPin) {
      const updatedPins = pins.map(pin =>
        pin.coordinate === editingPin.coordinate ? { ...pin, title: editTitle, description: editDescription, value: Number(editValue) } : pin
      );
      setPins(updatedPins);
      setEditingPin(null);
    }
  };

  const deletePin = (coordinate: { latitude: number; longitude: number }) => {
    Alert.alert('Delete Pin', 'Are you sure you want to delete this pin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          const updatedPins = pins.filter(pin => pin.coordinate !== coordinate);
          setPins(updatedPins);
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pin Titles</Text>
      <FlatList
        data={pins}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Pin }) => (
          <View style={styles.pinContainer}>
            <Text style={styles.pinTitle}>{item.title}</Text>
            <Button title="Edit" onPress={() => startEditPin(item)} />
            <Button title="Delete" onPress={() => deletePin(item.coordinate)} />
          </View>
        )}
      />
      {editingPin && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Edit Title"
          />
          <TextInput
            style={styles.input}
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Edit Description"
          />
          <TextInput
            style={styles.input}
            value={editValue}
            onChangeText={setEditValue}
            placeholder="Edit Value"
            keyboardType="numeric"
          />
          <Button title="Save" onPress={savePinChanges} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pinContainer: {
    marginBottom: 8,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinTitle: {
    fontSize: 18,
  },
  editContainer: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
});

export default DetailsScreen;
