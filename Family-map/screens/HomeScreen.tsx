import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Pin {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

const HomeScreen = ({ navigation }) => {
  const [pins, setPins] = useState<Pin[]>([]);

  const handleLongPress = (event: any) => {
    const newPin: Pin = {
      coordinate: event.nativeEvent.coordinate,
      description: 'Marker description',
    };
    setPins([...pins, newPin]);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onLongPress={handleLongPress}>
        {pins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={pin.coordinate}
            title="Marker"
            description={pin.description}
          />
        ))}
      </MapView>
      <Button
        title="Show Details"
        onPress={() => navigation.navigate('Details')}
      />
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
});

export default HomeScreen;
