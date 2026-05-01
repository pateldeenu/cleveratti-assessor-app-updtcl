import React from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import DynamicImage from '../constants/DynamicImage';

const FloatingChatMessage = ({ message, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.messageContainer}>
      <Image
        resizeMode="cover"
        style={{width:50,height:50}}
        source={DynamicImage.chatIcon} />  
         </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    elevation:10,
    padding: 10,

  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FloatingChatMessage;
