import React from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

interface PinModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddPin: () => void;
  handleChangeMarkerToPin: () => void;
}

const PinModal: React.FC<PinModalProps> = ({
  modalVisible,
  setModalVisible,
  title,
  setTitle,
  description,
  setDescription,
  value,
  setValue,
  handleAddPin,
  handleChangeMarkerToPin,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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

export default PinModal;
