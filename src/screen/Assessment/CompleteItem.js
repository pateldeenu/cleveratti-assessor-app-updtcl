import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";

const CompleteItem = ({
  Batch_Id,
  Batch_name,
  test_name,
  startDate,
  endDate,
  duration,
  BatchType,
  index,
}) => {
  return (
    <View style={styles.viewStyle}>
      
      {/* Batch Id */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Batch Id :</Text>
        <Text style={styles.value}>{Batch_Id}</Text>
      </View>

      {/* Batch Name */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Batch Name :</Text>
        <Text style={styles.value}>{test_name}</Text>
      </View>

      {/* Start Date */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Start Date :</Text>
        <Text style={styles.value}>{startDate}</Text>
      </View>

      {/* End Date */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>End Date :</Text>
        <Text style={styles.value}>{endDate}</Text>
      </View>

      {/* Duration */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Duration :</Text>
        <Text style={styles.value}>{duration}</Text>
      </View>

      {/* Optional Batch Type */}
      {/* 
      <View style={styles.viewRow}>
        <Text style={styles.label}>Batch Type :</Text>
        <Text style={styles.value}>{BatchType}</Text>
      </View> 
      */}

    </View>
  );
};

export default CompleteItem;

const styles = StyleSheet.create({
  viewStyle: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.blueDark,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
  },

  viewRow: {
    flexDirection: "row",
    marginTop: normalize(10),
    alignItems: "flex-start", // ✅ important for multi-line text
  },

  label: {
    minWidth: 110, // ✅ keeps label aligned
    color: COLORS.textColors,
    fontWeight: "bold",
    fontSize: normalize(15),
  },

  value: {
    flex: 1, // ✅ takes remaining space
    flexWrap: "wrap", // ✅ allows text wrapping
    fontWeight: "700",
    fontSize: normalize(16),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
});
