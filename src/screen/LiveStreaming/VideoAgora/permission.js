import { PermissionsAndroid } from "react-native";

/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

      // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      // PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

      // granted["android.permission.READ_MEDIA_IMAGES"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&
      // granted["android.permission.READ_MEDIA_VIDEO"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&
      // granted["android.permission.READ_MEDIA_AUDIO"] ===
      //   PermissionsAndroid.RESULTS.GRANTED
    ]);
    if (
      granted["android.permission.RECORD_AUDIO"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.CAMERA"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
    
      granted["android.permission.ACCESS_COARSE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED 


      // granted["android.permission.READ_EXTERNAL_STORAGE"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&
      // granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&

      // granted["android.permission.READ_MEDIA_IMAGES"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&
      // granted["android.permission.READ_MEDIA_VIDEO"] ===
      //   PermissionsAndroid.RESULTS.GRANTED &&
      // granted["android.permission.READ_MEDIA_AUDIO"] ===
      //   PermissionsAndroid.RESULTS.GRANTED

      
    ) {
      console.log("permisssion allow");
      return true;
    } else {
      console.log("Permission denied");

      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}
