import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";
import { COLORS, FONTS } from "../../constants/Theme";
const dynamicStyles = () => {
  return StyleSheet.create({
    viewStyle: {
      borderBottomWidth: 0.5,
      borderColor: "grey",
    },
    imageHeight: {
      width: 30,
      height: 30,
      marginLeft: 10,
      marginTop: 20,
    },
    cameraHeight: {
      width: normalize(45),
      height: normalize(45),
      marginTop: 5,
      marginRight: 15,
      alignSelf: "flex-end",
    },
    s3v: {
      alignSelf: "center",
      marginVertical: 10,
      flexDirection: "row",
    },
    container: {
      height: 35,
      borderRadius: 20,
      backgroundColor: COLORS.colorGreen,
      marginBottom: 5,
      paddingHorizontal: 20,
      marginHorizontal: 20,
    },
    imageHeights: {
      width: normalize(45),
      height: normalize(45),
      marginRight: 15,
      borderWidth: 1,
      borderRadius: 4,
      marginHorizontal: normalize(10),
      borderColor: COLORS.blue,
    },
    videoeHeights: {
      width: normalize(40),
      height: normalize(40),
      marginRight: 15,
      marginHorizontal: normalize(10),
      borderColor: COLORS.blue,
    },

    viewImage: {
      flexDirection: "row",
      marginTop: 10,
      marginLeft: 20,
      marginBottom: 10,
    },

    viewImage_img: {
      flexDirection: "column",
      marginTop: 10,
      marginLeft: 20,
      marginBottom: 10,
    },
    tIds: {
      fontWeight: "700",
      fontSize: normalize(15),
      color: COLORS.textColors,
      marginLeft: normalize(10),
      fontFamily: "Lato-Bold",
      fontWeight: "bold",
    },
    tIdsQues: {
      fontWeight: "500",
      fontSize: normalize(15),
      color: COLORS.black,
      lineHeight: 22,
      width: "78%",
      marginBottom: normalize(10),
      marginLeft: normalize(10),
      fontFamily: "Lato-Medium",
    },
    remarks: {
      fontWeight: "500",
      fontSize: normalize(13),
      color: COLORS.blueDark,
      marginLeft: normalize(30),
      fontFamily: "Lato-Medium",
      marginTop: normalize(10),
    },
    remarksmar: {
      fontWeight: "500",
      fontSize: normalize(13),
      color: COLORS.blueDark,
      marginLeft: normalize(30),
      marginRight:20,
      fontFamily: "Lato-Medium",
      marginTop: normalize(10),
    },

    remarks_img: {
      fontWeight: "500",
      fontSize: normalize(13),
      color: COLORS.blueDark,
      marginLeft: normalize(10),
      fontFamily: "Lato-Medium",
      marginTop: normalize(10),
      marginBottom:normalize(5),
    },

    viewRow: {
      flexDirection: "row",
      height: 150,
      marginTop: 10,
    },
    largeInputContainer: {
      width: "75%",
      backgroundColor: COLORS.bgBlueColor,
      borderRadius: 5,
      borderColor: "blue",
      borderWidth: 0.4,
      alignSelf: "flex-start",
      height: normalize(50),
      paddingHorizontal: 10,
      paddingVertical: 0,
      marginLeft: 34,
    },
    lenMess: {
      marginVertical: 0,
      alignSelf: "flex-end",
      color: "#1B1425",
      fontSize: normalize(13),
      fontFamily: "Lato-Regular",
      opacity: 0.75,
    },
    innerTextInput: {
      width: "100%",
      height: "100%",
      fontFamily: "Lato-Regular",
      fontSize: 15,
      // color: "#221D39",
      color: "#000000", // Set to true black
      textAlignVertical: "top",
    },
  });
};

export default dynamicStyles;
