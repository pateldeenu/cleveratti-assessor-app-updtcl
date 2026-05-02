import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import normalize from "react-native-normalize";
import { getDate } from "../../utils/Utills";
import { AppConfig } from "../AssessmentDetails/Utils";
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import SimpleToast from "react-native-simple-toast";
import { BackHandler } from 'react-native';
import { Video } from 'react-native-compressor';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuIcon from "../../components/MenuIcon";

const VideoRecordingPractical = ({ navigation, route }) => {
  const {
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
    longitude,
    currentAddress,
    groupType,
    rtcToken,
    optionF,
    atm_quest,
    dataDetails,
    positionvrt,
  } = route.params;
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [compressPath, setCompressPath] = useState("");
  const [buttonTitle, setButtonTitle] = useState('Start Recording');
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [save, setSave] = useState('Save');
  const [progress, setProgress] = useState(0); // Initialize progress as 0
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    requestExternalStoragePermission();
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
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer, isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message: 'App needs access to external storage to save videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log('External storage permission granted');
      } else {
        //console.log('External storage permission denied');
      }
    } catch (error) {
      //console.error('Error requesting external storage permission:', error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      return true; // Block back button
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  const saveBack = async () => {
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
      longitude,
      currentAddress,
      groupType,
      rtcToken,
      atm_quest,
      dataDetails,
      positionvrt,
    });
  }

  const startRecording = async () => {
    setIsRunning(true);
    if (cameraRef.current) {
      setButtonTitle("Recording")
      try {
        const options = {
          maxDuration: 60,
          quality: '4:3', // Adjust quality as needed
        };

        try {
          const { uri } = await cameraRef.current.recordAsync(options);
          const folderPath = 'file://' + RNFS.ExternalDirectoryPath;
          await RNFS.mkdir(folderPath);
          const videoName = `video_${Date.now()}.mp4`;
          const newPath = `${folderPath}/${videoName}`;
          try {
            await RNFS.moveFile(uri, newPath);
            setButtonTitle("Recording Completed");
            stopRecording();
            setIsRunning(false);
            captureVideos(newPath);
          } catch (moveError) {
            // move failed silently
          }
        } catch (recordError) {
          SimpleToast.show(`Camera not running Close Camera & Re-Open`);
        }
      } catch (error) {
        setIsRecording(false);
      }
    }
  };

  const compressVideo = async (uripath) => {
    setIsCompressing(true);
    try {
      const options = {
        width: 720,
        height: 480,
        bitrate: 2000000,
        saveToCameraRoll: true,
        includeAudio: true,
      };

      const result = await Video.compress(
        uripath,
        {
          compressionMethod: 'auto',
        },
        (progress) => {
          setProgress(progress);
        }
      );
      createfolderName(result);
      setIsCompressing(false);
      setIsTaskCompleted(true);
    } catch (error) {
      setLoadingIndicator(false);
    }
  };

  const createfolderName = (compressedUri) => {
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/CompressVideos'; // Specify the target directory 
    moveImageToDirectoryCompVideos(compressedUri, targetDirectory);
  };

  //Save Image timeStamp wise In Internal folder
  const moveImageToDirectoryCompVideos = async (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const fileNametwo = `${batchIdNo}_${getDate()}_${fileName}`;
    const targetFilePath = `${targetDirectory}/${fileNametwo}`;

    if (optionF == 'option1') {
      getCaptureVideosPath(targetFilePath);
    } else {
      getCaptureVideosPathSecond(targetFilePath);
    }

    await RNFS.mkdir(targetDirectory);
    await RNFS.moveFile(filePath, targetFilePath);
    return targetFilePath;
  };

  const getCaptureVideosPath = async (videopath) => {
    await AsyncStorage.setItem('PRACTICAL_VIDEOPATH', videopath);
  }

  const getCaptureVideosPathSecond = async (videopath) => {
    await AsyncStorage.setItem('PRACTICAL_VIDEOPATH_SECOND', videopath);
  }

  const captureVideos = (video_uri) => {
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/AuditVideos'; // Specify the target directory 
    moveImageToDirectoryWithoutCompress(video_uri, targetDirectory);
  };

  //Save Image timeStamp wise In Internal folder
  const moveImageToDirectoryWithoutCompress = async (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    //console.log('Without Compress Videos saved to directory:', targetFilePath);
    try {
      await RNFS.mkdir(targetDirectory);
      try {
        await RNFS.moveFile(filePath, targetFilePath);
        (targetFilePath);
        setTimeout(() => {
          compressVideo(targetFilePath);
        }, 1000);
      } catch (moveError) {
        // move failed silently
      }
    } catch (mkdirError) {
      // mkdir failed silently
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const backWithoutRequired = async () => {
    setIsRunning(false);
    stopRecording();
    navigation.goBack()
  }

  const rendervbItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.index}>{index + 1}.</Text>
      <Text style={styles.text}>{item.quest}</Text>
    </View>
  );

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
          data={vivaData}
           keyExtractor={(item) => item.q_id}
           renderItem={rendervbItem}
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

