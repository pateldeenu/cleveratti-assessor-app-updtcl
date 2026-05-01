import { StyleSheet } from "react-native";
import normalize from "react-native-normalize";
import { COLORS, FONTS } from "../../constants/Theme";
const dynamicStyles = () => {
  return StyleSheet.create({
    constainer: {
      width: "100%",
      backgroundColor: COLORS.bgBlueColor,
      flex: 1,
      marginTop: 10,
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

    lenMess: {
      marginVertical: 10,
      alignSelf: "flex-end",
      color: "#1B1425",
      fontSize: normalize(15),
      fontFamily: "Lato-Regular",
      opacity: 0.75,
    },
    dirH: {
      flexDirection: "row",
    },
    viewDot: {
      borderRadius: 20,
      marginTop: 2,
      marginLeft: normalize(20),
      width: normalize(15),
      height: normalize(15),
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
    secView: {
      height: 50,
      width: "100%",
      flexDirection: "row",

      marginLeft: "5%",
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
      paddingVertical: normalize(10),
    },

    dir_dt: {
      flexDirection: "row",
      marginLeft:10,
      paddingHorizontal: normalize(20),
      paddingVertical: normalize(5),
    },

    dir_flatlist: {
      flexDirection: "row",
      marginLeft:10,
      paddingHorizontal: normalize(4),
      paddingVertical: normalize(5),
    },

    row: {
      flexDirection: "row",
      marginHorizontal: 40,
    },
    next: {
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
      paddingVertical: 10,
      textAlign: "center",
      fontWeight: "bold",
      color: "white",
    },
    hidenI: {
      width: normalize(80),
      alignSelf: "flex-end",
      marginRight: 20,
      marginTop: 20,
      marginTop: normalize(20),
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
    stopView: {
      alignSelf: "flex-end",
      marginTop: 20,
      width: "30%",
      paddingLeft: 20,
      paddingRight: 10,
      marginRight: 20,
      borderRadius: 4,
      backgroundColor: COLORS.orange,
    },

    btn: {
      width: "95%",
      justifyContent: "center",
      flexDirection: "row",
      marginHorizontal: 5,
      marginTop: 15,
    },
    rb_btn: {
      width: "95%",
      justifyContent: "center",
      flexDirection: "row",
      marginHorizontal: 1,
      marginTop: 5,
    },
    timeLeft: {
      color: "red",
      fontSize: 18,
      lineHeight: 20,
      position: "absolute",
      right: 40,
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
    rowVi: {
      width: "95%",
      flexDirection: "row",
      marginHorizontal: 5,
      marginTop: 1,
      justifyContent: "center",
    },
    flatGen: {
      alignSelf: "center",
      marginHorizontal: normalize(40),
      marginTop: normalize(10),
      paddingBottom: 20,
    },
    line: {
      width: "100%",
      height: 0.5,
      backgroundColor: "#BEBEBE",
    },
    selectGender: {
      color: "#979797",
      fontFamily: "Inter",
      fontSize: normalize(16),
      fontWeight: "700",
      textAlign: "center",
      marginVertical: normalize(15),
    },
    selectView: {
      borderWidth: 0.5,
      flexDirection: "row",
      height: normalize(52),
      marginRight: 10,
      borderRadius: normalize(89),
    },

    viewTouch: {
      width: "100%",
      justifyContent: "center",
      marginHorizontal: normalize(10),
      marginVertical: normalize(10),
    },
    selectText: {
      fontFamily: "Inter",
      fontSize: normalize(16),
      textAlign: "center",
      alignSelf: "center",
      width: "100%",
    },

    buttonText: {
      fontFamily: "Inter",
      fontSize: normalize(14),
      textAlign: "center",
      alignSelf: "center",
      width: "100%",
    },

    viewTrans: {
      backgroundColor: "rgba(255, 255, 255, 1)",
      height: "72%",
      // borderRadius: normalize(10),
      width: "80%",
      borderRadius: 15,
    },
    modalBg: {
      flex: 1,
      backgroundColor: "rgba(42, 39, 47, 0.6)",
      alignItems: "center",
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
      color: COLORS.textColors,
      fontSize: 18,
      lineHeight: 20,
      fontWeight: "bold",
    },

    tophdcont: {
      color: COLORS.textColors,
      fontSize: 15,
      fontFamily: "Lato-Regular",
      lineHeight: 20,
      marginLeft:20,
      fontWeight: "400",
    },

    head_rb: {
      color: COLORS.textColors,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "bold",
    },
    
    had: {
      textAlign: "center",
      alignSelf: "center",
      width: "90%",
    },

    QUES: {
      color: COLORS.textColors,
      fontSize: 15,
      fontFamily: "Lato-Regular",
      lineHeight: 20,
      fontWeight: "400",
    },

    QUES_rb: {
      color: COLORS.textColors,
      fontSize: 14,
      fontFamily: "Lato-Regular",
      lineHeight: 20,
      fontWeight: "400",
    },


    Ques2: {
      alignSelf: "flex-end",
      marginVertical: 5,
      color: "black",
      fontWeight: "700",
      marginRight: 30,
      marginTop: 25,
    },
    videoIma: {
      width: normalize(55),
      height: normalize(55),
      marginTop: 10,
      marginLeft: 20,
      marginRight: 15,
      marginHorizontal: normalize(10),
      borderColor: COLORS.blue,
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
    genV: {
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
      color: "white",
      alignSelf: "center",
    },
    marks: {
      alignSelf: "flex-end",
      width: "45%",
      marginLeft: 20,
      paddingVertical: 12,
      marginTop: 10,
      // paddingLeft: 20,
      // paddingRight: 10,
      padding:10,
      backgroundColor: COLORS.blue,
      color: "white",
      borderRadius: 4,
    },
    rb_marks: {
      alignSelf: "flex-end",
      width: "75%",
      marginLeft: 1,
      paddingVertical: 8,
      marginTop: 1,
      paddingLeft: 5,
      paddingRight: 10,
      backgroundColor: COLORS.blue,
      color: "white",
      borderRadius: 4,
    },
    flat: {
      marginTop: normalize(10),
      width: "100%",
      marginLeft: normalize(20),
    },

    rowDir: {
      flexDirection: "row",
      marginHorizontal: normalize(10),
      justifyContent: "space-around",
    },

    dropDownView: { width: "35%", paddingTop: 5, marginLeft: 20 },
    dropView: {
      ...FONTS.h4roboto,
      color: "#000",
      borderColor: COLORS.line2COlor,
      fontSize: 16,
    },

    dropText: {
      width: "90%",
      ...FONTS.latoRegularFont,
      lineHeight: 15,
      color: "white",
      fontSize: normalize(14),
      fontFamily: "Lato-Regular",
    },

    inputHeight: {
      fontSize: 14,
      width: "45%",
      paddingVertical: 10,
      paddingLeft: 20,
      marginLeft: 20,
      alignSelf: "flex-end",
      paddingRight: 10,
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
      // color: "#221D39",
      color: "#000000", // Set to true black
      textAlignVertical: "top",
    },
  });
};

export default dynamicStyles;
