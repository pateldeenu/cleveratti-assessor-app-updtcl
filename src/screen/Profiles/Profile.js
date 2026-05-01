import { View, ScrollView, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderMenuIcon from "../../components/HeaderMenuIcon";
import appText from "../../utils/Localization/localization";
import FooterLogo from "../../components/FooterLogo";
import { COLORS, FONTS } from "../../constants/Theme";
import CustomText from "../../components/CustomText";
import ApiUrl from "../../utils/UrlConfig";

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [image, setimage] = React.useState(ApiUrl.defaultImageUrl);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgBlueColor }}>
      <View style={{ flex: 0.3, marginTop: 10, justifyContent: "center" }}>
        <HeaderMenuIcon
          label={appText.profile}
          onPress={() => navigation.goBack()}
          onPressMenu={() => navigation.openDrawer()}
        />
      </View>
      <View style={styles.viewStyle}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.containerView}>
            <View style={styles.viewArr}>
              <Image source={{ uri: image }} style={styles.centerAlign}></Image>
            </View>
          </View>
          <View style={[styles.border]}>
            <View style={styles.filexDir}>
              <CustomText
                style={[styles.textStyle, { flex: 1 }]}
                label={`${appText.userNmae} :`}
              />
            </View>
            <View style={[styles.filexDir]}>
              <CustomText
                style={[styles.textStyle2, { flex: 1 }]}
                label={`${appText.emailAddress} :`}
              />
              <CustomText
                style={[styles.textStyle2, { flex: 2 }]}
                label={`${profileData.email}`}
              />
            </View>
          </View>
        </ScrollView>
        <FooterLogo bottomMargin={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
  },

  filexDir: { flexDirection: "row", marginHorizontal: 40 },
  viewStyle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 2,
  },
  centerAlign: {
    width: 115,
    height: 115,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 125,
  },

  textStyle: {
    fontFamily: FONTS.fontFamily,
    marginLeft: 0,
    fontWeight: "400",
    fontSize: 15,
    color: COLORS.colorText,
    paddingTop: 70,
  },
  textStyle2: {
    fontFamily: FONTS.fontFamily,
    marginLeft: 0,
    fontWeight: "400",
    fontSize: 15,
    color: COLORS.colorText,
    paddingTop: 5,
  },
  border: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.blue,
    height: 250,
    marginTop: -50,
    marginHorizontal: 20,
  },

  viewArr: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,

    borderRadius: 120 / 2,
    borderWidth: 2,
    borderColor: COLORS.blueDark,
  },
  containerView: {
    alignItems: "center",
    marginTop: 10,
    zIndex: 10,
    elevation: 5,
  },
});

export default Profile;
