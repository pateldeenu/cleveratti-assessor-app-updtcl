import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import moment from 'moment';
const BatchItem = ({
  Batch_Id,
  startDate,
  endDate,
  index,
  audit_status,
  onPress,
  name,
}) => {

  // console.log("--:isExpired--", isExpired);
  // const isCurrentDateBetween = (startDates, endDates) => {
  //   const now = moment(); // Current date and time
  //   const startDate = moment(startDates, 'DD/MM/YYYY hh:mm a'); // Parse start date
  //   const endDate = moment(endDates, 'DD/MM/YYYY hh:mm a'); // Parse end date
  //   return now.isBetween(startDate, endDate, null, '[]'); // Inclusive check
  // };
   
  // Check if the current date is between the two dates
  // const isExpired = isCurrentDateBetween(startDate, endDate);
  //console.log("--:isExpired--", isExpired); // Output: true or false based on the current dateeds);

  return (
    <View style={[styles.viewStyle, { borderColor: COLORS.blue }]}>
      <View style={[styles.marginTops, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {name ? AppConfig.TEST_NAME : AppConfig.BATCH_ID}
        </Text>
        <Text style={[styles.tIds]}>{name ? name : Batch_Id}</Text>
      </View>

      <View style={[styles.marginTops, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_START_DATE}
        </Text>
        <Text style={[styles.tIds]}>{startDate}</Text>
      </View>
      <View style={[styles.marginTops, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_END_DATE}
        </Text>
        <Text style={[styles.tIds]}>{endDate}</Text>
      </View>

      <View style={styles.centerV}>
        <CustomeButton
          isdisabled={audit_status ? true : false}
          textColor={ConfigColor.white}
          label={audit_status ? AppConfig.ATTEMPTED : AppConfig.ATTEMPT}
          onPress={onPress}
          buttonContainerStyle={[
            styles.container,
            {
              backgroundColor: audit_status ? COLORS.gray : COLORS.blue,
            },
          ]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
  tIds2: {
    marginLeft: normalize(20),
    width: "45%",
  },
  centerV: { alignSelf: "center" },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(14),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "50%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
  },

  marginTops: { marginTop: normalize(10) },
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

export default BatchItem;
