import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";

import { COLORS, SIZES } from "../../constants/Theme";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";

const ExamItem = ({ Batch_Id, startDate, endDate, index, onPress }) => {
  return (
    <View style={[styles.viewStyle, { borderColor: COLORS.blue }]}>
      <View style={[styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2, { color: COLORS.textColors }]}>
          {AppConfig.BATCH_ID}
        </Text>
        <Text style={[styles.tIds]}>{Batch_Id}</Text>
      </View>

      <View style={[styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_START_DATE}
        </Text>
        <Text style={[styles.tIds]}>{startDate}</Text>
      </View>

      <View style={[styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>
          {AppConfig.BATCH_END_DATE}
        </Text>
        <Text style={[styles.tIds]}>{endDate}</Text>
      </View>

      <View style={styles.cent}>
        <CustomeButton
          textColor={ConfigColor.white}
          label={AppConfig.ATTENDANCE}
          onPress={onPress}
          buttonContainerStyle={styles.container}
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
  cent: { alignSelf: "center" },
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
    marginTop: normalize(10),
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

export default ExamItem;
