import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/Theme";
import appText from "../utils/Localization/localization";

const NoData = ({ onPress, message }) => {
   console.log("--:message--",message)
    const displayText =
    typeof message === "string" && message.trim().length > 0
      ? message
      : appText.noDataFound;


  return (
    <View style={styles.constianer}>
      <Text style={styles.textStyle}>{displayText}</Text>
    </View>
  );
};
export default NoData;

const styles = StyleSheet.create({
  constianer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textStyle: {
    fontWeight: "700",
    color: COLORS.textColors,
    alignSelf: "center",
    fontSize: 22,
    color: COLORS.orange,
  },
});
