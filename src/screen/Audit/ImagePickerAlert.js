import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';



const ImagePickerAlert = ({ isVisible, onCameraPress, onGalleryPress, onCancel }) => {

  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
    <View style={styles.container}>
      <View style={styles.dialog}>
        <TouchableOpacity onPress={onCameraPress}>
          <Text style={styles.option}>Take Photo from Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGalleryPress}>
          <Text style={styles.option}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  option: {
    fontSize: 18,
    paddingVertical: 10,
  },
  cancel: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'red',
  },
});

export default ImagePickerAlert;
