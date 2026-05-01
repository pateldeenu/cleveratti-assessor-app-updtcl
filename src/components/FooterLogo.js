import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants/Theme";
import { useTheme } from "../utils/Appearance";
import appText from "../utils/Localization/localization";

const FooterLogo = (props) => {
  const { bottomMargin } = props;

  let { colors } = useTheme();

  return (
    <View style={[styles.viewLayout, { bottom: bottomMargin }]}>
      <Text
        style={[
          styles.description,
          { ...FONTS.h4roboto, color: colors.textHeadingColor, fontSize: 14 },
        ]}
      >
        {appText.poweredby}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    // alignItems: "flex-start",
  },

  viewLayout: {
    //height: 20,
    flexDirection: "row",
    // position: "absolute",
    alignSelf: "center",
    // backgroundColor: COLORS.white,
  },
  imageSize: { marginHorizontal: 5 },
  logo: {
    height: "80%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default FooterLogo;
