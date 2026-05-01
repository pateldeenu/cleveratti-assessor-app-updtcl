import { View, Text, Image, BackHandler, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import { CustomeButton } from "../../components";
import { CommonActions } from "@react-navigation/native";

const CandidateThankyouScreen = ({ navigation }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );

    return () => backHandler.remove();
  }, []);

  // ✅ Disable back button
  function handleBackButtonClick() {
    return true;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={DynamicImage.checkIcon}
          resizeMode="contain"
          style={styles.main}
        />

        <Text style={styles.exam}>
          Your exam data uploaded successfully
        </Text>

        <CustomeButton
          label={"Go to Dashboard"}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0, // ✅ FIXED
                routes: [{ name: "CandidateAppRoutes" }],
              })
            );
          }}
          labelStyle={{ color: "white", paddingHorizontal: 20 }}
          buttonContainerStyle={styles.btn}
        />
      </View>
    </View>
  );
};

export default CandidateThankyouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBlueColor,
    justifyContent: "center", // ✅ center vertically
    alignItems: "center", // ✅ center horizontally
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  main: {
    width: normalize(100),
    height: normalize(100),
  },

  exam: {
    fontWeight: "bold",
    fontSize: normalize(17),
    color: COLORS.textColors,
    textAlign: "center",
    marginTop: 30,
  },

  btn: {
    height: 50,
    width: "70%",
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    marginTop: 40,
  },
});

