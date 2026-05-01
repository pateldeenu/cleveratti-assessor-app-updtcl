// components/Loader.js
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const Loader = ({ loading, text = "Loading..." }) => {
  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#4284f3" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  text: {
    marginTop: 10,
    color: "#FF6347",
    fontSize: 16,
  },
});