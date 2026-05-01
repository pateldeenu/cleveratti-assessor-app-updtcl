import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ArrowLeftIcon from "react-native-vector-icons/AntDesign";
import { COLORS, FONTS } from "../constants/Theme";
import normalize from "react-native-normalize";

const HeaderMenuIcon = (props) => {
  let { navigation, label, onPress, onPressMenu } = props;

  return (
    <View style={{ backgroundColor: COLORS.bgBlueColor }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.viewMargin}>
          <TouchableOpacity style={styles.arrowleftTouch} onPress={onPress}>
            <ArrowLeftIcon name="left" size={23} color={COLORS.blue} />
          </TouchableOpacity>
        </View>
        <Text style={[{ ...FONTS.h3 }, styles.btnText]}>{label}</Text>
      </View>
    </View>
  );
};

export default HeaderMenuIcon;

const styles = StyleSheet.create({
  viewMargin: {
    paddingVertical: 20,
    backgroundColor: COLORS.bgBlueColor,
  },

  arrowleftTouch: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  btnText: {
    width: "75%",
    fontWeight: "700",
    color: COLORS.textColors,
    fontSize: normalize(22),
    textAlign: "center",
    lineHeight: 29,

    // textTransform: "uppercase",
  },
});