const BASE_FONT = SCREEN_WIDTH < 360 ? 13 : 15;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.bgBlueColor,
//   },
//   flex1: {
//     flex: 1,
//   },

//   /* Header — top padding clears the status bar on every Android version */
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgBlueColor,
//     paddingTop: STATUS_BAR_HEIGHT + 8,
//     paddingBottom: 10,
//     paddingHorizontal: 8,
//     minHeight: 56 + STATUS_BAR_HEIGHT,
//   },
//   backButton: {
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: normalize(17),
//     color: COLORS.black,
//     ...FONTS.h2,
//   },
//   headerRight: {
//     width: 44,
//   },

//   /* Questions */
//   questionsContainer: {
//     maxHeight: SCREEN_HEIGHT * 0.18,
//     paddingHorizontal: 12,
//     paddingBottom: 6,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     marginBottom: 6,
//     paddingRight: 4,
//   },
//   index: {
//     fontSize: BASE_FONT,
//     marginRight: 6,
//     color: COLORS.black,
//   },
//   text: {
//     flex: 1,
//     fontSize: BASE_FONT,
//     color: COLORS.black,
//     lineHeight: BASE_FONT * 1.4,
//   },

//   /* Camera */
//   cameraContainer: {
//     flex: 1,
//     overflow: 'hidden',
//   },
//   camera: {
//     flex: 1,
//   },

//   /* Bottom card — white surface that holds compress + buttons */
//   bottomCard: {
//     backgroundColor: '#FFFFFF',
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     paddingTop: 10,
//     paddingBottom: Platform.OS === 'ios' ? 20 : 10,
//   },

//   /* Compress progress (inside bottomCard) */
//   progressContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.07)',
//     marginBottom: 6,
//   },
//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   progressLabel: {
//     fontSize: normalize(12),
//     color: '#444',
//     fontWeight: '500',
//   },
//   progressPercent: {
//     fontSize: normalize(12),
//     color: '#2E7D32',
//     fontWeight: '700',
//   },

//   /* Button row */
//   bottomBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingTop: 4,
//   },
//   timerWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 68,
//     marginRight: 8,
//     backgroundColor: '#F0F4FF',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//   },
//   timerLabel: {
//     fontSize: normalize(10),
//     color: '#666',
//     marginBottom: 2,
//   },
//   timerValue: {
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//     color: '#1A237E',
//   },
//   actionButton: {
//     flex: 1,
//     minHeight: 50,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 4,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   saveButton: {
//     backgroundColor: '#2E7D32',
//   },
//   actionButtonPlaceholder: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: normalize(14),
//     textAlign: 'center',
//     letterSpacing: 0.3,
//   },

//   /* legacy — kept to avoid import errors elsewhere */
//   constainer: {
//     width: '100%',
//     backgroundColor: COLORS.bgBlueColor,
//     flex: 1,
//   },
// });

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

export default VideoRecordingPractical;
