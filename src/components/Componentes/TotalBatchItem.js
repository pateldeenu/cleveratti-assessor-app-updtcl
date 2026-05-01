import React from "react";
import { View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { COLORS, FONTS } from "../../constants/Theme";
const TotalBatchItem = ({ leftIcon, onPress, name, item, id, value }) => {
  return (
<View style={styles.viewStyle}>
      
      {/* Batch Name */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{id}</Text>
      </View>

      {/* Batch Id */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Batch ID :</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      {/* Batch Name */}
      <View style={styles.viewRow}>
        <Text style={styles.label}>Batch Name :</Text>
        <Text style={styles.value}>{item}</Text>
      </View>
    </View>
  );
};
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

export default TotalBatchItem;
