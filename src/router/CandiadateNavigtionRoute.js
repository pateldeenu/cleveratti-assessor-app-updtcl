import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CandidateExam from "../screen/CandidateSection/CandidateExam";
import CandidateNavigationStack from "./CandidateNavigationStack";
import CandidateInstruction from "../screen/CandidateSection/CandidateInstruction";
import CandidateScreenData from "../screen/CandidateSection/CandidateScreenData";
import CandidateThankyouScreen from "../screen/CandidateSection/CandidateThankyouScreen";
import CandidateDashBoardScr from "../screen/CandidateSection/CandidateDashBoardScr";
import CandidateExamList from "../screen/CandidateSection/CandidateExamList";
import CandidateFeedbackScr from "../screen/CandidateSection/CandidateFeedbackScr";
import CadidateVivaScreen from "../screen/CandidateSection/CadidateVivaScreen";
import CustomDrawer from "../components/CustomDrawer"; // ✅ fixed

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigations() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="CandidateNavigationStack"
        component={CandidateNavigationStack}
      />
    </Drawer.Navigator>
  );
}

function StackNavigationScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerNavigations" component={DrawerNavigations} />
        <Stack.Screen name="CandidateInstruction" component={CandidateInstruction}/>
        <Stack.Screen name="CadidateVivaScreen" component={CadidateVivaScreen}/>

        <Stack.Screen name="CandidateScreenData" component={CandidateScreenData}/>
        <Stack.Screen name="CandidateExamList" component={CandidateExamList}/>
        <Stack.Screen name="CandidateFeedback" component={CandidateFeedbackScr}/>
        <Stack.Screen name="CandidateExam" component={CandidateExam}/>
        <Stack.Screen name="CandidateDashBoardScr" component={CandidateDashBoardScr}/>  
        <Stack.Screen name="CandidateThankyou" component={CandidateThankyouScreen} />
    
      {/* ... keep the rest here ... */}
    </Stack.Navigator>
  );
}

export default function CandidateAppRoutes() {
  return <StackNavigationScreens />;
}

