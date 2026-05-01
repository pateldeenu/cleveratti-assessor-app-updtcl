import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { FONTS } from "../../constants/Theme";
import Modal from "react-native-modal";
const LogoutModal = (props) => {
  let { isVisible, cancel, title, message, onYesPress, yesTitle, cancelTitle } =
    props;
  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <View style={styles.container}>
        <View style={{ padding: 26 }}>
          <Text style={styles.logoutText}>{title}</Text>
          <Text style={styles.logoutTextQues}>{message}</Text>
        </View>
        <View style={styles.border} />
        <View style={styles.center}>
          <TouchableOpacity
            style={styles.widthSyle}
            onPress={() => {
              onYesPress();
            }}
          >
            <Text style={styles.yesText}>{yesTitle}</Text>
          </TouchableOpacity>
          <View style={styles.viewStyle} />
          <TouchableOpacity
            style={styles.widthSyle}
            onPress={() => {
              cancel();
            }}
          >
            <Text style={styles.cancelText}>{cancelTitle}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  border: { borderWidth: 0.5, backgroundColor: "rgba(0, 0, 0, 1)" },
  logoutText: {
    ...FONTS.h3,
    marginBottom: scale(13),
    textAlign: "center",
    fontSize: 18,
  },
  widthSyle: { width: "50%" },
  logoutTextQues: {
    ...FONTS.latoRegularFont,
    textAlign: "center",
    fontSize: 16,
    color: "rgba(69, 69, 69, 1)",
    marginBottom: 20,
  },
  center: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  modal: { alignItems: "center", justifyContent: "center", flex: 1 },
  cancelText: {
    ...FONTS.h3,
    color: "rgba(0, 125, 204, 1)",
    textAlign: "center",
  },
  viewStyle: {
    height: scale(50),
    backgroundColor: "rgba(0, 0, 0, 1)",
    width: 1,
  },
  yesText: {
    ...FONTS.h3,
    color: "rgba(0, 125, 204, 1)",
    textAlign: "center",
    alignSelf: "center",
  },
});

export default LogoutModal;
