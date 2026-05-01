import { Text, StyleSheet } from "react-native";
import React from "react";
import { FONTS } from "../constants/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomText = ({ onPress, color, fontSize, label, style }) => {
  return !onPress ? (
    <Text
      style={[
        styles.description2,
        {
          ...FONTS.latoRegularFont,
          color: color,
          marginVertical: 10,
          fontSize: fontSize,
        },
        style,
      ]}
    >
      {label}
    </Text>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={[
          styles.description2,
          {
            ...FONTS.latoRegularFont,
            color: color,
            marginVertical: 10,
            fontSize: fontSize,
          },
          style,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  description2: {
    alignItems: "flex-start",
    fontWeight: "400",
    marginTop: 0,
  },

  direction: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 30,
  },
});
