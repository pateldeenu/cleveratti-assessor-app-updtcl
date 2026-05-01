import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";  // Use react-native-modal
import normalize from "react-native-normalize";
import { COLORS, FONTS, ConfigColor } from "../constants/Theme";
import IconArrow from "react-native-vector-icons/AntDesign";
import ViewShot from "react-native-view-shot";

const ImageTimeStamp = ({
  dialogVisible,
  onPress,
  RightCheckonPress,
  uri,
  latitude = 0.0,
  longitude = 0.0,
  currentAddress,
}) => {
  const viewShot = useRef();
  const [dateTime, setDt] = useState(new Date().toLocaleString());
  return (
    <View>
      <Modal
        isVisible={dialogVisible} // Replace 'visible' with 'isVisible'
        backdropColor="#2A272F"
        backdropOpacity={0.6}
        onBackdropPress={onPress} // Close when tapping outside
        style={styles.modal}
      >
        <View style={styles.main}>
          <TouchableOpacity onPress={onPress}>
            <IconArrow size={35} color={"#FF0000"} name="delete" />
          </TouchableOpacity>
          <Text style={styles.title2}>{"Photo"}</Text>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                if (viewShot.current) {
                  viewShot.current.capture().then((uri) => {
                    RightCheckonPress(uri);
                  }).catch(error => console.log("--: Capture Error --", error));
                }
              }, 500); // Delay by 500ms
            }}
          >
            <IconArrow size={35} color={ConfigColor.white} name="checkcircleo" />
          </TouchableOpacity>
        </View>

        <ViewShot
          ref={viewShot}
          style={styles.short}
          options={{
            format: "jpg",
            quality: 1.0,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <View style={styles.Cont}>
            <Image
              source={{ uri: uri }}
              style={styles.image}
            />
            <Text style={styles.test}>
              {dateTime + "\n"}
              {currentAddress + "\n" + `Lat & Long - ${latitude} & ${longitude}`}
            </Text>
            {/* <View style={styles.textContainer}> */}
      {/* <Text style={styles.text}>{dateTime}</Text> */}
      {/* <Text style={styles.text}>{currentAddress}</Text>
      <Text style={styles.text}>{`Lat & Long - ${latitude} & ${longitude}`}</Text> */}
    {/* </View> */}
    
          </View>

          

        </ViewShot>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 0, // Full-screen modal
  },
  title2: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(20),
    fontWeight: "700",
    paddingHorizontal: 60,
    color: "#fff",
  },
  image: {
    width: "95%",
    alignSelf: "center",
    marginTop: 40,
    height: "80%",
  },
  test: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(13),
    fontWeight: "600",
    alignSelf: "center",
    position: "absolute",
    right: 20,
    bottom: 120,
    color: "#fff",
  },
  Cont: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    height: "100%",
  },
  short: { flex: 1, width: "100%", height: "100%" },
  main: {
    backgroundColor: COLORS.blue,
    paddingVertical: normalize(20),
    justifyContent: "space-around",
    width: "100%",
    flexDirection: "row",
  },

  textContainer: {
   // width: "30%", // Text takes 30% of the row
   // alignItems: "flex-end", // Align text to the right side
  },
  // text: {
  //   fontFamily: "Lato-Bold",
  //   fontSize: normalize(13),
  //   color: "#000",
  //   fontWeight: "bold",
  //   textAlign: "right", // Align text to the right
  //   marginBottom: 5,
  // },
});

export default ImageTimeStamp;