import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import ItemQuestion from "./ItemQuestion";
import { CustomeButton } from "../../components";
import { useDispatch } from "react-redux";
import { getDate } from "../../utils/Utills";
import Loader from "../../components/Loader";
import Example from "../CredentialsAuth/Example";
import {
  updateQuestion_Video,
  db,
  insertImageTable,
} from "../../database/SqlLitedatabase";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import SimpleToast from "react-native-simple-toast";
import { BackHandler } from 'react-native';
import { Video } from 'react-native-compressor';
import ProgressBar from 'react-native-progress/Bar';

const VideoRecording = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { questionId, batch_id, _id, assessment_id } = route.params;
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
        console.log('External storage permission granted');
      } else {
        console.log('External storage permission denied');
      }
    } catch (error) {
      console.error('Error requesting external storage permission:', error);
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

  const OnBackPrees = async () => {
    Alert.alert("Alert!", "Are you Sure you want Back!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "YES",
        onPress: async () => {
          stopRecording();
          saveBack();
        },
      },
    ]);
  };


  const saveBack = async () => {
    //console.log('call on back:');
    navigation.navigate("AuditQuestion", { assessment_id, batch_id, _id })
  }

  const startRecording = async () => {
    setIsRunning(true);

    if (cameraRef.current) {
      setButtonTitle("Recording")

      try {
        const options = {
          // mediaType: "video",
          maxDuration: 60,
          //quality: RNCamera.Constants.VideoQuality['480p'],
          quality: '4:3', // Adjust quality as needed
          //maxFileSize: 80 * 1024 * 1024, // Approximately 100 MB 
        };

        await cameraRef.current.recordAsync(options)
          .then(({ uri }) => {
            const folderPath = 'file://' + RNFS.ExternalDirectoryPath;

            return RNFS.mkdir(folderPath)
              .then(() => {
                const videoName = `video_${Date.now()}.mp4`;
                const newPath = `${folderPath}/${videoName}`;
                return RNFS.moveFile(uri, newPath)
                  .then(() => {
                    setButtonTitle("Recording Completed")
                    //console.log('Video saved:', newPath);
                    stopRecording();
                    setIsRunning(false);
                    captureVideos(newPath)
                    // compressVideo(newPath);
                    // setTimeout(() => {
                    //   console.log('Delayed action executed after 2000 milliseconds');
                    //   compressVideo(newPath);
                    // }, 2000);
                  })
                  .catch(error => {
                    console.error('Error moving video:', error);
                  });
              })
              .then(() => {
                //console.log('Video saved successfully.');
              })
              .catch(error => {
                console.error('Error moving video:', error);
              });
          })
          .catch(error => {
            SimpleToast.show(`Camera not running Close Camera & Re-Open`);
            console.error('Error capturing video:', error);
          })
        // compressVideo(uri);
      } catch (error) {
        console.error("Error starting recording:", error);
        setIsRecording(false);
      }
    }
  };


  const compressVideo = async (uripath) => {
    setIsCompressing(true);
    //Compress the video
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
          // console.log('Compression Progress: ', progress);
        }
      );
      createfolder(result);
      setIsCompressing(false);
      setIsTaskCompleted(true);
    } catch (error) {
      setLoadingIndicator(false);
    }
  };

  const createfolder = (compressedUri) => {
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/CompressVideos'; // Specify the target directory 
    moveImageToDirectoryCompVideos(compressedUri, targetDirectory);

  };

  //Save Image timeStamp wise In Internal folder 
  const moveImageToDirectoryCompVideos = (filePath, targetDirectory) => {

    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const fileNametwo = `${batch_id}_${getDate()}_${fileName}`;
    const targetFilePath = `${targetDirectory}/${fileNametwo}`;
    // console.log('Compress Videos saved to directory:', targetFilePath);

    insertImageTable(questionId, targetFilePath, '', batch_id, 'false', '2');
    updateQuestion_Video(targetFilePath, '2', questionId, batch_id);
    return RNFS.mkdir(targetDirectory)
      .then(() => RNFS.moveFile(filePath, targetFilePath))
      .then(() => targetFilePath);
  };

  const captureVideos = (video_uri) => {
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/AuditVideos'; // Specify the target directory 
    moveImageToDirectoryWithoutCompress(video_uri, targetDirectory);
  };

  //Save Image timeStamp wise In Internal folder 
  const moveImageToDirectoryWithoutCompress = (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    return RNFS.mkdir(targetDirectory)
      .then(() => {
        return RNFS.moveFile(filePath, targetFilePath)
          .then(() => {
            (targetFilePath);
            setTimeout(() => {
              // console.log('Delayed action executed after 2000 milliseconds');
              compressVideo(targetFilePath);
            }, 1000);
          })
          .catch(error => {

          });
      })
      .then(() => {
        // console.log('Video saved successfully.');
      })
      .catch(error => {
      });
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const backWithoutRequired = async () => {
    setIsRunning(false);
    stopRecording();
    navigation.navigate("AuditQuestion", { assessment_id, batch_id, _id })
  }

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <KeyboardAvoidingView style={styles.constainer}>
          <View style={styles.constainer}>
            <Example />
            <View style={styles.viewMargin}>
              <MenuIcon
                onPress={() => {
                  backWithoutRequired()
                }}
                back="back" />
              <Text style={styles.ques}>{"Record  video offline"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <RNCamera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                captureAudio={true}
                flashMode={RNCamera.Constants.FlashMode.auto}
                defaultVideoQuality={RNCamera.Constants.VideoQuality['low']}
                androidCameraPermissionOptions={{
                  title: "Permission to use camera",
                  message: "We need your permission to use your camera",
                  buttonPositive: "Ok",
                  buttonNegative: "Cancel",
                }}
                androidRecordAudioPermissionOptions={{
                  title: "Permission to use audio recording",
                  message: "We need your permission to use your audio",
                  buttonPositive: "Ok",
                  buttonNegative: "Cancel",
                }}

              />

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                {isCompressing ? (

                  <View style={{ width: '80%' }}>
                    <Text style={{ marginBottom: 10, }}>Please wait Compress Capture Video ...</Text>
                    <ProgressBar progress={progress} width={null} />
                    <Text>{Math.round(progress * 100)}%</Text>
                  </View>
                ) : (
                  null
                  // <Button title="Compress Video" onPress={compressVideo} />
                )}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20, }}>

                <Text style={styles.textLeft}>Timer:-{formatTime(timer)}</Text>

                <TouchableOpacity
                  onPress={() => {
                    if (isRecording) {
                      stopRecording();
                      // onClose();
                    } else {
                      startRecording();
                      setIsRecording(true);
                    }
                  }}
                  style={{
                    backgroundColor: isRecording ? 'blue' : 'green',
                    padding: 10,
                    fontSize: 8,
                    borderRadius: 10,
                    flex: 1,
                    margin: 5,
                    justifyContent: 'center',
                    textAlign: 'center',

                  }}>
                  {/* <Text style={{ color: 'white' }}>{isRecording ? 'recording' : 'Start Record'}</Text> */}
                  <Text style={{ color: 'white', textAlign: 'center' }}>{buttonTitle}</Text>
                </TouchableOpacity>

                <View style={{
                  flex: 1,
                  textAlign: 'right',
                }}>

                  {isTaskCompleted ? (
                    <View style={{
                      flex: 1,
                    }}>
                      <TouchableOpacity
                        onPress={saveBack}
                        style={{
                          backgroundColor: 'green',
                          padding: 10,
                          margin: 5,
                          justifyContent: 'center',
                          borderRadius: 10,
                          flex: 1,
                          textAlign: 'right',
                        }}>
                        <Text style={{ color: 'white', textAlign: 'center', }}>{save}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // <Text>Task null</Text>
                    null
                    // <Button title="Complete Task" onPress={completeTask} />
                  )}
                </View>
              </View>
            </View>
            <Loader text={AppConfig.PLEASE_WAIT_COMPRESS + " " + progress} loading={loadingIndicator} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  ques: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },
  viewMargin: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },

  viewStyle: {
    backgroundColor: COLORS.white,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 25,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 40,
  },

  container: {
    height: 45,
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 10,
    paddingHorizontal: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  textLeft: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 5,
  },
  textCenter: {
    flex: 1,
    textAlign: 'center',
  },
  textRight: {
    flex: 1,
    textAlign: 'right',
  },

});

export default VideoRecording;
