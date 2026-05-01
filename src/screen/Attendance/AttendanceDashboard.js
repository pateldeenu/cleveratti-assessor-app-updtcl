import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import AuditItem from "../../components/AuditItem";
import { AppConfig } from "../AssessmentDetails/Utils";

const AttendanceDashboard = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.viewD}>{AppConfig.DASHBOARD}</Text>
          </View>
          <View style={styles.viewStyle}>
            <AuditItem
              name={AppConfig.ATTENDANCE}
              leftIcon={DynamicImage.attendanceIcon}
              onPress={() =>
                navigation.navigate("AttendanceListScreen", { track: "" })
              }
            />
            <AuditItem
              name={AppConfig.TRACK_ATTENDANCE}
              leftIcon={DynamicImage.trackIcon}
              onPress={
                () => navigation.navigate("AttendanceTrack")
                // navigation.navigate("AttendanceListScreen", { track: "track" })
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
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

  viewD: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },
});

export default AttendanceDashboard;
