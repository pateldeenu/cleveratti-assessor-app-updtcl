import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { COLORS, SIZES } from "../../constants/Theme";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";

const ItemToday = ({
  Batch_Id,
  test_name,
  startDate,
  endDate,
  duration,
  BatchType,
  index,
  onPress,
  onPressTwo,
  auditStatus,
  onPressAttempt,
  demoGroupStatus
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
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.TEST_NAME}</Text>
        <Text style={[styles.tIds]}>{test_name}</Text>
      </View>

      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.START_DATE}</Text>
        <Text style={[styles.tIds]}>{startDate}</Text>
      </View>

      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.END_DATE}</Text>
        <Text style={[styles.tIds]}>{endDate}</Text>
      </View>

      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.DURATION}</Text>
        <Text style={[styles.tIds]}>{duration + " Minute"}</Text>
      </View>

      <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.BATCH_TYPE}</Text>
        <Text style={[styles.tIds]}>{BatchType}</Text>
      </View>

      {/* <View style={[styles.mar10, styles.viewRow]}>
        <Text style={[styles.tIds, styles.tIds2]}>{AppConfig.BATCH_TYPE}</Text>
        <Text style={[styles.tIds]}>{dm}</Text>
      </View> */}

      {/* <View style={styles.CENTER}>
        <CustomeButton
          textColor={ConfigColor.white}
          label={AppConfig.ATTEMPT}
          onPress={onPress}
          buttonContainerStyle={styles.container}
        />
      </View> */}

      {(demoGroupStatus !== 1) ? (
        <View style={styles.CENTER}>
          <CustomeButton
            textColor={ConfigColor.white}
            label={AppConfig.ATTEMPT}
            labelStyle={{ fontSize: 11 }}
            onPress={onPressAttempt}
            buttonContainerStyle={styles.container_attempt}
          />
        </View>
      ) : (
        <View style={styles.centerButtons}>
          <CustomeButton
            textColor={ConfigColor.white}
            label={AppConfig.VIVA}
            vivaButtonStatus={true}
            labelStyle={{ fontSize: 11, }}
            onPress={onPress}
            buttonContainerStyle={[
              styles.container,
              {
                backgroundColor: COLORS.blue,
                margin: 0,
              },
            ]}
          />
          <CustomeButton
            textColor={ConfigColor.white}
            label={AppConfig.DEMO}
            onPress={onPressTwo}
            VivaButtonStatus={false}
            labelStyle={{ fontSize: 11 }}
            buttonContainerStyle={[
              styles.container,
              {
                backgroundColor: COLORS.colorGreen,
              },
            ]}
          />
        </View>
      )}

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
  // centerButtons: {
  //   alignSelf: "center",
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   marginTop: normalize(10),
  //   width: "44%",
  // },

  centerButtons: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  viva: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mar10: { marginTop: normalize(10) },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "55%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
  },

  CENTER: { alignSelf: "center" },
  tIds2: {
    marginLeft: normalize(20),
    width: "40%",
  },

  container_attempt: {
    height: 45,
    width: "100%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    paddingHorizontal: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    borderRadius: 14,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    width: "45%",
    marginHorizontal: normalize(10),
    marginVertical: normalize(10),
  },
});

export default ItemToday;
