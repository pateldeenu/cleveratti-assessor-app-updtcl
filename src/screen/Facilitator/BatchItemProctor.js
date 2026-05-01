import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";

import { COLORS, FONTS, SIZES } from "../../constants/Theme";

const BatchItemProctor = ({ Batch_Id, startDate, endDate, index, onPress }) => {
  return (
    <View style={[styles.viewStyle, { borderColor: COLORS.blue }]}>
      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
            { fontSize: 15, fontWeight: "bold" },
            ,
            { color: COLORS.textColors },
          ]}
        >
          {"Batch Id "}
        </Text>
        <Text style={[styles.tIds]}>{Batch_Id}</Text>
      </View>
      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
            { fontSize: 15, fontWeight: "bold" },
            ,
            { color: COLORS.textColors },
          ]}
        >
          {" TP Name "}
        </Text>
        <Text style={[styles.tIds]}>{'CII Demo'}</Text>
      </View>
      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
            { fontSize: 15, fontWeight: "bold" },
          ]}
        >
          {"Batch Start Date "}
        </Text>
        <Text style={[styles.tIds]}>{startDate}</Text>
      </View>

      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
            { fontSize: 15, fontWeight: "bold" },
          ]}
        >
          {"Batch End Date "}
        </Text>
        <Text style={[styles.tIds]}>{endDate}</Text>
      </View>

      <View style={{ alignSelf: "center" }}>
        <CustomeButton
          textColor={"#fff"}
          label={"View"}
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
    height: 40,
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default BatchItemProctor