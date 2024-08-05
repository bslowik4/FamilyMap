import React from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: any[];
  handleSearch: () => Promise<void>;
  handleSelectResult: (result: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, searchResults, handleSearch, handleSelectResult }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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

export default SearchBar;
