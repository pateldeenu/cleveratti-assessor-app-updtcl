import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import CustomDrawer from "../components/CustomDrawer";

import appText from "../utils/Localization/localization";
import { COLORS, SIZES } from "../constants/Theme";
import ContactScreen from "../screen/Contact/ContactScreen";
import CandidateDashboard from "../components/CandidateDashboard";
import UploadExam from "../screen/CandidateSection/UploadExam";
import { AppConfig } from "../screen/AssessmentDetails/Utils";

const Drawer = createDrawerNavigator();

const CandidateNavigationStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.lightBlue,
        drawerActiveTintColor: COLORS.textColors,

        drawerLabelStyle: {
          marginLeft: 10, // ✅ increase this value for more gap
          fontWeight: "400",
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name={appText.dashBoard}
        component={CandidateDashboard}
        options={{
          drawerIcon: () => (
            <Ionicons
              name="home-outline"
              size={SIZES.iconSize}
              color={COLORS.blue}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={AppConfig.UPLOAD_ASSESSMENT}
        component={UploadExam}
        options={{
          drawerIcon: () => (
            <Ionicons
              name="person-outline"
              size={SIZES.iconSize}
              color={COLORS.blue}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={appText.Contact_us}
        component={ContactScreen}
        options={{
          drawerIcon: () => (
            <Feather
              name="phone-call"
              size={SIZES.iconSize}
              color={COLORS.blue}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
export default CandidateNavigationStack;

