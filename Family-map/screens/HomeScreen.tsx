import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Pin {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  value: number;
}

const HomeScreen = ({ navigation }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleLongPress = (event: any) => {
    setCurrentCoordinate(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleAddPin = () => {
    if (currentCoordinate) {
      const newPin: Pin = {
        coordinate: currentCoordinate,
        title: title + pins.length,
        description: description,
        value: Number(value),
      };
      setPins([...pins, newPin]);
      setTitle('');
      setDescription('');
      setValue('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onLongPress={handleLongPress}>
        {pins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={pin.coordinate}
            title={pin.title}
            description={`Description: ${pin.description}, Value: ${pin.value}`}
          />
        ))}
      </MapView>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('Details', { pins })}
      />
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Pin</Text>
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              placeholder="Value"
              style={styles.input}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />
            <Button title="Add Pin" onPress={handleAddPin} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default HomeScreen;
