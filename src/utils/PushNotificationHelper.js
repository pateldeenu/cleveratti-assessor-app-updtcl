// import messaging from "@react-native-firebase/messaging";
import { AppConfig } from "../screen/AssessmentDetails/Utils";
import { setData } from "./Utills";
// import { showMessage } from "react-native-flash-message";

const SERVER_KEY =
  "AAAAT4RLUEo:APA91bHs9YJmb0tN2OjvUrtMb17feCSK_HvBB0xcNc-jk9v9qJsuMrBqkvE04KDnMkPljsW4GzHTy6r8trrKvLmKHQXTtsvHweWTnxeyo4L6A6t2v4eXxCHRsu8ggo9hVixwGPyyR4am";

export async function requestUserPermission() {
  // const authStatus = await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // if (enabled) {
  //   console.log("Authorization status:", authStatus);
  //   fcmToken();
  // }
}

// const foregroundMessage = (message, onPress) => {
//   showMessage({
//     message: {
//       message: message,
//       onPress,
//     },
//   });
// };

// async function fcmToken() {
//   try {
//     let getToken = await messaging().getToken();
//     await setData(AppConfig.FCM_TOKEN, getToken);
//     console.log("new token", getToken);
//   } catch (err) {
//     console.log(err);
//   }
// }

// export const NotificationListner = (navigation) => {
//   messaging().onNotificationOpenedApp((remoteMessage) => {
//     console.log(
//       "Notification caused app to open from background state:",
//       remoteMessage.notification
//     );
//   });

//   messaging()
//     .getInitialNotification()
//     .then((remoteMessage) => {
//       if (remoteMessage) {
//         console.log(
//           "Notification caused app to open from quit state:",
//           remoteMessage.notification
//         );
//       }
//     });

//   messaging().onMessage(async (remoteMessage) => {
//     console.log("remoteMessage", remoteMessage);
//     foregroundMessage({
//       remoteMessage,
//       onPress: () => navigation.navigate("LiveStreaming"),
//     });
//     return remoteMessage;
//   });
// };
