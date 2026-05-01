import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screen/CredentialsAuth/Login";
import GettingStarted from "../screen/CredentialsAuth/Gettingstarted";
import ContinueScreen from "../screen/CredentialsAuth/ContinueScreen";
import TermsAndConditions from "../screen/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "../screen/PrivacyPolicy/PrivacyPolicy";
import AppRoutes from "./AppRoutes";
import MainLoginScreen from "../screen/CredentialsAuth/MainLoginScreen";
import AuditDashboardScreen from "../screen/Audit/AuditDashboardScreen";
import LoadMapScreen from "./Map/LoadMapScreen";
import AuditBatchListScreen from "../screen/Audit/AuditBatchListScreen";
import AttendanceDashboard from "../screen/Attendance/AttendanceDashboard";
import AttendanceListScreen from "../screen/Attendance/AttendanceListScreen";
import AttendanceDetails from "../screen/Attendance/AttendanceDetails";
import AttendanceTrack from "../screen/Attendance/AttendanceTrack";
import CandidateInstruction from "../screen/CandidateSection/CandidateInstruction";
import CandidateExam from "../screen/CandidateSection/CandidateExam";
import FacilitatorScreen from "../screen/Facilitator/FacilitatorScreen";
import CandidateFacilator from "../screen/Facilitator/CandidateFacilator";
import LiveBatch from "../screen/LiveStreaming/LiveBatch";
import ThankYouScreen from "../screen/Assessment/ThankYouScreen";
import CandidateScreenData from "../screen/CandidateSection/CandidateScreenData";
import CandidateThankyouScreen from "../screen/CandidateSection/CandidateThankyouScreen";
import CadidateVivaScreen from "../screen/CandidateSection/CadidateVivaScreen";
const Stack = createStackNavigator();

function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStart" component={GettingStarted} />
      <Stack.Screen name="continueScreen" component={ContinueScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
      <Stack.Screen name="appRoutes" component={AppRoutes} />
      <Stack.Screen name="AttendanceListScreen" component={AttendanceListScreen} />
      <Stack.Screen name="CandidateInstruction" component={CandidateInstruction}/>
      <Stack.Screen name="CandidateScreenData" component={CandidateScreenData}/>
      <Stack.Screen name="CandidateExam" component={CandidateExam} />
      <Stack.Screen name="CadidateVivaScreen" component={CadidateVivaScreen} />
      <Stack.Screen name="Facilitator" component={FacilitatorScreen} />
      <Stack.Screen name="CandidateFacilator" component={CandidateFacilator} />
      <Stack.Screen name="LiveBatch" component={LiveBatch} />
      <Stack.Screen name="AttendanceTrack" component={AttendanceTrack} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard}/>
      <Stack.Screen name="AttendanceDetails" component={AttendanceDetails}/>
      <Stack.Screen name="AuditBatchList" component={AuditBatchListScreen}/>
      <Stack.Screen name="Thankyou" component={ThankYouScreen} />
      <Stack.Screen name="CandidateThankyou" component={CandidateThankyouScreen}/>
      <Stack.Screen name="loadMapScreen" component={LoadMapScreen} />
      <Stack.Screen name="AuditDashboard" component={AuditDashboardScreen}/>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions}/>
    </Stack.Navigator>
  );
}
export default AuthRoutes;
