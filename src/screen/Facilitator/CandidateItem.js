import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React from 'react'
import normalize from "react-native-normalize";
import { COLORS, FONTS } from "../../constants/Theme";

const CandidateItem = () => {
  return (
            <View
              style={{
                marginVertical: 8,
                borderRadius: 8,
                elevation: 5,
                marginHorizontal: normalize(10),
                width: "95%",
                borderWidth: 1,
                borderColor: COLORS.bluecolrHead,
                backgroundColor: "#fff",

              }}
            >
              <View style={[{ marginTop: normalize(15) }, styles.viewRow]}>
                <Text
                  style={[
                    styles.tIds,
                    styles.tIds2,
                    { fontSize: 15, fontWeight: "bold" },
                    ,
                    { color: COLORS.textColors },
                  ]}
                >
                  {"Student Name "}
                </Text>
                <Text style={[styles.tIds]}>{"Dinesh Maurya"}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text
                  style={[
                    styles.tIds,
                    styles.tIds2,
                    { fontSize: 15, fontWeight: "bold" },
                  ]}
                >
                  {"Student Id"}
                </Text>
                <Text style={[styles.tIds]}>{"3213"}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text
                  style={[
                    styles.tIds,
                    styles.tIds2,
                    { fontSize: 15, fontWeight: "bold" },
                  ]}
                >
                  {"Enrollment No. "}
                </Text>
                <Text style={[styles.tIds]}>{"12131312121"}</Text>
              </View>
              <View style={[{ marginTop: normalize(10) , marginBottom:10,}, styles.viewRow]}>
                <Text
                  style={[
                    styles.tIds,
                    styles.tIds2,
                    { fontSize: 15, fontWeight: "bold" },
                  ]}
                >
                  {"TP Name"}
                </Text>
                <Text style={[styles.tIds]}>{"HSSC"}</Text>
              </View>
             
    </View>
  )
}

export default CandidateItem


const styles = StyleSheet.create({
    constainer: {
      width: "100%",
      backgroundColor: COLORS.bgBlueColor,
      flex: 1,
    },
    viewMargin: {
      marginTop: 10,
      flexDirection: "row",
      // backgroundColor: COLORS.bgBlueColor,
    },
    mainLogo: {
      opacity: 0.2,
      marginTop: 90,
    },
    viewStyle: {
      backgroundColor: COLORS.white,
      marginTop: 10,
      paddingTop: 20,
      marginBottom: normalize(120),
      flexGrow: 1,
      height: "100%",
  
      borderTopLeftRadius: normalize(15),
      borderTopEndRadius: normalize(15),
    },
    row: {
      flexDirection: "row",
      marginHorizontal: 40,
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
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      color: "#4284f3",
      fontSize: 18,
      lineHeight: 16,
      fontWeight: "bold",
    },
    title2: {
      fontWeight: "700",
      fontSize: normalize(14),
      color: COLORS.textColors,
      fontFamily: "Lato-Bold",
    },
  
    rowDir: {
      flexDirection: "row",
      marginHorizontal: normalize(10),
      justifyContent: "space-around",
    },
    title1: {
      fontWeight: "bold",
      fontSize: normalize(16),
      color: COLORS.textColors,
      fontFamily: "Lato-Bold",
    },
    common: {
      flexDirection: "row",
      marginTop: 30,
      marginHorizontal: 40,
    },
    container: {
      height: 45,
      borderRadius: 14,
      marginHorizontal: 20,
      backgroundColor: COLORS.blue,
      marginVertical: 20,
      paddingHorizontal: 40,
      justifyContent: "center",
      alignItems: "center",
    },
  
    //   viewStyle: {
    //     margin: 10,
    //     marginVertical: 8,
    //     borderRadius: 10,
    //     elevation: 5,
    //     marginHorizontal: 20,
    //     width: "90%",
    //     borderWidth: 2,
    //     borderColor: COLORS.bgH,
    //     backgroundColor: "#fff",
    //   },
    tIds2: {
      marginLeft: normalize(20),
      width: "50%",
    },
    tIds: {
      fontWeight: "700",
      fontSize: normalize(17),
      color: COLORS.textColors,
      fontFamily: "Lato-Bold",
      width: "50%",
    },
    viewRow: {
      backgroundColor: "#F5FCFF",
      flexDirection: "row",
    },
  
    //   container: {
    //     height: 45,
    //     borderRadius: 14,
    //     marginHorizontal: SIZES.padding,
    //     backgroundColor: COLORS.blue,
    //     marginVertical: 20,
    //     paddingHorizontal: 40,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   },
  });