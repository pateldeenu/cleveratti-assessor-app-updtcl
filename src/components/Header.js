import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SIZES } from "../constants/Theme";
import BackArrowComponent from "./BackArrowComponent";

const HeaderComponent = ({
  containerStyle,
  onNotificationPress,
  home,
  isHelp,
}) => {
  return (
    <>
      <View style={[styles.container, containerStyle]}>
        {isHelp && <BackArrowComponent></BackArrowComponent>}
        {home ? (
          <TouchableOpacity
            style={styles.notificationWrraper}
            onPress={onNotificationPress}
          >
            <BackArrowComponent></BackArrowComponent>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
  },

  notificationWrraper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HeaderComponent;
