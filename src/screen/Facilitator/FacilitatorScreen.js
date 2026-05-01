import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";

import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import BatchItemProctor from "./BatchItemProctor";

const FacilitatorScreen = ({ navigation }) => {
  const data = [
    {
      id: 1,
      Batch_Id: "Dummy115",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Dummy115",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Dummy119",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo4",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo1",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo1",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222 ",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo1",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo1",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
    {
      id: 1,
      Batch_Id: "Demo1",
      Batch_name: "Test Batch",
      test_name: "School Assessment",
      startDate: "06/08/20222",
      endDate: "07/08/20222",
      duration: 60,
      BatchType: "PMKVY",
    },
  ];

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: normalize(18),
                  color: COLORS.white,
                  ...FONTS.h2,
                  alignSelf: "center",
                  justifyContent: "center",
                  width: "70%",
                  textAlign: "center",
                },
              ]}
            >
              {"Batch List"}
            </Text>
          </View>
          <View style={styles.viewStyle}>
            {data?.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={(i, index) => String(index)}
                showsVerticalScrollIndicator={false}
                renderItem={(item, index) => {
                  return (
                    <BatchItemProctor
                      index={item.index}
                      Batch_Id={item.item.Batch_Id}
                      startDate={item.item.startDate}
                      endDate={item.item.endDate}
                      onPress={() => navigation.navigate("CandidateFacilator")}
                    />
                  );
                }}
              />
            ) : (
              <NoData />
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bluecolrHead,
    flex: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bluecolrHead,
  },
  mainLogo: {
    opacity: 0.2,
    marginTop: 90,
  },
  viewStyle: {
    backgroundColor: COLORS.bgBlueColor,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 25,
    flexGrow: 1,
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
  common: {
    flexDirection: "row",
    marginTop: 30,
    marginHorizontal: 40,
  },
});



export default FacilitatorScreen