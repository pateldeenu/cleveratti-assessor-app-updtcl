import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from "moment";
import { PermissionsAndroid, Platform } from "react-native";
// import * as Permissions from "expo-permissions";
import {PERMISSIONS } from 'react-native-permissions';
import { AppConfig } from "../screen/AssessmentDetails/Utils";

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};


export const setDemoVideoPos = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};
export const getDemoVideoPos = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {}
};

export const setDemoVideoPath = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};


export const getDemoVideoPath = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {}
};

export const setDemoVideoGroup = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};

export function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}_${month}_${year}`;
};


export const getDemoVideoGroup = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {}
};

export function get_time_diff(intime, outTime) {
  // get unix seconds
  const began = moment(intime).unix();
  const stopped = moment(outTime).unix();
  // find difference between unix seconds
  const difference = stopped - began;
  // apply to moment.duration
  const duration = moment.duration(difference, "seconds");
  // then format the duration
  const h = duration.hours().toString();
  const m = duration.minutes().toString().padStart(2, "0");
  const s = duration.seconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function option(latitude, longitude) {
  return (data = {
    keyPrefix: AppConfig.MOBILES3,
    bucket: AppConfig.BUKET,
    region: AppConfig.REGION,
    accessKey: AppConfig.ACCESSKEY,
    secretKey: AppConfig.SECRET_KEY,
    successActionStatus: 201,
    metadata: {
      latitude: latitude, // Becomes x-amz-meta-latitude onec in S3
      longitude: longitude,
      photographer: AppConfig.PHOTO_GRAPHER,
    },
  });
}

//Save Image timeStamp wise In Internal folder 
export const moveImageToDirectoryS3Image = (filePath, targetDirectory) => {
  //console.log('S3 uri:', filePath);
  // Extract the image name from the path
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
  // const fileName = filePath; 
  console.log(fileName);
  // console.log("---:questionId--" + questionId);
  // console.log("---:batch_id--" + batch_id);

  const targetFilePath = `${targetDirectory}/${fileName}`;

  console.log('S3 Photo Image saved to directory:', targetFilePath);

  return RNFS.mkdir(targetDirectory)
    .then(() => RNFS.moveFile(filePath, targetFilePath))
    .then(() => targetFilePath);
  // console.log("---:targetFilePath--"+targetFilePath);

};

export const checkLocationPermissionOnAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Alert",
        message:
          "Turning on location services allows us to show your distance from other users when browsing matches, and allows other users to see their distance from you.",
        buttonPositive: "OKAY",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    throw error;
  }
};

export const requestLocationPermissionOnIOS = async () => {
  try {
    let { status } = await PERMISSIONS.askAsync(PERMISSIONS.LOCATION);

    return status === "granted";
  } catch (error) {
    captureException(
      "Error occured inside requestLocationPermissionOnIOS",
      error
    );
    throw error;
  }
};

export const consoleLog = (TAG, data) => {
  return console.log(`${TAG}+"--------"+ ${JSON.stringify(data)}`);
};

export const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const momentDateObject = (date) => {
  return moment(date);
};
export const dateLengthyFormate = (date) => {
  return moment(date, "x").format("DD MMMM YYYY");
};
export const timeStringFormate = (date) => {
  return moment(date).format("HH:mm");
};
export const dateFormate = (date) => {
  return moment(date).format("DD/MM/YYYY HH:mm:A");
  // return moment(date).format("DD/MM/YYYY HH:mm:a");
};
export const dateFormateDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};
export const timeFormate = (time) => {
  return moment(time).format("HH:mm:a");
};
export const timeDateFormate = (time) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

export const nameFixedCharacter = (name) => {
  return name ? (name.length > 8 ? name.substring(0, 10) + "..." : name) : "";
};

export const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteDataGroup = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Data deleted successfully!');
    // await AsyncStorage.getAllKeys()
    //   .then((keys) => AsyncStorage.multiRemove(keys))
    //   .then(() => console.log("success", "delete async storage"));
    return true;
  } catch (error) {
    return false;
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {}
};


export const deletedemoF= async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('First data deleted successfully!');
  } catch (error) {
    console.log('Error deleting value from AsyncStorage:', error);
  }
};

export const deletedemoS= async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('First data deleted successfully!');
  } catch (error) {
    console.log('Error deleting value from AsyncStorage:', error);
  }
};

export const deletedemoT= async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('First data deleted successfully!');
  } catch (error) {
    console.log('Error deleting value from AsyncStorage:', error);
  }
};

export const NoInterNet = (isconnect) => {
  if (!isconnect) {
    if (isconnect) {
      // showMessage({
      //   message: "Hello World",
      //   description: "This is our second message",
      //   type: "success",
      // });
    } else {
      // showMessage({
      //   message: "Hello World",
      //   description: "This is our second message",
      //   type: "success",
      // });
    }
  }
};
