import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Pin {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  value: number;
}

const DetailsScreen = ({ route }: any) => {
  const { pins } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pin Titles</Text>
      <FlatList
        data={pins}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Pin }) => (
          <View style={styles.pinContainer}>
            <Text style={styles.pinTitle}>{item.title}</Text>
          </View>
        )}
      />
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
  },
  pinTitle: {
    fontSize: 18,
  },
});

export default DetailsScreen;
