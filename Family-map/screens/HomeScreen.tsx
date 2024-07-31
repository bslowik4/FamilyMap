import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, UrlTile, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Pin } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=";

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
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
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
    if (query.length > 2) {
      try {
        const response = await fetch(`${NOMINATIM_BASE_URL}${query}`);
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
      ...region,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });
    setSearchResults([]);
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
        onLongPress={handleLongPress}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
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
