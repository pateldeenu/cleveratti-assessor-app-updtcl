import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import HeaderMenuIcon from "../../components/HeaderMenuIcon";
import appText from "../../utils/Localization/localization";
import CustomText from "../../components/CustomText";
import FooterLogo from "../../components/FooterLogo";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import PhonIcon from "react-native-vector-icons/Feather";
import MailIcon from "react-native-vector-icons/AntDesign";
import MainLogo from "../../components/MainLogo";

const ContactScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("+91 0");

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <HeaderMenuIcon
            label={appText.Contact_us}
            onPress={() => navigation.goBack()}
            onPressMenu={() => navigation.openDrawer()}
          />
          <View style={styles.viewStyle}>
            <CustomText style={styles.textStyle} label={appText.help_you} />
            <View style={styles.common}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
              >
                <PhonIcon
                  name="phone-call"
                  size={SIZES.size22}
                  color={COLORS.bluecolrHead}
                  style={{ marginVertical: 20 }}
                />
              </TouchableOpacity>
              <CustomText style={styles.textStyle} label={"+91 0"} />
            </View>
            <View style={styles.row}>
              <TouchableOpacity>
                <MailIcon
                  name="mail"
                  size={SIZES.size22}
                  color={COLORS.bluecolrHead}
                />
              </TouchableOpacity>
              <CustomText
                style={[styles.textStyle, { marginTop: -20 }]}
                label={"info@becilskills.com"}
              />
            </View>
            <View style={styles.mainLogo}>
              <MainLogo />
            </View>
          </View>
        </View>
        <FooterLogo bottomMargin={0} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  mainLogo: {
    opacity: 0.2,
    marginTop: 90,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "100%",
    marginTop: 10,
    paddingTop: 20,
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

export default ContactScreen;
