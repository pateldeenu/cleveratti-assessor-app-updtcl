import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, FONTS, SIZES } from "../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrowComponent from "./BackArrowComponent";
import LogoutModal from "./Modal/LogoutModal";
import { deleteData, getData } from "../utils/Utills";
import { CommonActions } from "@react-navigation/native";
import appText from "../utils/Localization/localization";
import DynamicImage from "../constants/DynamicImage";
import ApiUrl from "../utils/UrlConfig";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/Actions/BasicAction";

const CustomDrawer = (props) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [image, setimage] = useState(
    "https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png"
  );
  const [showLogout, setShowLogout] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const nameValue = await getData("name");
        const typeValue = await getData("role");
        setName(nameValue);
        setType(typeValue);
        console.log("types", typeValue);
      } catch (error) {
        console.error("Error fetching drawer data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={styles.back}>
          <BackArrowComponent
            onPress={() => props.navigation.closeDrawer()}
            nameIcon={"right"}
          />
        </View>

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ backgroundColor: COLORS.white }}
        >
          <View style={styles.containerView}>
            <View style={styles.viewArr}>
              <ImageBackground
                style={styles.bgImage2}
                source={DynamicImage.circle}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.centerAlign}
                ></Image>
              </ImageBackground>
            </View>
          </View>
          <Text style={styles.textStyle}>{name}</Text>
          <View style={styles.headerView} />

          <View style={styles.drawerItem}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.viewDraw}>
          <TouchableOpacity
            onPress={() => setShowLogout(!showLogout)}
            style={{ paddingVertical: 5 }}
          >
            <View style={styles.iconStyle}>
              <Ionicons
                name="exit-outline"
                size={SIZES.size22}
                color={COLORS.blue}
              />
              <Text style={styles.fontView}>{appText.exit}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <LogoutModal
        onYesPress={async () => {
          setShowLogout(false);
          
          // Dispatch logout action to clear Redux state
          dispatch(logoutUser());
          
          // Clear authentication data from storage
          await deleteData("token");
          await deleteData("role");
          await deleteData("name");
          
          // Reset navigation to auth stack for all users
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "authStack" }],
            })
          );
        }}
        message={appText.logoutmessage}
        title={appText.logout}
        navigation={props.navigation}
        cancel={() => {
          setShowLogout(false);
        }}
        isVisible={showLogout}
        yesTitle={appText.ok}
        cancelTitle={appText.cancel}
      />
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  bgImage2: {
    width: 95,
    height: 95,
    alignItems: "center",
    justifyContent: "center",
  },
  viewDraw: { padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" },
  bgImage: {
    width: 100,
    height: 100,
  },
  drawerItem: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    marginTop: 10,
  },
  headerView: {
    marginTop: 20,
    borderTopWidth: 2,
    width: "60%",
    borderTopColor: "#ccc",
    alignSelf: "center",
  },
  fontView: {
    fontSize: 15,
    fontFamily: FONTS.fontFamily,
    marginLeft: 5,
  },
  iconStyle: { flexDirection: "row", alignItems: "center" },
  viewArr: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 125,
    borderColor: COLORS.blueDark,
  },

  back: { alignSelf: "flex-end", marginRight: 20 },
  centerAlign: {
    width: 95,
    height: 95,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 125,
  },

  textStyle: {
    fontFamily: FONTS.fontFamily,
    color: COLORS.textColors,
    marginTop: 25,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  containerView: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? -50 : 0,
  },
});
