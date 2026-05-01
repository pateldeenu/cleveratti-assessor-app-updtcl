import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { CustomeButton } from "../../components";

import React from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { useTheme } from "../../utils/Appearance";
import appText from "../../utils/Localization/localization";
import MainLogo from "../../components/MainLogo";
import FooterLogo from "../../components/FooterLogo";
import BackArrowComponent from "../../components/BackArrowComponent";
import DynamicImage from "../../constants/DynamicImage";

const ContinueScreen = ({ navigation }) => {
  let { colors } = useTheme();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.bgImage}>
          <BackArrowComponent
            onPress={() => {
              navigation.goBack();
            }}
          />
          <MainLogo />
          <Text
            style={[
              styles.description,
              { ...FONTS.h2bold, color: colors.blue },
            ]}
          >
            {appText.continue}
          </Text>
          <View style={styles.marginView}>
            <Image style={styles.imageSize} source={DynamicImage.nurseIcon} />

            <CustomeButton
              textColor={colors.blue}
              label={appText.nurse}
              onPress={() => {
                navigation.navigate("LOGIN");
              }}
              buttonContainerStyle={styles.customView}
            />
          </View>
        </View>
        <FooterLogo bottomMargin={10} />
      </SafeAreaView>
    </>
  );
};
export default ContinueScreen;
const styles = StyleSheet.create({
  logoView: {
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  textAlign: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginLeft: 80,
  },
  container: { flex: 1, backgroundColor: "white" },
  margin: { width: 100, left: 20 },
  customView: {
    height: 70,
    width: "90%",
    marginTop: 30,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderColor: COLORS.blue,
    borderWidth: 1,
  },
  imageSize: {
    width: 90,
    height: 80,
    bottom: 1,
    position: "absolute",
    zIndex: 1,
    left: 20,
  },

  marginView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 40,
  },
  bgImage: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
  },

  logo: {
    height: 75,
    width: "100%",
    marginVertical: 10,
  },
  description: {
    alignItems: "flex-start",
    fontWeight: "700",
    marginTop: 60,
    marginLeft: 20,
  },
});
