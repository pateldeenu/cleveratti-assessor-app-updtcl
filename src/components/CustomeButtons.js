import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/Theme";

const CustomeButtons = ({
  label,
  buttonContainerStyle,
  labelStyle,
  onPresss,
  isdisabled,
  textColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.btn, buttonContainerStyle]}
      onPress={onPresss}
      disabled={isdisabled ? isdisabled : false}
    >
      <Text
        style={[
          styles.btnText,
          // { color: textColor, fontWeight: "600" },
          { color: textColor, fontWeight: "10" },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
export default CustomeButtons;
const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
    // fontWeight: "100",
    fontSize: 12,

    // textTransform: "uppercase",
  },
});
