import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import PhonIcon from "react-native-vector-icons/Feather";
import CustomDrawer from "../components/CustomDrawer";
import DashboardComponent from "../components/DashboardComponent";
import appText from "../utils/Localization/localization";
import { COLORS, SIZES } from "../constants/Theme";
import ContactScreen from "../screen/Contact/ContactScreen";
import UploadExam from "../screen/CandidateSection/UploadExam";
import { AppConfig } from "../screen/AssessmentDetails/Utils";

const Drawer = createDrawerNavigator();

const NavigationStack = ({ navigation }) => {
  return (
    // <>
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.lightBlue,
        drawerActiveTintColor: COLORS.textColors,
        headerShown: false,
        headerLeft: 20,
        drawerLabelStyle: {
          marginLeft: -15,
          fontWeight: "400",
          fontFamily: "Lato-Regular",
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name={appText.dashBoard}
        component={DashboardComponent}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home-outline"
              size={SIZES.iconSize}
              color={COLORS.blue}
            />
          ),
          drawerItemStyle: { height: 0 },
        }}
      />

      <Drawer.Screen
        name={AppConfig.UPLOAD_ASSESSMENT}
        component={UploadExam}
        options={{
          drawerIcon: ({ color }) => (
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
          drawerIcon: ({ color }) => (
            <PhonIcon
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

export default NavigationStack;
