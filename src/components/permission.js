import { PermissionsAndroid } from "react-native";

/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,      
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    if (      
      granted["android.permission.CAMERA"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.READ_EXTERNAL_STORAGE"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.ACCESS_COARSE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {      
      return true;
    } else {
      

      return false;
    }
  } catch (err) {
    
  }
}
