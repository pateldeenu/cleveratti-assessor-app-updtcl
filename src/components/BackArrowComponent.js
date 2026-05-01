import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ArrowLeftIcon from "react-native-vector-icons/AntDesign";
import { COLORS } from "../constants/Theme";

const BackArrowComponent = ({ onPress, nameIcon }) => {
  return (
    <TouchableOpacity style={styles.arrowleftTouch} onPress={onPress}>
      <ArrowLeftIcon
        name={!nameIcon ? "left" : nameIcon}
        style={styles.iconView}
        size={25}
        color={COLORS.blue}
      />
    </TouchableOpacity>
  );
};

export default BackArrowComponent;

const styles = StyleSheet.create({
  arrowleftTouch: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 20,
    marginBottom: 30,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  iconView: { justifyContent: "center", alignItems: "center" },
});
