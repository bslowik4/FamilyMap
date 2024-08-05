import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { RootStackParamList, Pin } from '../types';
import SearchBar from './SearchBar';
import PinModal from './PinModal';
import Map from './Map';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=";

const ZOOM_LEVEL = 14;
const LATITUDE_DELTA = 360 / Math.pow(2, ZOOM_LEVEL);
const LONGITUDE_DELTA = 360 / Math.pow(2, ZOOM_LEVEL);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);

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

  const handleChangeMarkerToPin = () => {
    if (selectedCoordinate) {
      setCurrentCoordinate(selectedCoordinate);
      setSelectedCoordinate(null);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        searchResults={searchResults}
        handleSearch={handleSearch}
        handleSelectResult={handleSelectResult}
      />

      <Map
        region={region}
        location={location}
        pins={pins}
        selectedCoordinate={selectedCoordinate}
        setRegion={setRegion}
        setCurrentCoordinate={setCurrentCoordinate}
        setModalVisible={setModalVisible}
      />

      <Button
        title="Update Location"
        onPress={updateLocation}
      />
      <Button
        title="View Details"
        onPress={() => navigation.navigate('Details', { pins })}
      />
      
      <Button
        title="Change Marker to Pin"
        onPress={handleChangeMarkerToPin}
        disabled={!selectedCoordinate}
      />

      <PinModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        value={value}
        setValue={setValue}
        handleAddPin={handleAddPin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
