import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../utils/Appearance";
// import { ColorDotsLoader,
// } from "react-native-indicator";
import Spinner from 'react-native-animated-spinkit';
import { FONTS, SIZES } from "../constants/Theme";
import normalize from "react-native-normalize";

const Loader = (props) => {
  const { heights } = props;
  let { colors } = useTheme();
  return props.loading ? (
    <View
      style={{
        flex: 1,
        height: heights,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        position: "absolute",
        zIndex: 1,
        top: 0,
        bottom: 0,
        elevation: 4,
        right: 0,
        left: 0,
      }}
    >
      <View
        style={{
          width: normalize(130),
          height: 100,
          borderRadius: 10,
          backgroundColor: "rgba(52, 52, 52, 0.7)",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        {/* <ColorDotsLoader
          size={15}
          betweenSpace={10}
          color1={"#ff4500"}
          color2={"#ffd700"}
          color3={"#ff4500"}
        /> */}

        <Spinner type="CircleFlip" size={50} color="#FF6347" />
        {/* <Text
          style={{
            fontSize: 16,
            marginTop: 15,
            alignSelf: "center",
            color: "white",
            fontFamily: FONTS.fontFamily,
            fontSize: SIZES.size16,
          }}
        >
          {props.text}
        </Text> */}
      </View>
    </View>
  ) : null;
};

export default Loader;
