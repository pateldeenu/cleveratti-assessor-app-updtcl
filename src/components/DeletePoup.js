import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import normalize from "react-native-normalize";
import { CustomeButton } from ".";
import { COLORS, SIZES } from "../constants/Theme";
import appText from "../utils/Localization/localization";

const DeletePoup = ({ showHelp }) => {
  const [showHelp, setShowHelp] = useState(false);
  const popUpHeight = Dimensions.get("window").height / 2;
  const [slideValue, setSlideValue] = useState(new Animated.Value(popUpHeight));

  const playSlideDownAnimation = () => {
    Animated.timing(slideValue, {
      toValue: popUpHeight,
      duration: 400,
    }).start(() => setShowHelp(false));
  };
  const playSlideUpAnimation = () => {
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 400,
    }).start();
  };

  return (
    <View>
      {showHelp ? (
        <>
          <Modal transparent isVisible={showHelp}>
            <TouchableOpacity
              style={styles.bottomView}
              onPress={() => playSlideDownAnimation()}
            >
              <View style={styles.bottomView2} />
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.animatedView,
                { transform: [{ translateY: slideValue }] },
              ]}
            >
              <Text style={styles.secondaryTitle}>
                Are you sure you want to delete John Doe profile?
              </Text>

              <CustomeButton
                textColor={COLORS.white}
                label={appText.delete}
                onPress={() => {
                  playSlideDownAnimation();
                }}
                buttonContainerStyle={styles.customButton}
              />
              <CustomeButton
                textColor={COLORS.white}
                label={appText.cancel}
                onPress={() => {
                  playSlideDownAnimation();
                }}
                buttonContainerStyle={[
                  styles.customButton,
                  { backgroundColor: COLORS.white },
                ]}
              />
            </Animated.View>
          </Modal>
        </>
      ) : null}
    </View>
  );
};

export default DeletePoup;

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "#F4EFFC",
    minHeight: "40%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: "10%",
  },
  customButton: {
    height: 50,
    width: "45%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.orange,
    alignSelf: "center",
    marginTop: 30,
  },

  bottomView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  bottomView2: {
    backgroundColor: "black",
    opacity: 0.5,
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    shadowColor: "#006",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    overflow: "hidden",
    justifyContent: "center",
  },

  secondaryTitle: {
    fontFamily: "Lato-Regular",
    fontSize: normalize(14),
    color: "#1F1235",
    lineHeight: 17,
    marginTop: 20,
  },
});
