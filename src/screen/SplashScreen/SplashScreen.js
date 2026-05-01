import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { getData } from "../../utils/Utills";
import FooterLogo from "../../components/FooterLogo";
import MainLogo from "../../components/MainLogo";
import DynamicImage from "../../constants/DynamicImage";
import AppSingleton from "../../utils/AppSingelton/AppSingelton";
import requestCameraAndAudioPermission from "../LiveStreaming/VideoAgora/permission";
import RNFS from 'react-native-fs';
import {
  NotificationListner,
  requestUserPermission,
} from "../../utils/PushNotificationHelper";
import { showMessage } from "react-native-flash-message";
import { checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

const SplashScreen = ({ navigation }) => {
  const appSingleton = AppSingleton.getInstance();

  useEffect(() => {
    if (Platform.OS === "android") {
      //Request required permissions from Android
      createOutputDirectory();
      requestCameraAndAudioPermission().then((res) => {
        console.log("requested!:----", res);
        if (res) checkState();
      });
    }
  }, []);

  const createOutputDirectory = async () => {
    try {
      const outputPath =
        Platform.OS === 'android'
          ? `${RNFS.CachesDirectoryPath}/Camera`
          : `${RNFS.CachesDirectoryPath}/Camera`;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save files',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await RNFS.mkdir(outputPath);
        console.log('Output directory created');
      } else {
        console.log('Storage permission denied');
      }
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();

  }, []);

  const checkState = async () => {
    requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ]).then((statuses) => {
      // console.log("call statuses:--");
    });

    let token = await getData("token");
    let type = await getData("role");
    appSingleton.setUserToken(token);

    console.log("--token:--", token);
    console.log("--type:--", type);

    if (token) {
      if (type == "candidate") {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "CandidateAppRoutes" }],
          })
        );
      } else if (type == "assessor") {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "appStack" }],
          })
        );
      }
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "authStack" }],
        })
      );
    }

  };
  return (
    <>
      <StatusBar hidden />

      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.bg}
          source={DynamicImage.splashImage}
        >
          <MainLogo />
        </ImageBackground>
        <FooterLogo bottomMargin={40} />
      </View>
    </>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
