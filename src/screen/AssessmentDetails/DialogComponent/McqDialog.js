import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";
import Dialog, {
  DialogContent,
  DialogFooter,
  ScaleAnimation,
} from "react-native-popup-dialog";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants/Theme";
import ModalDropdown from "react-native-modal-dropdown";
const DEMO_OPTIONS_1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
import IconArrow from "react-native-vector-icons/AntDesign";
import { Easing } from "react-native-reanimated";
import { ConfigColor } from "../Utils";
const chevron = require("../../../assets/images/chevron-down.png");

const McqDialog = ({
  dialogVisible,
  title,
  content,
  desc,
  onPress,
  buttonText = "OKAY",
}) => {
  const [gender, setGender] = useState("");
  const [rotateValueHolder, setRotateValueHOlder] = useState(
    new Animated.Value(0)
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const startImageRotateDown = () => {
    // rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  };

  const startImageRotateUp = () => {
    // rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start();
  };

  const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-180deg"],
  });

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);

    if (isExpanded) {
      startImageRotateUp();
    } else {
      startImageRotateDown();
    }
  };
  return (
    <View>
      <Dialog
        overlayBackgroundColor={"#2A272F"}
        overlayOpacity={0.6}
        overlayPointerEvents={"none"}
        width={"80%"}
        visible={dialogVisible}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        dialogStyle={{ backgroundColor: "#F4EFFC" }}
        footer={
          <DialogFooter style={styles.buttonContainerStyle}>
            <View style={{ flexDirection: "row" }}>
              <CustomeButton
                textColor={ConfigColor.white}
                label={"SUBMIT"}
                labelStyle={{ fontSize: 14 }}
                onPress={onPress}
                buttonContainerStyle={[
                  styles.container,
                  { backgroundColor: COLORS.colorYellow },
                ]}
              />
              <CustomeButton
                textColor={ConfigColor.white}
                label={"SKIP"}
                labelStyle={{ fontSize: 14 }}
                onPress={onPress}
                buttonContainerStyle={[
                  styles.container,
                  { backgroundColor: COLORS.colorGreen },
                ]}
              />
            </View>
          </DialogFooter>
        }
      >
        <View
          style={{
            backgroundColor: COLORS.colorGreen,
            paddingVertical: normalize(10),
          }}
        >
          <Text style={styles.title2}>{"Add Theory Marks"}</Text>
        </View>

        <Text
          style={
            (styles.title2,
            {
              color: COLORS.textColors,
              fontSize: 18,
              paddingVertical: 20,
              alignItems: "center",
              alignSelf: "center",
            })
          }
        >
          {title}
        </Text>

        <View style={{ flex: 3 }}>
          <ModalDropdown
            style={[styles.inputHeight, { marginRight: 5 }]}
            textStyle={styles.dropText}
            options={DEMO_OPTIONS_1}
            value={gender}
            defaultValue={"Select Theory Marks"}
            dropdownTextStyle={styles.dropView}
            onSelect={(index, value) => {
              setGender(value);

              handleToggleExpand();
            }}
            dropdownStyle={styles.dropDownView}
            renderRightComponent={() => (
              // <IconArrow
              //   size={SIZES.iconArrowSize}
              //   color={"#C74171"}
              //   name="down"
              // />

              <Animated.Image
                source={chevron}
                style={{
                  height: normalize(9),
                  width: normalize(16),
                  position: "absolute",
                  right: normalize(-5),
                  transform: [{ rotate: rotateData }],
                }}
              />
            )}
          />
        </View>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainerStyle: {
    borderColor: "transparent",
    alignSelf: "center",
    marginTop: 50,
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
    marginLeft: normalize(20),
    marginVertical: normalize(10),
    alignItems: "center",
    width: "40%",
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

export default McqDialog;
