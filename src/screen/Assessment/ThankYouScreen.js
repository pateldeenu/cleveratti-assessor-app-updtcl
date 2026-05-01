import { View, Text, Image, BackHandler, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import { CustomeButton } from "../../components";

const ThankYouScreen = ({ navigation, route }) => {
  const { data, examType, auditType } = route.params;
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  function handleBackButtonClick() {}
  return (
    <View style={styles.main}>
      <Image
        source={DynamicImage.checkIcon}
        resizeMode="cover"
        style={styles.icon}
      />
      <Text style={styles.title}>
        {`Your ${examType ? examType : auditType} data uploaded successfully`}
      </Text>

      <CustomeButton
        label={"Go to Back"}
        onPress={() => {
          auditType
            ? navigation.navigate("AuditBatchList")
            : examType == "attendance"
            ? // navigation.navigate("AttendanceListScreen")
              navigation.navigate("AttendanceDashboard")
            : navigation.navigate("AssessmentDetailsScreen", {
                dataDetails: data,
              });
        }}
        labelStyle={styles.label}
        buttonContainerStyle={[styles.container]}
      />
    </View>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "60%",
    borderRadius: 14,
    marginHorizontal: 20,
    backgroundColor: COLORS.blue,
    alignSelf: "center",
    marginTop: 50,
  },
  label: { color: "white", paddingHorizontal: 20 },
  title: {
    fontWeight: "bold",
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    textAlign: "center",
    marginTop: 30,
  },
  icon: {
    width: normalize(100),
    height: normalize(100),
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 200,
    justifyContent: "center",
  },
  main: { backgroundColor: COLORS.bgBlueColor, flex: 1, height: "100%" },
});
