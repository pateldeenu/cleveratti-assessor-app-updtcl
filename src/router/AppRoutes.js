import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavigationStack from "./NavigationStack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import TotalBatch from "../screen/Assessment/TotalBatch";
import TodayAssessment from "../screen/Assessment/TodayAssessment";
import CompleteAssessment from "../screen/Assessment/CompleteAssessment";
import UpcomingAssessment from "../screen/Assessment/UpcomingAssessment";
import AssessmentDetailsScreen from "../screen/AssessmentDetails/AssessmentDetailsScreen";
import CameraScreen from "../screen/AssessmentDetails/CameraScreen";

import AssessmentInstructions from "../screen/AssessmentDetails/AssessmentInstructions";
import StartViva from "../screen/AssessmentDetails/StartViva";
import LoadMapScreen from "./Map/LoadMapScreen";
import AuditDashboardScreen from "../screen/Audit/AuditDashboardScreen";
import CustomDrawer from "../components/CustomDrawer ";
import AuditBatchListScreen from "../screen/Audit/AuditBatchListScreen";
import AttendanceDashboard from "../screen/Attendance/AttendanceDashboard";
import AttendanceListScreen from "../screen/Attendance/AttendanceListScreen";
import AttendanceDetails from "../screen/Attendance/AttendanceDetails";
import CandidateExam from "../screen/CandidateSection/CandidateExam";
import LiveBatch from "../screen/LiveStreaming/LiveBatch";
import ThankYouScreen from "../screen/Assessment/ThankYouScreen";
import MainLoginScreen from "../screen/CredentialsAuth/MainLoginScreen";
import AttendanceTrack from "../screen/Attendance/AttendanceTrack";
import AuditQuestionScreen from "../screen/Audit/AuditQuestionScreen";
import LoginScreen from "../screen/CredentialsAuth/Login";
import CandidateThankyouScreen from "../screen/CandidateSection/CandidateThankyouScreen";
import JoinChannelVideo from "../screen/LiveStreaming/AgoraVideoCall/AgoraVideoCall";
import CadidateVivaScreen from "../screen/CandidateSection/CadidateVivaScreen";
import UploadBatches from "../screen/Audit/UploadBatches";
import VideoRecording from "../screen/Audit/VideoRecording";
import StartRubricDemo from "../screen/AssessmentDetails/StartRubricDemo";
import StartVivaVideoRecording from "../screen/AssessmentDetails/StartVivaVideoRecording";
import VideoRecordingPractical from "../screen/AssessmentDetails/VideoRecordingPractical";
import VideoRecordingDemoPract from "../screen/AssessmentDetails/VideoRecordingDemoPract";
import Room from "../screen/Audit/WebRtcRoom";
import AssmtRoom from "../screen/AssessmentDetails/WebRtcAssmtRoom";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="navigationStack" component={NavigationStack} />
    </Drawer.Navigator>
  );
}


function StackNavigationScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />

      {/* your other stack-only screens */}
      <Stack.Screen name="AuditQuestion" component={AuditQuestionScreen} />

      <Stack.Screen name="TotalBatch" component={TotalBatch} />
      <Stack.Screen name="CompleteAssessment" component={CompleteAssessment} />
      <Stack.Screen name="UpcomingAssessment" component={UpcomingAssessment} />
      <Stack.Screen name="TodayAssessment" component={TodayAssessment} />

      <Stack.Screen name="loadMapScreen" component={LoadMapScreen} />

      <Stack.Screen name="AttendanceTrack" component={AttendanceTrack} />
      <Stack.Screen name="AttendanceListScreen" component={AttendanceListScreen} />
      <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard} />

      <Stack.Screen name="CandidateExam" component={CandidateExam} />
      <Stack.Screen name="CadidateVivaScreen" component={CadidateVivaScreen} />

      <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} />
      <Stack.Screen name="AuditBatchList" component={AuditBatchListScreen} />
      <Stack.Screen name="VideoRecording" component={VideoRecording} />
      <Stack.Screen name="StartVivaVideoRecording" component={StartVivaVideoRecording} />
      <Stack.Screen name="UploadBatches" component={UploadBatches} />
      <Stack.Screen name="VideoRecordingPractical" component={VideoRecordingPractical} />
      <Stack.Screen name="VideoRecordingDemoPract" component={VideoRecordingDemoPract} />
      <Stack.Screen name="Room" component={Room} />
      <Stack.Screen name="AssmtRoom" component={AssmtRoom} />
      <Stack.Screen name="AssessmentDetailsScreen" component={AssessmentDetailsScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen}/>
      <Stack.Screen name="AssessmentInstructions" component={AssessmentInstructions} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CandidateThankyou" component={CandidateThankyouScreen} />
      <Stack.Screen name="AuditDashboard" component={AuditDashboardScreen} />
      <Stack.Screen name="StartViva" component={StartViva} />
      <Stack.Screen name="StartRubricDemo" component={StartRubricDemo} />
      <Stack.Screen name="LiveBatch" component={LiveBatch} />
      <Stack.Screen name="Thankyou" component={ThankYouScreen} />
      <Stack.Screen name="LiveStreaming" component={JoinChannelVideo} />

      {/* ... keep the rest here ... */}
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return <StackNavigationScreens />;
}
