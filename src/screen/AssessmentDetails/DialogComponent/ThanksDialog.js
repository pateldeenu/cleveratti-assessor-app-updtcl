import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Image,
} from "react-native";
import Dialog, {
  DialogContent,
  DialogFooter,
  ScaleAnimation,
} from "react-native-popup-dialog";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants/Theme";
import ModalDropdown from "react-native-modal-dropdown";

const ThanksDialog = ({
  dialogVisible,
  title,
  content,
  desc,
  onPress,
  buttonText = "OKAY",
}) => {
  return (
    <View>
      <Dialog
        // overlayBackgroundColor={"#2A272F"}
        // overlayOpacity={0.1}
        overlayPointerEvents={"none"}
        width={"80%"}
        visible={dialogVisible}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        dialogStyle={{ backgroundColor: "white" }}
        footer={
          <DialogFooter style={styles.buttonContainerStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                width: "80%",
                justifyContent: "center",
              }}
            >
              <CustomeButton
                textColor={"#fff"}
                label={"Okay"}
                labelStyle={{ fontSize: 14 }}
                onPress={onPress}
                buttonContainerStyle={[
                  styles.container,
                  { backgroundColor: COLORS.blue },
                ]}
              />
            </View>
          </DialogFooter>
        }
      >
        <View>
          <View
            style={{
              backgroundColor: COLORS.blue,
              paddingVertical: normalize(10),
            }}
          >
            <Text style={styles.title2}>{"Attendance"}</Text>
          </View>
          <View>
            <Text style={[styles.tIds]}>
              {"Subbmit Successfully your attendance. "}
            </Text>
          </View>
        </View>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainerStyle: {
    borderColor: "transparent",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  title2: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(20),
    fontWeight: "700",
    alignSelf: "center",

    color: "#fff",
  },
  buttonTextStyle: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "android" ? normalize(16) : normalize(14),
    fontWeight: "500",
    color: "#FFFF",
    height: 22,
  },

  container: {
    borderRadius: 10,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    marginVertical: normalize(10),
    alignItems: "center",
    width: "80%",
  },

  tIds: {
    fontWeight: "700",
    fontSize: normalize(20),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "100%",
    justifyContent: "center",
    marginHorizontal: 50,
    padding: 20,
    alignSelf: "center",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    width: "100%",
  },

  container: {
    height: 45,
    width: "100%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    paddingHorizontal: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  dropDownView: { width: "60%", paddingTop: 10 },
  dropView: {
    ...FONTS.h4roboto,
    color: COLORS.gray,
    borderColor: COLORS.line2COlor,
    fontSize: 16,
  },
  buttonStyle: { backgroundColor: "#FF8B89", borderRadius: 5 },
  titleStyle: {
    fontFamily: "Inter",
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#1F1235",
  },
  dropText: {
    width: "93%",
    ...FONTS.latoRegularFont,
    lineHeight: 15,
  },
  fontStyle: {
    width: "93%",
    ...FONTS.latoRegularFont,
    lineHeight: 15,
  },
  dropStyle: {
    ...FONTS.latoRegularFont,
    color: COLORS.gray,
    borderColor: COLORS.line2COlor,
    fontSize: SIZES.size16,
  },

  inputHeight: {
    fontSize: 16,
    height: 45,
    width: "90%",
    paddingLeft: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingRight: 10,
    backgroundColor: "white",
    borderColor: COLORS.line2COlor,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,

    paddingVertical: 14,
  },

  desc: {
    marginTop: 10,
    fontFamily: "Inter",
    fontSize: normalize(15),
    fontWeight: "400",
    color: "#3A3454",
    // opacity: 0.7,
  },
});

export default ThanksDialog;
