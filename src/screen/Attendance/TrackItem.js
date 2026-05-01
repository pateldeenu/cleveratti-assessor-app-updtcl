import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";

import { COLORS, SIZES } from "../../constants/Theme";

const TrackItem = ({
  Batch_Id,
  center_name,
  date,
  in_time,
  out_time,
  duration,
  onPress,
}) => {
  return (
    <View>
      <View style={styles.view1}>
        <Text style={styles.item}>{Batch_Id}</Text>
        <Text style={styles.item}>{date}</Text>
        <Text style={styles.item}>{in_time}</Text>
        <Text style={styles.item}>{out_time}</Text>
        {/* <Text style={styles.item}>{center_name}</Text> */}
        <Text style={styles.item}>{duration}</Text>
      </View>
      <View style={styles.mainV}></View>
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
  view1: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  item: {
    fontSize: normalize(12),
    color: COLORS.textColors,
    fontWeight: "700",
    width: 60,
    textAlign: "center",
  },
  mainV: { width: "100%", height: 0.4, backgroundColor: "#000000" },
});

export default TrackItem;
