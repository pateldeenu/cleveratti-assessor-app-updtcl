import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ArrowLeftIcon from "react-native-vector-icons/Entypo";
import { COLORS, SIZES } from "../constants/Theme";

const MenuIcon = ({ onPress, back }) => {
  return (
    <TouchableOpacity style={styles.arrowleftTouch} onPress={onPress}>
      <ArrowLeftIcon
        name={back ? "arrow-with-circle-left" : "menu"}
        style={styles.iconView}
        size={SIZES.size18}
        color={COLORS.blue}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowleftTouch: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 20,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  iconView: { justifyContent: "center", alignItems: "center" },
});

export default MenuIcon;
