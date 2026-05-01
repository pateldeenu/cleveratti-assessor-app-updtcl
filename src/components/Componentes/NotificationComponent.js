import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import DynamicImage from "../../constants/DynamicImage";
import { COLORS } from "../../constants/Theme";

const NotificationComponent = ({ message }) => {
  // console.log("mees", message.message);
  return (
    <View style={styles.bgColor}>
      <TouchableOpacity onPress={message.message.message.onPress}>
        <View style={styles.vi}>
          <Image
            resizeMode="cover"
            style={[styles.imageHeight]}
            source={DynamicImage.mainLogo}
          ></Image>
          <Text style={styles.text2}>
            {!message?.message?.message?.notification?.body
              ? "Please start live streaming"
              : message?.message?.message?.notification?.body}
          </Text>
          <Text style={styles.ViewDesign}>{"Start"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: "#6801FE",
    height: 70,
  },
  ViewDesign: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    alignSelf: "center",
    backgroundColor: COLORS.orange,
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
  },
  imageHeight: {
    width: 40,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  text2: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 10,
    marginRight: 10,
    width: "60%",
  },
  vi: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    paddingHorizontal: "5%",
    marginTop: 15,
  },
});

export default NotificationComponent;
