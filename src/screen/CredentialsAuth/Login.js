import {
  Text, ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { CustomeButton } from "../../components";
import React, { useState, useEffect, useRef } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { useTheme } from "../../utils/Appearance";
import appText from "../../utils/Localization/localization";
import MainLogo from "../../components/MainLogo";
import CustomTextInput from "../../components/CustomTextInput";
import { useDispatch } from "react-redux";
import { userLoginApiHit } from "../../redux/Actions/AllContentAction";
import { CommonActions } from "@react-navigation/native";
import { consoleLog, getData, setData, validate } from "../../utils/Utills";
import SimpleToast from "react-native-simple-toast";
import CustomTextInputPassword from "../../components/CustomTextInputPassword";
import AppSingleton from "../../utils/AppSingelton/AppSingelton";
import normalize from "react-native-normalize";
import {createLoginTable,db,insertLoginTable,} from "../../database/SqlLitedatabase";
import { AppConfig } from "../AssessmentDetails/Utils";
// import crashlytics from '@react-native-firebase/crashlytics';

const LoginScreen = ({ navigation, route }) => {
  let { colors } = useTheme();
  const { type } = route.params;
  const appSingleton = AppSingleton.getInstance();
  const dispatch = useDispatch();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userCounts, setUserCounts] = useState(null);


  useEffect(() => {
    if (!userName || !password) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [userName, password]);

  const getLoginApi = async () => {
    setLoadingIndicator(true);

    try {
      let token = await getData(AppConfig.FCM_TOKEN);
      let user_name = userName.trim();
      let user_password = password.trim();
      let loginRes = await dispatch(userLoginApiHit(user_name, user_password, token));

      if (loginRes.status == 200) {

        let token = loginRes.data.token;
        let name = loginRes.data.data.name;
        let mobile = loginRes.data.data.mobile;
        let candId = loginRes.data.data.candidate_id;
        let _id = loginRes.data.data._id;
        let ParentName = loginRes.data.data.father_name;

        setData(AppConfig.TOKEN, token);
        setData(AppConfig.NAME, name);
        setData(AppConfig.CAN_ID, candId);
        setData(AppConfig._id, _id);
        setData(AppConfig.PARENT_NAME, ParentName);
        setData(AppConfig.MOBILE, mobile);

        appSingleton.setUserToken(token);
        SimpleToast.show("Logged in sucessfully.");
        let type = loginRes.data.data.role.name;

        setData(AppConfig.ROLE, type);

        insertLoginTable(
          userName,
          password,
          candId,
          ParentName,
          type,
          name,
          token,
          mobile
        );

        if (type == "candidate") {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "CandidateAppRoutes" }],
            })
          );

        } else if (type == "facilitator") {
        } else if (type == "assessor") {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "appStack" }],
            })
          );
        }
      } else {
        SimpleToast.show(loginRes.data.message);
        setLoadingIndicator(false);
      }
      setLoadingIndicator(false);
    } catch (error) {
      SimpleToast.show(
        "Enter the valid credentials or Check internet connection."
      );
      setLoadingIndicator(false);
    }
  };

  const gotoMainScreen = (temp) => {
    if (temp[0].roleType == "candidate") {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "CandidateAppRoutes" }],
        })
      );
    } else if (temp[0].roleType == "facilitator") {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "appStack" }],
        })
      );
    } else if (temp[0].roleType == "assessor") {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "appStack" }],
        })
      );
    }
  };

  const fetchLoginTable = async () => {
    await createLoginTable();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM table_login WHERE user_name = '${userName}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          if (temp.length > 0) {
            loginApi(temp);
          } else {
            getLoginApi();
          }
        }
      );
    });
  };
  const loginApi = async (temp) => {
    if (temp[0]?.user_name == userName && temp[0]?.user_password == password) {
      appSingleton.setUserToken(temp[0].token);
      await setData(AppConfig.NAME, temp[0].name);
      await setData(AppConfig.TOKEN, temp[0].token);
      await setData(AppConfig.ROLE, temp[0].roleType);
      await setData(AppConfig.CAN_ID, temp[0].candidateId);
      await setData(AppConfig.PARENT_NAME, temp[0].ParentName);

      gotoMainScreen(temp);
    } else {
      getLoginApi();
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.logoV}>
            <View style={styles.logoVDat}>
              <MainLogo />
            </View>

            <Text
              style={[
                styles.description,
                { ...FONTS.h2bold, color: colors.blue },
              ]}
            >
              {`${type} Login`}
            </Text>

            <CustomTextInput
              placeholder={AppConfig.USER_NAME}
              inputValue={userName}
              setInputValue={setUserName}
            />

            <CustomTextInputPassword
              placeholder={AppConfig.PASSWORD}
              inputValue={password}
              setInputValue={setPassword}
              secureTextEntry={secureTextEntry}
              onpreseEyeIcon={() => setsecureTextEntry(!secureTextEntry)}
            />

            <CustomeButton
              isdisabled={btnDisabled}
              textColor={colors.white}
              // label={appText.loginto}
              label={loadingIndicator ? "Loading..." : appText.loginto}
              onPress={() => {
                // console.log("call crashlytics");
                // Force a crash (for testing purposes)
                // crashlytics().crash();
                fetchLoginTable();
              }}
              buttonContainerStyle={[
                styles.customButton,
                {
                  backgroundColor: btnDisabled ? COLORS.gray : COLORS.blue,
                },
              ]}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  logoView: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
  },
  logoVDat: {
    width: 200,
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 10,
    alignItems: "center",
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
  },
  logoV: { flex: 1, marginTop: 100 },
  heading: {
    fontWeight: "700",
    fontFamily: "Inter",
    fontSize: normalize(18),
    marginTop: normalize(20),
    alignSelf: "center",
    color: "black",
  },

  customButton: {
    height: 50,
    width: "45%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.bgBlueColor,
    alignSelf: "center",
    marginTop: 30,
  },

  bgImage: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
    flex: 1,
  },
  margin: { marginTop: -30 },

  logo: {
    height: 75,
    width: "100%",
    marginVertical: 10,
  },
  description: {
    alignItems: "flex-start",
    fontWeight: "700",
    marginTop: 40,
    marginLeft: 20,
  },

  container: { flex: 1, backgroundColor: COLORS.white },

  direction: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 40,
  },
  whatsNew: {
    marginHorizontal: normalize(50),
    marginTop: normalize(20),
    textAlign: "left",
  },
  buttonText: {
    color: "white",
    fontSize: normalize(15),
    fontFamily: "Inter",
    fontWeight: "normal",
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  noBg: {
    backgroundColor: undefined,
    marginTop: 20,
    alignSelf: "center",
  },
  blackText: {
    color: "#1F1235",
  },

  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // transparent dark overlay
    zIndex: 999,
  },

});

export default LoginScreen;
