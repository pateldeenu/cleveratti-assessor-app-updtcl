import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import normalize from "react-native-normalize";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppConfig } from "../AssessmentDetails/Utils";
import CandidateExamList from "./CandidateExamList";
import { getCandidateExamList } from "../../redux/Actions/AllContentAction";

const CandidateDashBoardScr = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [dashItem] = useState([
    {
      title: "Theory",
      icon: "book-open-page-variant",
      screen: "TheoryScreen",
      color: "#4A90E2",
    },
    {
      title: "Training Feedback",
      icon: "message-text",
      screen: "AssessorFeedbackScreen",
      color: "#34C759",
    },
    {
      title: "Assessment Feedback",
      icon: "message-text",
      screen: "AssessmentFeedbackScreen",
      color: "#e75e5e",
    },
  ]);

  const onPressItem = (screen) => {
    if (screen === "TheoryScreen") {
      navigation.navigate("CandidateExamList", { screen_type: screen });
    } else {
      navigation.navigate("CandidateExamList", { screen_type: screen });
    }
  }

  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: item.color }]}
        activeOpacity={0.8}
        onPress={() => {
          onPressItem(item.screen);
        }}
      >
        <MCIcon name={item.icon} size={30} color="#fff" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <Text style={styles.batchTitle}>{AppConfig.DASHBOARD}</Text>
          </View>

          <View style={styles.viewStyle}>
            <FlatList
              data={dashItem}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
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
    height: "100%",
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
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
  batchTitle: {
    fontWeight: "600",
    fontSize: normalize(14),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
  },

  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 10,
    paddingVertical: 30,
    marginBottom: 15,

    justifyContent: "center",   // vertical center
    alignItems: "center",       // horizontal center

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  cardTitle: {
    fontSize: normalize(10),
    color: COLORS.white,
    alignSelf: "center",
    alignItems: "center",
    ...FONTS.h3,
  },
});
export default CandidateDashBoardScr;
