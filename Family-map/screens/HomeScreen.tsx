import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Pin } from '../types'; // Adjust import path as needed

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=";

const ZOOM_LEVEL = 14;
const LATITUDE_DELTA = 360 / Math.pow(2, ZOOM_LEVEL); // Approximate for zoom level 14
const LONGITUDE_DELTA = 360 / Math.pow(2, ZOOM_LEVEL); // Approximate for zoom level 14

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const updateLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  const handleLongPress = (event: any) => {
    setCurrentCoordinate(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleAddPin = () => {
    if (currentCoordinate) {
      const newPin: Pin = {
        coordinate: currentCoordinate,
        title: title,
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

  const handleSearch = async () => {
    if (query.length > 2 && location) {
      const { latitude, longitude } = location;
      const viewbox = `${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}`;

      try {
        const response = await fetch(`${NOMINATIM_BASE_URL}${query}&viewbox=${viewbox}&bounded=1`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleSelectResult = (result: any) => {
    const { lat, lon } = result;
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    setSelectedCoordinate({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    setSearchResults([]);
  };

  const handleChangeMarkerToPin = () => {
    if (selectedCoordinate) {
      const newPin: Pin = {
        coordinate: selectedCoordinate,
        title: title,
        description: description,
        value: Number(value),
      };
      setPins([...pins, newPin]);
      setSelectedCoordinate(null);
      setTitle('');
      setDescription('');
      setValue('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectResult(item)}>
              <Text style={styles.resultText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onLongPress={handleLongPress}
      >
        {location && (
          <Marker
            coordinate={location}
            title="You are here"
            pinColor="blue"
          />
        )}
        {pins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={pin.coordinate}
            title={pin.title}
            description={`Description: ${pin.description}, Value: ${pin.value}`}
          />
        ))}
        {selectedCoordinate && (
          <Marker
            coordinate={selectedCoordinate}
            title="Selected Location"
            pinColor="red"
          />
        )}
      </MapView>
      
      <Button
        title="Update Location"
        onPress={updateLocation}
      />
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
            <Button title="Change Marker to Pin" onPress={handleChangeMarkerToPin} />
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
  searchContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    zIndex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;
