import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  AppState,
} from "react-native";

import normalize from "react-native-normalize";

const VersionUpdate = () => {
  const skipVersion = async () => {};

  return (
    <View style={[styles.positionAbsolute, styles.blurryBg, styles.bottom]}>
      <View style={styles.card}>
        <Text style={styles.heading}>
          {false ? "Update Your App 💡" : "New Version Available 💡"}
        </Text>
        {/* {isForce ? ( */}
        <Text style={styles.paragraph}>
          {
            "Looks like your app is not up-to-date.\n\nUpdate your SwoonMe app as soon as possible or you won’t be able to use the app until you do!"
          }
        </Text>
        {/* ) : ( */}
        <Text style={styles.paragraph}>
          {
            "There’s a fresh version of SwoonMe available for download. Get it now by updating your app! "
          }
        </Text>
        {/* )} */}

        <Text style={styles.whatsNew}>
          <Text style={styles.subtitle}>{"What's new : "}</Text>
          <Text style={styles.text}>
            {"Enhanced live streming data . Attendance section added"}
          </Text>
        </Text>
        <TouchableOpacity
        // style={dStyles.button}
        // onPress={() => openStore(versionData.storeUrl)}
        >
          <Text style={styles.buttonText}>{"Update Now"}</Text>
        </TouchableOpacity>
        {/* {!isForce && ( */}
        <TouchableOpacity style={[styles.noBg]} onPress={skipVersion}>
          <Text style={[styles.buttonText, styles.blackText]}>
            {"Skip this version"}
          </Text>
        </TouchableOpacity>
        {/* )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  positionAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgWhite: {
    backgroundColor: "white",
  },
  logo: {
    height: 100,
    width: 100,
  },
  blurryBg: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    backgroundColor: "#F4EFFC",
    paddingVertical: 60,
    alignItems: "center",
  },
  heading: {
    fontWeight: "700",
    fontFamily: "Inter",
    fontSize: normalize(20),
    color: "black",
  },
  paragraph: {
    fontWeight: "400",
    fontFamily: "Inter",
    fontSize: normalize(15),
    color: "black",
    marginHorizontal: normalize(50),
    marginBottom: normalize(8),
    marginTop: normalize(20),
    textAlign: "left",
  },
  subtitle: {
    fontFamily: "Inter",
    fontSize: normalize(15),
    color: "#1B1425",
    fontWeight: "400",
  },
  text: {
    color: "#67568C",
    fontSize: normalize(13),
    fontFamily: "Inter",
  },
  whatsNew: {
    marginHorizontal: normalize(50),
    marginTop: normalize(20),
    textAlign: "left",
  },
  buttonText: {
    color: "white",
    fontSize: normalize(15),
    fontFamily: "Inter",
    fontWeight: "normal",
  },
  noBg: {
    backgroundColor: undefined,
  },
  blackText: {
    color: "#1F1235",
  },
});

export default VersionUpdate;
