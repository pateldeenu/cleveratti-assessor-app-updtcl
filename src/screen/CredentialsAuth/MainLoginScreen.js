import React, { useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { CustomeButton } from "../../components";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { useTheme } from "../../utils/Appearance";
import MainLogo from "../../components/MainLogo";
import FooterLogo from "../../components/FooterLogo";
import DynamicImage from "../../constants/DynamicImage";
import normalize from "react-native-normalize";
import { deleteData } from "../../utils/Utills";
import {
  createBatchesTable,
  createImageTable,
  createQuestTable,
  createAssess_batchTable,
} from "../../database/SqlLitedatabase";
import { AppConfig } from "../AssessmentDetails/Utils";

const MainLoginScreen = ({ navigation }) => {
  let { colors } = useTheme();

  const logout = async () => {
    Alert.alert("Alert!", "Are you sure you want Logout!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await deleteData(AppConfig.TOKEN);
          navigation.reset({
            index: 0,
            routes: [{ name: "authStack" }],
          });
        },
      },
    ]);
  };

  const createTable = async () => {
    await createQuestTable();
    await createImageTable();
    await createBatchesTable();
    await createAssess_batchTable();
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        if (isMounted) {
          await createTable();
        }
      } catch (e) {
        console.error("Error creating tables:", e);
      }
    };
    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToHome = () => {
    navigation.navigate("DrawerNavigation", { screen: "navigationStack" });
  };

  return (
    <View style={styles.viewStyle}>
      <View style={{ marginTop: 70 }}>
        <MainLogo />
      </View>

      <View style={{ alignItems: "center" }}>
        <CustomeButton
          textColor={colors.white}
          label={"Assessor Attendance"}
          onPress={() => {
            navigation.navigate("AttendanceDashboard");
          }}
          buttonContainerStyle={styles.container}
        />

        <CustomeButton
          textColor={colors.white}
          label={"BatchList Evidence"}
          onPress={() => {
            navigation.navigate("AuditDashboard");
          }}
          buttonContainerStyle={[styles.container, styles.mar10]}
        />
        <CustomeButton
          textColor={colors.white}
          label={"Assessment"}
          onPress={() => goToHome()}
          buttonContainerStyle={[styles.container, styles.mar10]}
        />

        <CustomeButton
          textColor={colors.white}
          label={"Live Streaming"}
          onPress={() => {
            navigation.navigate("LiveBatch");
          }}
          buttonContainerStyle={[styles.container, styles.mar10]}
        />
      </View>
      <TouchableOpacity style={styles.logout} onPress={() => logout()}>
        <Image
          source={DynamicImage.logoutIcon}
          resizeMode="cover"
          style={styles.imageSize}
        />
      </TouchableOpacity>

      <FooterLogo bottomMargin={-20} />
    </View>
  );
};
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  mar10: { marginTop: 10 },
  container2: {
    height: 50,
    width: "45%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderColor: "#406EFF",
    borderWidth: 1,
  },
  imageSize: {
    width: normalize(40),
    height: normalize(40),
  },
  container: {
    height: 50,
    width: "65%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    marginTop: 50,
  },
  logo: {
    height: 75,
    width: "100%",
  },

  viewStyle: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  logout: {
    bottom: 20,
    alignSelf: "center",
    marginTop: 60,
  },
});

export default MainLoginScreen;
