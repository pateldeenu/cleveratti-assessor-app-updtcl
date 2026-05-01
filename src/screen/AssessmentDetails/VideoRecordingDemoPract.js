import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import normalize from "react-native-normalize";
import { useDispatch } from "react-redux";
import { AppConfig } from "./Utils";
import { getDate } from "../../utils/Utills";
import { RNCamera } from "react-native-camera";
import RNFS from "react-native-fs";
import SimpleToast from "react-native-simple-toast";
import { Video } from "react-native-compressor";
import ProgressBar from "react-native-progress/Bar";
import MenuIcon from "../../components/MenuIcon";
import {
  setDemoVideoPos,
  setDemoVideoPath,
  setDemoVideoGroup,
} from "../../utils/Utills";
import { getAssessorVivaList } from "../../redux/Actions/AllContentAction";

const VideoRecordingDemoPract = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    dataDetails,
    position,
    batchIdNo,
    batch_id,
    DemoButtonStatus,
    vivaStatus,
    attempt,
    optionF,
    groupPos,
    grpdata,
    type,
  } = route.params;

  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Start Recording");
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [questdt, setquestdt] = useState([]);

  /*-------------------- INIT --------------------*/
  useEffect(() => {
    requestPermission();
    apiquestData();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }

    if (timer === 0 && isRecording) {
      stopRecording();
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (time) => {
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* -------------------- PERMISSION -------------------- */
  const requestPermission = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  };

  const saveBack = async () => {
    console.log("--:call save back --")

    console.log("dataDetails", dataDetails, "| posion -", position, "| batchNo ", batchIdNo, "|batchId ", batch_id, "| DemoButtonStatus ", DemoButtonStatus, "| vivaStatus ", vivaStatus
      , "| attempt ", attempt
    )
    navigation.replace("AssessmentDetailsScreen", {
      dataDetails, position, batchIdNo, batch_id,
      DemoButtonStatus, vivaStatus, attempt,
      returnGroupPos: groupPos,
    });
    // navigation.navigate("AssessmentDetailsScreen", { dataDetails, position, batchIdNo, batch_id, DemoButtonStatus, vivaStatus, attempt });
  }

  /* -------------------- RECORDING -------------------- */
  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setIsRunning(true);
      setTimer(30);
      setButtonTitle("Recording...");

      const { uri } = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      setIsRecording(false);
      setIsRunning(false);
      setButtonTitle("Processing...");

      await handleVideo(uri);
    } catch (err) {
      setIsRecording(false);
      setIsRunning(false);
      SimpleToast.show("Recording failed. Try again.");
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  /* -------------------- VIDEO FLOW -------------------- */
  const handleVideo = async (uri) => {
    try {
      const auditPath = `${RNFS.PicturesDirectoryPath}/Claveratti_S3/AuditVideos`;
      await RNFS.mkdir(auditPath);
      const fileName = `video_${Date.now()}.mp4`;
      const newPath = `${auditPath}/${fileName}`;
      await RNFS.moveFile(uri, newPath);
      await compressVideo(newPath);

    } catch (err) {
      console.log("Video handle error:", err);
    }
  };

  const compressVideo = async (path) => {
    try {

      setIsCompressing(true);

      const result = await Video.compress(
        path,
        { compressionMethod: "auto" },
        (p) => setProgress(p)
      );

      const finalPath = await saveCompressed(result);

      await setDemoVideoPos(AppConfig.DEMOGROUPVDPOS, optionF);
      await setDemoVideoPath(AppConfig.DEMOGROUPVIDEOPATH, finalPath);
      await setDemoVideoGroup(AppConfig.DEMOVIDEOGROUP, groupPos);

      setIsTaskCompleted(true);
    } catch (err) {
      console.log("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const saveCompressed = async (filePath) => {
    const dir = `${RNFS.PicturesDirectoryPath}/Claveratti_S3/CompressVideos`;
    await RNFS.mkdir(dir);

    const name = `${batch_id}_${getDate()}_${filePath.split("/").pop()}`;
    const target = `${dir}/${name}`;

    await RNFS.moveFile(filePath, target);
    return target;
  };

  /* -------------------- API -------------------- */
  const apiquestData = async () => {
    try {
      const assessorId = grpdata?.[0]?._id;
      const assessmentId = dataDetails?.[position]?.assessment_id;

      if (!assessorId || !assessmentId) return;

      const res = await dispatch(
        getAssessorVivaList("demo", assessmentId, assessorId)
      );

      if (res.status === 200) {
        const questions = res?.data?.questions || [];

        const allQuestions = [];

        questions.forEach((q) => {
          const eng = q?.question?.question?.filter(
            (i) => i.lang === "eng"
          );
          if (eng) {
            allQuestions.push(...eng.map((e) => e.content));
          }
        });

        setquestdt(allQuestions);
      } else {
        SimpleToast.show("Failed to load questions");
      }
    } catch {
      SimpleToast.show("Server error");
    }
  };

  /* -------------------- UI -------------------- */
  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.index}>{index + 1}.</Text>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  const backWithoutRequired = async () => {
    setIsRunning(false);
    stopRecording();
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Fixed Header ── */}
      <View style={styles.header}>
        <MenuIcon
          onPress={() => {
            backWithoutRequired()
          }}
          back="back" />
        <Text style={styles.title}>Record Video Offline</Text>
        <View style={styles.headerEnd} />
      </View>

      {/* ── Questions (scrollable, max height so camera still shows) ── */}
      <View style={styles.grpcontainer}>
        <FlatList
          data={questdt}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4 }}
        />
      </View>

      {/* ── Camera fills remaining space ── */}
      <View style={styles.cameraWrapper}>
        <RNCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          type={RNCamera.Constants.Type.back}
          captureAudio
          androidCameraPermissionOptions={{
            title: "Camera Permission",
            message: "App needs access to your camera",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Microphone Permission",
            message: "App needs access to your microphone",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }}
        />
        {isRecording && (
          <View style={styles.recBadge}>
            <View style={styles.recDot} />
            <Text style={styles.recBadgeText}>REC</Text>
          </View>
        )}
      </View>

      {/* ── Bottom panel: compressing OR controls — never overlaps camera ── */}
      <View style={styles.bottomPanel}>

        {isCompressing ? (
          /* Compressing state */
          <View style={styles.compressBox}>
            <Text style={styles.compressLabel}>Compressing video, please wait...</Text>
            <ProgressBar
              progress={progress}
              width={null}
              color="#1565C0"
              borderRadius={6}
              height={normalize(10)}
            />
            <Text style={styles.compressPercent}>{Math.round(progress * 100)}%</Text>
          </View>
        ) : (
          /* Timer + action button row */
          <View style={styles.controlsRow}>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{formatTime(timer)}</Text>
              <Text style={styles.timerLabel}>Timer</Text>
            </View>

            {isTaskCompleted ? (
              <TouchableOpacity style={styles.saveBtn} onPress={saveBack}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, isRecording && styles.actionBtnStop]}
                onPress={() => (isRecording ? stopRecording() : startRecording())}
              >
                <Text style={styles.btnText}>
                  {buttonTitle}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#000",
    backgroundColor: COLORS.bgBlueColor,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgBlueColor,
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(4),
    marginTop: normalize(30),
    minHeight: normalize(48),
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#000",
  },
  headerEnd: {
    width: normalize(40),
  },

  /* Questions */
  grpcontainer: {
    backgroundColor: COLORS.bgBlueColor,
    maxHeight: normalize(140),
    paddingHorizontal: normalize(14),
    paddingTop: normalize(10),
    paddingBottom: normalize(6),
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: normalize(5),
    alignItems: "flex-start",
  },
  index: {
    fontSize: normalize(12),
    fontWeight: "600",
    color: "#1A237E",
    marginRight: normalize(4),
    lineHeight: normalize(18),
  },
  text: {
    flex: 1,
    fontSize: normalize(12),
    color: "#1A1A1A",
    lineHeight: normalize(18),
  },

  /* Camera */
  cameraWrapper: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  recBadge: {
    position: "absolute",
    top: normalize(10),
    right: normalize(10),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
  },
  recDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: "red",
    marginRight: normalize(5),
  },
  recBadgeText: {
    color: "#fff",
    fontSize: normalize(11),
    fontWeight: "bold",
  },

  /* Bottom panel */
  bottomPanel: {
    backgroundColor: COLORS.bgBlueColor,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(12),
    paddingBottom: normalize(30),
    minHeight: normalize(140),
    justifyContent: "center",
  },

  /* Controls row */
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBox: {
    alignItems: "center",
    marginRight: normalize(12),
    minWidth: normalize(56),
  },
  timerValue: {
    fontSize: normalize(22),
    fontWeight: "bold",
    color: "#1A237E",
  },
  timerLabel: {
    fontSize: normalize(10),
    color: "#555",
    marginTop: normalize(1),
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnStop: {
    backgroundColor: "#C62828",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#1565C0",
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: normalize(14),
    fontWeight: "600",
    textAlign: "center",
  },

  /* Compression panel */
  compressBox: {
    paddingHorizontal: normalize(4),
  },
  compressLabel: {
    fontSize: normalize(13),
    color: "#1A1A1A",
    fontWeight: "500",
    marginBottom: normalize(8),
    textAlign: "center",
  },
  compressPercent: {
    fontSize: normalize(12),
    color: "#1565C0",
    textAlign: "right",
    marginTop: normalize(4),
    fontWeight: "600",
  },
});

export default VideoRecordingDemoPract;
