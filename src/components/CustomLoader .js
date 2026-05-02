import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  StyleSheet
} from "react-native";

const CustomLoader = ({
  visible = false,
  message = "Fetching data, please wait...",
  transparent = true
}) => {
  return (
    <Modal
      transparent={transparent}
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    elevation: 6,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});