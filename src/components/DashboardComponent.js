import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import SearchComponent from "./Search";
import { COLORS } from "../constants/Theme";
import MenuIcon from "./MenuIcon";
import HomeContent from "../screen/Dashboard/HomeContent";

const DashboardComponent = (props) => {
  let { navigation } = props;
  const onChangeText = (SearchText) => {
    let userid = 1;
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden backgroundColor={COLORS.bgBlueColor} />
      <View style={styles.viewMargin}>
        <SearchComponent
          containerStyle={{ flex: 1 }}
          onChangeText={(text) => onChangeText(text)}
        />
        <MenuIcon onPress={() => navigation.openDrawer()} />
      </View>

      <View style={styles.viewDash}>
        <HomeContent navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    marginTop:30,
  },
  marginTopView: {
    marginTop: 10,
    marginBottom: Platform.OS === "android" ? 100 : 80,
    backgroundColor: COLORS.white,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  viewDash: {
    backgroundColor: COLORS.white,
    marginTop: 30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "100%",
  },
});
export default DashboardComponent;
