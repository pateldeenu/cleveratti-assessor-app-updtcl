import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { COLORS, SIZES } from "../../constants/Theme";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
const AttendanceItem = ({
  Batch_Id,
  startDate,
  endDate,
  onPress,
  live,
  assessor_attendance,
  viewAttendance,
}) => {
  return (
    <View style={[styles.viewStyle, { borderColor: COLORS.blue }]}>
      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2, { color: COLORS.textColors }]}>
          {AppConfig.BATCH_ID}
        </Text>
        <Text style={[styles.tIds]}>{Batch_Id}</Text>
      </View>
      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_START_DATE}
        </Text>
        <Text style={[styles.tIds]}>{startDate}</Text>
      </View>
      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_END_DATE}
        </Text>
        <Text style={[styles.tIds]}>{endDate}</Text>
      </View>

      <View style={styles.cent}>
        <CustomeButton
          isdisabled={
            viewAttendance == "track"
              ? false
              : assessor_attendance
              ? true
              : false
          }
          textColor={ConfigColor.white}
          label={
            live
              ? "Start Live Streaming"
              : viewAttendance == "track"
              ? "View Attendance"
              : assessor_attendance
              ? "Attendance Submitted"
              : "Attendance"
          }
          onPress={onPress}
          buttonContainerStyle={styles.container}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cent: { alignSelf: "center" },
  viewStyle: {
    margin: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    width: "90%",
    borderWidth: 2,
    borderColor: COLORS.orange,
    backgroundColor: "#fff",
  },
  mar10: { marginTop: normalize(10) },
  tIds2: {
    marginLeft: normalize(20),
    width: "45%",
  },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(15),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "50%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
  },

  container: {
    height: 45,
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AttendanceItem;
