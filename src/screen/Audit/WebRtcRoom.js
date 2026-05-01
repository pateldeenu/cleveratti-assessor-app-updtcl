import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Button,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import WebRTCRecorderClient from "./webrtc";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { AgoraStyle } from "../LiveStreaming/AgoraVideoCall/components/ui";
import { ConfigColor } from "../AssessmentDetails/Utils";
import {
  updateQuestion_Video,
  db,
  insertImageTable,
} from "../../database/SqlLitedatabase";
import { BackHandler } from "react-native";
import Orientation from "react-native-orientation-locker";

const Room = ({ navigation, route }) => {
  const {
    questionId,
    batch_id,
    _id,
    assessment_id,
    roomId,
    latitude,
    longitude,
    currentAddress,
    dateTime,
  } = route.params;
  const [client, setClient] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isdbUpdate, setisdbUpdate] = useState(false);
  const [countdown, setCountdown] = useState(null); // null means no countdown
  const [buttonClicked, setButtonClicked] = useState(false);
  const [timer, setTimer] = useState(60);
  const ref = useRef();
  const [orientation, setOrientation] = useState("PORTRAIT");

  //   console.log("orientation", orientation);
  //   console.log("Local latitude:", latitude);
  //   console.log("Local longitude:", longitude);
  //   console.log("Local currentAddress:", currentAddress);
  //   console.log("Local dateTime:", dateTime);

  useEffect(() => {
    const webRTCClient = new WebRTCRecorderClient(
      roomId,
      latitude,
      longitude,
      currentAddress,
      dateTime
    );
    setClient(webRTCClient);
    // Initialize WebRTC and get the local stream
    webRTCClient.init().then((stream) => {
      console.log("Local Stream:", stream);
      setLocalStream(stream);
    });
    return () => {
      webRTCClient.handleDisconnect();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      //OnBackPrees();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(interval);
      setIsRunning(false);
      if (!isdbUpdate) {
        setisdbUpdate(true);
        stoptRecording();
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, isRunning]);
  console.log("Timer:", timer);

  useEffect(() => {
    const listener = (ori) => {
      console.log("📱 Device Orientation Changed:", ori); // Expect values like 'LANDSCAPE-LEFT'
      setOrientation(ori); // Save in state if you want to send to server later
    };
    Orientation.addDeviceOrientationListener(listener);
    // Initial value
    Orientation.getDeviceOrientation((ori) => {
      console.log("🔰 Initial Orientation:", ori);
      setOrientation(ori);
    });

    return () => {
      Orientation.removeDeviceOrientationListener(listener);
    };
  }, []);

  const handleStartButtonPress = () => {
    if (buttonClicked || countdown !== null) return;
    setCountdown(3); // Start countdown from 3
    let interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown(null);
          setButtonClicked(true); // disable button permanently
          startRecording(); // Start the recording
        }
        return prev - 1;
      });
    }, 1000); // decrease every second
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    let status = client?.handleStartRecording(orientation);
    // console.log("status", status);
    if (status) {
      setIsRunning(true);
    }
  };

  // const stoptRecording = async () => {
  //   console.log("stoptRecording called");
  //   setIsRunning(false);
  //   client?.handleDisconnect();
  //   saveBack();
  // };

  const stoptRecording = async () => {
    //console.log("Start stoptRecording");
    setIsRunning(false);
    try {
        await Promise.resolve(client?.handleDisconnect?.());
    } catch (err) {
        console.log("Error in handleDisconnect:", err);
    }
    try {
        await saveBack();
    } catch (err) {
        console.log("Error in saveBack:", err);
    }
};

  const saveBack = async () => {
    console.log("--:saveBack");
    insertImageTable(questionId, "", "", batch_id, "false", "2");
    updateQuestion_Video("", "2", questionId, batch_id);
    navigation.navigate("AuditQuestion", { assessment_id, batch_id, _id });
  };

  const backWithoutRequired = async () => {
    setIsRunning(false);
    client?.handleDisconnect();
    navigation.navigate("AuditQuestion", { assessment_id, batch_id, _id });
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View>
          <View style={styles.viewMargin}>
            <MenuIcon
              //onPress={() => navigation.goBack()}
              onPress={() => {
                backWithoutRequired();
              }}
              back="back"
            />
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: normalize(18),
                  color: COLORS.black,
                  ...FONTS.h2,
                  alignSelf: "center",
                  justifyContent: "center",
                  width: "70%",
                  textAlign: "center",
                },
              ]}
            >
              {"Record video"}
            </Text>
          </View>
        </View>
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <Text style={styles.textLeft}>Timer:-{formatTime(timer)}</Text>
        </View>
        
        <View style={styles.containervideos}>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.video}
              mirror={false}
              zOrder={1}
            />
          )}
        </View>
        <CustomeButton
          textColor={ConfigColor.white}
          isdisabled={buttonClicked || countdown !== null || isRunning}
          label={
            countdown !== null
              ? `Starting in ${countdown}...`
              : buttonClicked || isRunning
              ? "Recording......"
              : "Start Recording"
          }
          labelStyle={{ fontSize: 14 }}
          onPress={handleStartButtonPress}
          buttonContainerStyle={[AgoraStyle.container]}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  containervideos: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  container: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  video: {
    width: 400,
    height: 400,
  },
  textLeft: {
    flex: 1,
    textAlign: "left",
    marginLeft: 25,
    color: "#000", // White text color
    fontSize: 15,
    fontWeight: "bold",
  },
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
});

export default Room;
