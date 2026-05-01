import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, FlatList } from "react-native";
import { RTCView } from "react-native-webrtc";
import WebRTCRecorderClient from "./webrtc";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { AgoraStyle, } from "../LiveStreaming/AgoraVideoCall/components/ui";
import { ConfigColor, AppConfig } from "./Utils";
import {
    updateQuestion_Video,
    db,
    insertImageTable,
} from "../../database/SqlLitedatabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDemoVideoPos, setDemoVideoPath, setDemoVideoGroup } from "../../utils/Utills";
import { BackHandler } from 'react-native';
import { getAssessorVivaList } from "../../redux/Actions/AllContentAction";
import SimpleToast from "react-native-simple-toast";
import Orientation from "react-native-orientation-locker";
import { useDispatch, useSelector, } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";


const AssmtRoom = ({ navigation, route }) => {
    const { stmode, data, assessment_id, vivaData, positionvrt, copiedvivaData, quesId, candS3Path, idS3Path, candWithIdS3Path, dataDetailsArr, examType, rtcToken, atm_quest, dataDetails, grpdata, position, batchIdNo, batch_id, DemoButtonStatus, vivaStatus, attempt, optionF, groupPos, roomId, latitude,
        longitude, currentAddress, dateTime, type, isGroup } = route.params;
    const [client, setClient] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isdbUpdate, setisdbUpdate] = useState(false);
    const [timer, setTimer] = useState(60);
    const [questdt, setquestdt] = useState([]);
    const [orientation, setOrientation] = useState("PORTRAIT");
    const dispatch = useDispatch();

    // console.log("Local roomId:", roomId);
    // console.log("Local latitudes:", latitude);
    // console.log("Local longitudess:", longitude);
    // console.log("Local currentAddress:", currentAddress);
    // console.log("Local dateTime:", dateTime);
    // console.log("Local type:", type);
    // console.log("Local groupPos:", groupPos);
    // console.log("Local isGroup:", isGroup);

    useEffect(() => {
        if (stmode === "1") {
            apiquestData();
        }
    }, []);
    
    useEffect(() => {
        const webRTCClient = new WebRTCRecorderClient(roomId, latitude, longitude, currentAddress, dateTime, type, isGroup);
        setClient(webRTCClient);
        // Initialize WebRTC and get the local stream
        webRTCClient.init().then(stream => {
            // console.log("Local Stream:", stream);
            setLocalStream(stream);
        });
        return () => {
            webRTCClient.handleDisconnect();
        };
    }, []);


    // useEffect(() => {
    //     const backAction = () => {
    //         return true; // Block back button
    //     };
    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );
    //     return () => backHandler.remove(); // Cleanup on unmount
    // }, []);


     useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            return true; // block back
          };
    
          const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress
          );
    
          return () => subscription.remove(); // ✅ correct cleanup
        }, [])
      );
    

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
                stoptRecording()
            }
        }
        return () => {
            clearInterval(interval);
        };
    }, [timer, isRunning]);

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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        let status = client?.handleStartRecording(orientation)
        // console.log("status", status);
        if (status) {
            setIsRunning(true);
        }
        // setIsRunning(true);
    };

    const stoptRecording = async () => {
        setIsRunning(false);
        client?.handleDisconnect()
        saveBack();
    }

    const saveBack = async () => {
        if (stmode === "1") {
            await setDemoVideoPos(AppConfig.DEMOGROUPVDPOS, optionF);
            await setDemoVideoPath(AppConfig.DEMOGROUPVIDEOPATH, "targetFilePath");
            await setDemoVideoGroup(AppConfig.DEMOVIDEOGROUP, groupPos);
            //replace
            // Pop to top to remove this screen from stack before navigating to AssessmentDetailsScreen
            // navigation.popToTop();
            // navigation.navigate("AssessmentDetailsScreen", { dataDetails, position, batchIdNo, batch_id, DemoButtonStatus, vivaStatus, attempt })
            navigation.replace("AssessmentDetailsScreen", { dataDetails, position, batchIdNo, batch_id, DemoButtonStatus, vivaStatus, attempt })

        } else {
            updateVdRecordByQId(quesId);
        }
    }

    const updateVdRecordByQId = (q_id) => {
        const vivaData = copiedvivaData.map(item =>
            item.q_id === q_id ? { ...item, vdrecord: "1" } : item
        );

        navigation.navigate("StartVivaVideoRecording", {
            data,
            assessment_id,
            vivaData,
            candS3Path,
            idS3Path,
            candWithIdS3Path,
            dataDetailsArr,
            examType,
            batchIdNo,
            latitude,
            latitude,
            rtcToken,
            atm_quest,
            dataDetails,
            positionvrt
        });
    };

    const backWithoutRequired = async () => {
        setIsRunning(false);
        client?.handleDisconnect()
        navigation.goBack()
    }

    const apiquestData = async () => {
        try {
            const assessorId = grpdata?.[0]?._id;
            const assessmentId = dataDetails?.[position]?.assessment_id;

            if (!assessorId || !assessmentId) {
                SimpleToast.show("Invalid Assessor or Assessment ID.");
                return;
            }
            const dataRes = await dispatch(getAssessorVivaList("demo", assessmentId, assessorId));

            if (dataRes.status === 200) {
                const questions = dataRes?.data?.questions;
                if (Array.isArray(questions) && questions.length > 0) {
                    let foundRubric = false;
                    let foundEngQuestion = null;
                    const allEngQuestions = [];

                    for (const it of questions) {
                        if (Array.isArray(it.rubric) && it.rubric.length > 0 && !foundRubric) {
                            foundRubric = true;
                        }
                        const engQuestions = it?.question?.question?.filter(q => q.lang === "eng");

                        if (Array.isArray(engQuestions) && engQuestions.length > 0) {
                            const contents = engQuestions.map(q => q.content);
                            allEngQuestions.push(...contents); // ✅ Colle
                        }
                    }
                    if (foundRubric) {
                        SimpleToast.show("Rubric is present.");
                    }
                    setquestdt(allEngQuestions); // ✅ Set once after the loop
                } else {
                    SimpleToast.show(`Assessment ${examType} Question is not found.`);
                }
            } else {
                SimpleToast.show("Server Problem.");
            }

        } catch (error) {
            SimpleToast.show("Server Problem (504 Gateway Time-out).");
            console.log("apiData error:", error);
        } finally {
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.index}>{index + 1}.</Text>
            <Text style={styles.text}>{item}</Text>
        </View>
    );

    const rendervbItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.index}>{index + 1}.</Text>
            <Text style={styles.text}>{item.quest}</Text>
        </View>
    );

    return (
        <>
            <SafeAreaView style={styles.constainer}>
                <View >
                    <View style={styles.viewMargin}>
                        <MenuIcon
                            //  onPress={() => navigation.goBack()} 
                            onPress={() => {
                                backWithoutRequired()
                            }}
                            back="back" />
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
                <View style={styles.container}>
                    {stmode === '1' ? (
                        <FlatList
                            data={questdt}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    ) : (
                        <FlatList
                            data={vivaData}
                            keyExtractor={(item) => item.q_id}
                            renderItem={rendervbItem}
                        // style={styles.flatList}
                        />
                    )}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 0, }}>
                    <Text style={styles.textLeft}>Timer:-{formatTime(timer)}</Text>
                </View>
                <View style={styles.containervideos}>
                    {/* Display Local Video Stream */}
                    {localStream && (
                        <RTCView
                            streamURL={localStream.toURL()}
                            style={styles.video}
                            mirror={false}
                        />
                    )}
                </View>

                <CustomeButton
                    textColor={ConfigColor.white}
                    isdisabled={isRunning ? true : false}
                    label={isRunning ? "Recording......" : "Start Recording"}
                    labelStyle={{ fontSize: 14 }}
                    onPress={() => {
                        startRecording()
                    }}
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
        marginTop: 5,
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
        textAlign: 'left',
        marginLeft: 25,
        color: '#000', // White text color
        fontSize: 15,
        fontWeight: 'bold',
    },
    constainer: {
        width: "100%",
        backgroundColor: COLORS.bgBlueColor,
        flex: 1,
    },
    viewMargin: {
        marginTop: 5,
        flexDirection: "row",
        backgroundColor: COLORS.bgBlueColor,
        // justifyContent: 'center', // Centers content vertically
        // alignItems: 'center',
    },

    container: {
        height: 100, // 🔒 Fixed height here
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    index: {
        fontSize: 11,
        // fontWeight: 'bold',
        marginRight: 6,
    },
    text: {
        flex: 1,
        fontSize: 11,
    },
});

export default AssmtRoom;
