import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/Theme";
const CustomeButton = ({
  label,
  buttonContainerStyle,
  labelStyle,
  onPress,
  isdisabled,
  textColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.btn, buttonContainerStyle]}
      onPress={onPress}
      disabled={isdisabled ? isdisabled : false}
    >
      <Text
        style={[
          styles.btnText,
          { color: textColor, fontWeight: "600" },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
export default CustomeButton;
const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize:12,
  },
});
