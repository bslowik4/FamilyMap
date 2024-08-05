import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';

interface MapComponentProps {
  region: Region;
  location: { latitude: number; longitude: number } | null;
  pins: Pin[];
  selectedCoordinate: { latitude: number; longitude: number } | null;
  setRegion: React.Dispatch<React.SetStateAction<Region>>;
  setCurrentCoordinate: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number } | null>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapComponent: React.FC<MapComponentProps> = ({
  region,
  location,
  pins,
  selectedCoordinate,
  setRegion,
  setCurrentCoordinate,
  setModalVisible,
}) => {
  const handleLongPress = (event: any) => {
    setCurrentCoordinate(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  return (
    <MapView
      style={{ flex: 1 }}
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
  );
};

export default MapComponent;
