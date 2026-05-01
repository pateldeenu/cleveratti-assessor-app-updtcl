import { StyleSheet, Image, View } from "react-native";
import React from "react";
import DynamicImage from "../constants/DynamicImage";
import { COLORS } from "../constants/Theme";

const MainLogo = () => {
  return (
    <View style={styles.center}>
      <Image
        resizeMode="contain"
        style={[styles.imageHeight]}
        source={DynamicImage.mainLogo}
      ></Image>
    </View>
  );
};

export default MainLogo;

const styles = StyleSheet.create({
  imageHeight: {
    width: 200,
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
  },
  center: {
    width: 200,
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
  },

  minviewsigninscreen: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    height:'100%',
    width:'100%'
},
valuxlogoimg: {
  width: 250, 
  height:250,
}
});
