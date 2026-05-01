import React, { useState, useEffect } from "react";
import {View,StyleSheet,ImageBackground,StatusBar,Image,Alert,TouchableOpacity,Text,} from "react-native";
import { CustomeButton } from "../../components";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { useTheme } from "../../utils/Appearance";
import appText from "../../utils/Localization/localization";
import MainLogo from "../../components/MainLogo";
import FooterLogo from "../../components/FooterLogo";
import DynamicImage from "../../constants/DynamicImage";
import ThreeDot from "react-native-vector-icons/Entypo";
import OptionsMenu from "react-native-option-menu";
import normalize from "react-native-normalize";
import {
  deleteAssessQuesTable,deleteAssmtBatch,deleteAssmtCandidateList,deletebatch,deleteCandiadateBatchListTable,deleteDashBoardCount,
  deleteImagetable,deleteQuestion,deleteUser,dropTable,dropass_cd_table,
} from "../../database/SqlLitedatabase";
import { deleteData, getData, setData } from "../../utils/Utills";
import { AppConfig } from "../AssessmentDetails/Utils";
import ToggleSwitch from "toggle-switch-react-native";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GettingStarted = ({ navigation }) => {
  let { colors } = useTheme();
  const [type, setType] = useState("");
  const [isOn, setIsOn] = useState(true);
  const emojisWithIcons = ['Assessor', 'Candidate'];

  useEffect(() => {
    const fetchData = async () => {
      await checkValue();
    };
    fetchData();
  }, []);

  const checkValue = async () => {
    try {
      const on_off_mode = await getData(AppConfig.OnOffMode);
      const boolValue = stringToBoolean(on_off_mode);
      setIsOn(boolValue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const stringToBoolean = (str) => {
    if (!str) return false; // Handles empty string, null, undefined
    return str.toLowerCase() === "true"; // Convert "true" (string) to true (boolean)
  };

  const chooseMode = async (newState) => {
    setIsOn(newState)
    setData(AppConfig.OnOffMode, JSON.stringify(newState));
  };

  const cadidate = async () => {
    setType(AppConfig.CANDIDATE);
    await setData(AppConfig.ROLE, AppConfig.CANDIDATE);
  };

  const assessor = () => {
    setType("Assessor");
    setData(AppConfig.ROLE, "assessor");
  };
  const facilator = () => {
    setType("Facilitator");
  };

  const deleteApp = async () => {
    Alert.alert(
      "Alert!",
      "Are you sure you want to delete all files and data",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteUser();
            await deleteQuestion();
            await deletebatch();
            await deleteImagetable();
            await deleteDashBoardCount();
            await deleteAssmtBatch();
            await dropTable();
            await dropass_cd_table();
            await deleteAssmtCandidateList();
            await deleteAssessQuesTable();
            await deleteCandiadateBatchListTable();
            await deleteData(AppConfig.TOKEN);
            await deleteData(AppConfig.LAT);
            await deleteData(AppConfig.LOT);
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar hidden />
      <ImageBackground style={styles.bgImage} source={DynamicImage.splashImage}>
        <View style={styles.viewStyle}>
          <View style={styles.logov}>
            <MainLogo />
          </View>
          <View style={styles.maintoggle}>
            <ToggleSwitch
              isOn={isOn}
              onColor="green"
              offColor="gray"
              label={isOn ? "Online Mode" : "Offline Mode"}
              size="medium"
              onToggle={(newState) => chooseMode(newState)}
            />
          </View>

          <View style={styles.main}>
            <SelectDropdown
              data={emojisWithIcons}
              onSelect={(selectedItem, index) => {
                setType(selectedItem)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem || 'Select type'}
                    </Text>
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>

          <CustomeButton
            textColor={colors.white}
            label={appText.login}
            isdisabled={!type}
            onPress={() => {
              navigation.navigate("Login", { type: type });
            }}
            buttonContainerStyle={[
              styles.container,
              { backgroundColor: !type ? "grey" : COLORS.blue },
            ]}
          />
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={deleteApp}>
            <Image source={DynamicImage.cleanIcon} style={styles.image} />
          </TouchableOpacity>

          <Text
            style={[
              styles.description,
              { ...FONTS.h4roboto, color: colors.textHeadingColor, fontSize: 14 },
            ]}
          >
            {appText.poweredby}
          </Text>
        </View>
      </ImageBackground>
    </>
  );
};
export default GettingStarted;
const styles = StyleSheet.create({
  bgImage: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    justifyContent: "center",
  },
  maintoggle: {
    width: normalize(170),
    height: normalize(45),
    marginBottom: 5,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: normalize(10),
  },
  touch: { position: "absolute", bottom: 110 },
  logov: {
    width: 200,
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 10,
    alignItems: "center",
    height: 120,
    alignSelf: "center",
    justifyContent: "center",
  },
  image: {
    width: 45,
    height: 45,
  },
  container: {
    height: 50,
    width: "45%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    marginTop: 50,
  },
  logo: {
    height: 75,
    width: "100%",
    marginVertical: 10,
  },
  viewStyle: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: -40,
    marginTop: SIZES.tomargin,
  },
  dropdownButtonStyle: {
    width: normalize(170),
    height: normalize(45),
    borderWidth: 1,
    borderColor: COLORS.bluecolrHead,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: normalize(10),

    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    marginTop: 8, // this creates space BELOW image
    textAlign: "center",
  },
});
