import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";
import { COLORS, FONTS } from "../../constants/Theme";
const dynamicStyles = () => {
  return StyleSheet.create({
    constainer: {
      width: "100%",
      backgroundColor: COLORS.bluecolrHead,
      flex: 1,
    },
    largeInputContainer: {
      width: "90%",
      backgroundColor: COLORS.bgBlueColor,
      borderRadius: 5,
      alignSelf: "center",
      height: normalize(100),
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    animImage: {
      height: normalize(9),
      width: normalize(16),
      position: "absolute",
      right: normalize(-5),
    },

    chervon: {
      height: normalize(9),
      width: normalize(16),
      position: "absolute",
      right: normalize(10),
      top: 15,
      transform: [{ rotate: "270deg" }],
    },
    lenMess: {
      marginVertical: 10,
      alignSelf: "flex-end",
      color: "#1B1425",
      fontSize: normalize(15),
      fontFamily: "Lato-Regular",
      opacity: 0.75,
    },
    secView: {
      height: 50,
      width: "100%",
      flexDirection: "row",
      // marginLeft: "5%",
      paddingTop: 20,
    },
    viewStyle: {
      backgroundColor: COLORS.white,
      marginTop: 10,
      paddingTop: 5,
      marginBottom: normalize(120),
      height: "100%",
      borderTopLeftRadius: normalize(15),
      borderTopEndRadius: normalize(15),
    },

    dir: {
      flexDirection: "row",
      paddingHorizontal: normalize(20),
      paddingVertical: normalize(20),
    },

    row: {
      flexDirection: "row",
      marginHorizontal: 40,
    },

    optView: { flexDirection: "row", marginTop: 5 },
    next: {
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
      paddingVertical: 10,
      textAlign: "center",
      fontWeight: "bold",
      color: "white",
    },

    char: {
      height: normalize(9),
      width: normalize(16),
      position: "absolute",
      left: normalize(10),
      top: 15,
      transform: [{ rotate: "90deg" }],
    },
    dirH: {
      flexDirection: "row",
    },
    dotText: {
      fontWeight: "normal",
      fontSize: normalize(14),
      marginLeft: normalize(10),
      color: COLORS.textColors,
      fontFamily: "Lato-Regular",
    },
    viewDot: {
      borderRadius: 20,
      marginTop: 2,
      marginLeft: normalize(20),
      width: normalize(15),
      height: normalize(15),
    },
    nv: {
      width: "90%",
      backgroundColor: "#000",
      height: 0.5,
      alignSelf: "center",
      marginVertical: 10,
      opacity: 0.5,
    },
    note: {
      fontWeight: "normal",
      fontSize: normalize(15),
      marginTop: normalize(5),
      marginLeft: normalize(20),
      color: COLORS.textColors,
    },
    main4: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionAns: {
      color: COLORS.textColors,
      fontWeight: "600",
      color: "#000",
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
    },
    isVal: {
      height: normalize(40),
      width: normalize(40),
      paddingLeft: 5,
    },
    volume: {
      height: normalize(20),
      width: normalize(20),
      paddingLeft: 5,
    },

    isValid: {
      height: normalize(30),
      width: normalize(30),
      paddingLeft: 5,
    },

    image1: {
      height: normalize(20),
      width: normalize(20),
      paddingLeft: 5,
    },
    nextView: {
      alignSelf: "flex-end",
      width: "45%",
      marginLeft: 20,
      marginTop: 10,
      paddingLeft: 20,
      paddingRight: 10,
      borderRadius: 4,
      backgroundColor: COLORS.colorGreen,
    },
    btn: {
      width: "95%",
      justifyContent: "center",
      flexDirection: "row",
      marginHorizontal: 5,
      marginTop: 15,
    },
    timeLeft: {
      color: "#ffffff",
      fontSize: 14,
      lineHeight: 20,
      position: "absolute",
      right: 10,
      top: 20,
      fontWeight: "bold",
    },
    ViewDesign: {
      fontSize: normalize(12),
      fontFamily: "Lato-Regular",
      alignSelf: "center",
      backgroundColor: COLORS.blue,
      color: "white",
      fontWeight: "bold",
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginTop: 15,
      borderRadius: 4,
    },
    inf: { flexDirection: "row", justifyContent: "space-around" },
    rowVi: {
      width: "95%",
      flexDirection: "row",
      marginHorizontal: 5,
      marginTop: 10,
      justifyContent: "center",
    },
    textStyle: {
      fontFamily: FONTS.fontFamily,
      marginLeft: 20,
      fontWeight: "400",
      fontSize: 15,
      textAlign: "center",
      color: COLORS.colorText,
      marginVertical: -16,
      paddingTop: 20,
    },

    head: {
      color: COLORS.black,
      fontSize: 16,
      lineHeight: 20,
      paddingLeft: 10,
      fontWeight: "bold",
    },
    QUES: {
      color: COLORS.textColors,
      fontSize: 16,
      fontFamily: "Lato-Bold",
      lineHeight: 20,
      fontWeight: "700",
    },

    QUES: {
      color: COLORS.textColors,
      fontSize: 13,
      fontFamily: "Lato-Bold",
      lineHeight: 20,
      fontWeight: "700",
    },
    renderView: {
      margin: normalize(10),
      backgroundColor: "#E5DAF8",
      borderRadius: 1000,
      width: 40,
      height: 40,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      fontSize: normalize(14),
      padding: normalize(7),
      paddingLeft: normalize(12),
      paddingRight: normalize(12),
      fontWeight: "bold",
      color: "rgba(56, 55, 83, 1)",
      fontFamily: "Lato-Bold",
    },

    mark: {
      alignSelf: "flex-end",
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
      width: "45%",
      marginLeft: 10,
      paddingVertical: 10,
      marginTop: 10,
      paddingLeft: 20,
      paddingRight: 10,
      backgroundColor: COLORS.blue,
      color: "white",
      borderRadius: 4,
    },
    flat: {
      // marginTop: normalize(10),
      width: "100%",
      marginLeft: normalize(20),
    },

    list: {
      width: "90%",
      backgroundColor: "#000",
      height: 0.5,
      alignSelf: "center",
      marginVertical: 15,
      opacity: 0.5,
    },
    rowDir: {
      flexDirection: "row",
      marginHorizontal: normalize(10),
      justifyContent: "space-around",
    },

    dropDownView: {
      width: "35%",
      paddingTop: 5,
      marginLeft: -20,
      marginBottom: -20,
      height: "10%",
    },
    dropView: {
      ...FONTS.h4roboto,
      color: "#000",
      borderColor: COLORS.line2COlor,
      fontSize: 16,
    },

    dropText: {
      width: "90%",
      ...FONTS.latoRegularFont,
      lineHeight: 20,
      color: "white",
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
    },

    inputHeight: {
      fontSize: 13,
      width: "27%",
      height: 25,
      paddingLeft: 20,
      marginLeft: 20,
      alignSelf: "flex-end",
      paddingRight: 10,
      marginBottom: 5,
      paddingTop: 2,
      backgroundColor: COLORS.darkGray2,
      flexDirection: "row",
      color: "white",
      // borderWidth: 1,
      borderRadius: 4,
    },

    innerTextInput: {
      width: "100%",
      height: "100%",
      fontFamily: "Lato-Regular",
      fontSize: 15,

      color: "#221D39",
      textAlignVertical: "top",
    },
  });
};

export default dynamicStyles;
