import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  PermissionsAndroid,
  BackHandler,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import InfoDialog from "./DialogComponent/InfoDialog";
import dynamicStyles from "./styles";
import { COLORS } from "../../constants/Theme";
import { RNCamera } from "react-native-camera";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { RNS3 } from "react-native-aws3";
import { getLiveStreamingApi, uploadVideoTagApi, postSubmitQuestinApi } from "../../redux/Actions/AllContentAction";
import { AppConfig, ConfigColor } from "./Utils";
import dataDetails from "react-native-simple-toast";
import { timeDateFormate, getData, } from "../../utils/Utills";

import {
  updateCandidateListTable,
  updateDemo,
} from "../../database/SqlLitedatabase";
import JoinChannelVideo from "../LiveStreaming/AgoraVideoCall/AgoraVideoCall";
import VivaLiveStreaming from "./VivaLiveSreaming/VivaLiveStreaming";
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
// import VideoCompressor from 'react-native-video-compressor';
import Example from "../CredentialsAuth/Example";
import SimpleToast from "react-native-simple-toast";
import DialogAttempt from "../CandidateSection/DialogAttempt";
import { Video } from 'react-native-compressor';
// import Compressor from 'react-native-compressor';
import ProgressBar from 'react-native-progress/Bar';

const StartViva = ({ navigation, route }) => {
  const styles = dynamicStyles();

  const {
    data,
    assessment_id,
    vivaData,
    candS3Path,
    idS3Path,
    candWithIdS3Path,
    dataDetailsArr,
    examType,
    latitude,
    longitude,
    currentAddress,
    rtcToken,
  } = route.params;

  const item = {
    id: 1,
    name: data?.name,
    parent: data?.parent_name,
    candId: data?.cand_id,
  };

  const [mesLength, setMesLength] = useState(0);
  const [remarks, setRemarks] = useState("");

  const [uriVideo, setUriVideo] = useState("");

  const [ques, setQues] = useState("");
  const [quesId, setQuesID] = useState(null);
  const [maxMarks, setMaxMarks] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [position, setPosition] = useState(0);
  const [spinnerMarkArr, setSpinnerMarkArr] = useState([]);
  const [compressingProgress, setCompressingProgress] = useState(0);
  const [markValue, setMarkValue] = useState("");
  const [s3VideoUri, setS3VideoUri] = useState("");
  const [isGenderVisible, setIsGenderVisible] = useState(false);

  const camera = useRef(null);
  const [dataArr, setDataArr] = useState([]);
  const [livStreamData, setLiveStreamData] = useState();
  const [ui, setUI] = useState(false);

  const [selectedGender, setSelectedGender] = useState(0);
  const [genderArr, SetGenderArr] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const dispatch = useDispatch();
  const [buttonTitle, setButtonTitle] = useState('Start Recording');
  const [isRunning, setIsRunning] = useState(false);
  const [isProctering, setProctering] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const [latitudes, setLatitude] = useState("");
  const [longitudes, setLongitude] = useState("");
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  // const [currentAddress, setCurrentAddress] = useState("");
  const [tokens, setTokens] = useState();
  const [attemptedQues, setAttemptedQues] = useState(0);
  const [isAttemtDialog, setIsAttemtDialog] = useState(false);
  const [timer, setTimer] = useState(60);//for timing

  const [progress, setProgress] = useState(0); // Initialize progress as 0
  const [isCompressing, setIsCompressing] = useState(false);
  const cameraRef = useRef(null);

  let cancellationVideoId = '';

  // useEffect(() => {
    
  // }, []);

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

  useEffect(async () => {

    requestExternalStoragePermission();

    let token = await getData("token");
    setTokens(token);

    setLatitude(dataLatLong.latitude);
    setLongitude(dataLatLong.longitude);

    var latLong = {
      lat: dataLatLong.latitude,
      lng: dataLatLong.longitude,
    };

    // await Geocoder.geocodePosition(latLong)
    //   .then((res) => {
    //     setCurrentAddress(
    //       res[0].locality + ", " + res[0].adminArea + ", " + res[0].postalCode
    //     );
    //   })
    //   .catch((err) => console.log(err));

    const backAction = () => {
      Alert.alert(AppConfig.ALERT, AppConfig.MESSAGE_EXIT, [
        {
          text: "OKAY",
          onPress: () => null,
          style: "cancel",
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();   
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(AppConfig.ALERT, AppConfig.MESSAGE_EXIT, [
  //       {
  //         text: "OKAY",
  //         onPress: () => null,
  //         style: "cancel",
  //       },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );
  //   return () => backHandler.remove();
  // }, []);

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

    setDataArr(vivaData);
    setQues(vivaData[0]?.quest);
    setQuesID(vivaData[0]?.q_id);
    setPosition(1);
    setMaxMarks(vivaData[0]?.max_mark);
    setRemarks(vivaData[0]?.remarks);
    let spinnerMarks = [];
    for (let index = 1; index <= vivaData[0]?.max_mark; index++) {
      spinnerMarks.push({ item: index + "" });
    }
    setSpinnerMarkArr(spinnerMarks);

    let arr = spinnerMarks.map((item, index) => {
      item.isSelected = false;
      item.marks = index;
      return { ...item };
    });
    SetGenderArr(arr);

  }, [vivaData]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const videoLiveStreaming = () => {
    return VivaLiveStreaming(rtcToken, data?._id);
  };

  //add geotagging on videos
  const GeotaggigOnVideo = async (videopath) => {

    // console.log('--call geotagging function:--', videopath);
    let timeStamp =
      timeDateFormate(new Date()) +
      ", " +
      currentAddress +
      ", Lat & Long - " +
      latitude +
      " & " +
      longitude;

    setIsVideoLoading(true)

    try {
      // console.log('TimeStamp:--', timeStamp);
      // console.log('path:---', videopath);
      // console.log('tokens:--', tokens);

      let dataRes = await uploadVideoTagApi(timeStamp, videopath, tokens);
      setS3VideoUri(dataRes.url);
      console.log('--Geotagging Video Url:--', dataRes.url);
      setIsVideoLoading(false)

    } catch (error) {
      // console.log("videos Error:--", error);
      setIsVideoLoading(false)
    }
  };

  const startRecording = async () => {

    if (buttonTitle === 'Start Recording') {

      setIsRunning(true);

      if (cameraRef.current) {
        setButtonTitle("Recording")

        try {

          const options = {
            // mediaType: "video",
            maxDuration: 60,
            quality: RNCamera.Constants.VideoQuality['480p'],
            //quality: '4:3', // Adjust quality as needed
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
                      setButtonTitle("Complete Recording")
                      console.log('Video saved:', newPath);
                      stopRecording();
                      // setIsTaskCompleted(true)
                      setButtonTitle("Complete Recording")
                      captureVideos(newPath);

                    })
                    .catch(error => {
                      console.error('Error moving video:', error);
                    });
                })
                .then(() => {
                  console.log('Video saved successfully.');
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
    } else {
    }
  };

  const stopRecording = () => {
    if (camera.current) {
      camera.current.stopRecording();
      // console.log('--call stopRecording:');
    }
  };


  const compressVideo = async (uripath) => {
    try {
      console.log('--call compressor function:--', uripath);
      setIsCompressing(true);

      const options = {
        width: 720, // Set your desired width
        height: 480, // Set your desired height
        bitrateMultiplier: 1, // Adjust according to your requirements
      };

      const compressedVideo = await Video.compress(
        uripath,
        options,
        // {
        //   compressionMethod: 'auto',
        // },
        (progress) => {
          // setProgress(progress);
          setProgress(progress);
        });
      console.log('Compressed video path:', compressedVideo);

      // Video.cancelCompression(cancellationVideoId);
      createfolder(compressedVideo);
      //setLoadingIndicator(false);
      setIsCompressing(false);
      setIsTaskCompleted(true);

    } catch (error) {
      console.error('Video compression failed:', error);
    }
  };

  // const compressVideo = async (uripath) => {
  //   console.log('--call compressor function:--', uripath);
  //   setIsCompressing(true);

  //   try {

  //     const result = await Video.compress(
  //       uripath,
  //       {
  //         compressionMethod: 'auto',
  //         getCancellationId: (cancellationId) =>
  //         (cancellationVideoId = cancellationId),
  //       },
  //       (progress) => {
  //         setProgress(progress);
  //         // console.log('Compression Progress: ', progress);
  //       }
  //     );
  //     console.log("compressedUri filePath:--", result);
  //     Video.cancelCompression(cancellationVideoId);
  //     createfolder(result);
  //     //setLoadingIndicator(false);
  //     setIsCompressing(false);
  //     setIsTaskCompleted(true);

  //   } catch (error) {
  //     setLoadingIndicator(false);
  //     console.log("Compress error:--", error);
  //   }
  // };

  const createfolder = (compressedUri) => {
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/PracticalCompressVideos'; // Specify the target directory 
    moveImageToDirectoryCompVideos(compressedUri, targetDirectory);
  };

  //Save Image timeStamp wise In Internal folder 
  const moveImageToDirectoryCompVideos = (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    console.log('Compress Videos saved to directory:', targetFilePath);
    setTimeout(() => {
      console.log('Delayed action executed after 2000 milliseconds');
      GeotaggigOnVideo(targetFilePath);

    }, 1000);
    return RNFS.mkdir(targetDirectory)
      .then(() => RNFS.moveFile(filePath, targetFilePath))
      .then(() => targetFilePath);
  };

  const captureVideos = (video_uri) => {

    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/PracticalVideos'; // Specify the target directory 
    moveImageToDirectoryWithoutCompress(video_uri, targetDirectory);

  };

  //Save Image timeStamp wise In Internal folder 
  const moveImageToDirectoryWithoutCompress = (filePath, targetDirectory) => {

    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;

    console.log('Without Compress Videos saved to directory:', targetFilePath);

    // return RNFS.mkdir(targetDirectory)
    //   .then(() => RNFS.moveFile(filePath, targetFilePath))
    //   .then(() => targetFilePath);

    return RNFS.mkdir(targetDirectory)
      .then(() => {
        return RNFS.moveFile(filePath, targetFilePath)
          .then(() => {

            console.log('After recording Video saved:', targetFilePath);
            (targetFilePath);
            setTimeout(() => {
              console.log('Delayed action executed after 2000 milliseconds');
              // GeotaggigOnVideo(targetFilePath);
              compressVideo(targetFilePath);
            }, 1000);
          })
          .catch(error => {
            console.error('Error moving video:', error);
          });
      })
      .then(() => {
        console.log('Video saved successfully.');
      })
      .catch(error => {
        console.error('Error moving video:', error);
      });
  };

  const submitApi = async (isFlag, dataArr, position) => {

    let dataJson = {};
    if (!isFlag) {
      dataJson = {
        question: quesId,
        answer: selectedGender,
        remark: remarks,
        final_submit: false,
      };
    } else {
      dataJson = {
        question: quesId,
        answer: selectedGender,
        remark: remarks,
        final_submit: isFlag,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: candS3Path,
          adhaar: idS3Path,
          image_with_id: candWithIdS3Path,
          video: s3VideoUri,
          mode: Platform.OS + "",
        },
      };
    }

    // console.log("--dataJson:--", dataJson)

    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, data?._id, dataJson));
    // console.log("--dataRes:--", dataRes.config.data)

    if (dataRes.status == 200) {

      if (isFlag) {

        if (examType == "viva") {
          await updateCandidateListTable(1, data?.cand_id);
        } else {
          await updateDemo(1, data?.cand_id);
        }

        //navigation.navigate("Thankyou", { data: dataDetailsArr, examType });
        // navigation.navigate("AssessmentDetailsScreen", { dataDetails: dataDetailsArr, examType });
        // SimpleToast.show(
        //   "Data Uploaded Successfully"
        // );

        navigation.navigate("TodayAssessment");
        SimpleToast.show(
          "Data Uploaded Successfully"
        );
      } else {
        dataArr[position - 1].isSelected = true;
        dataArr[position - 1].remarks = remarks;
        totalAttepted();
      }
    } else {
    }

  };

  const alertSubmit = () => {
    Alert.alert(
      AppConfig.ALERT,
      `Are you sure you want to submit ${examType}.`,
      [
        {
          text: "NO",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => {
            //submitApi(true);
            if (selectedGender > 0) {
              submitApi(true, dataArr, position);
            } else {
              SimpleToast.show("Select the marks", 0);
            }
          },
        },
      ]
    );
  };

  const nextQues = async () => {

    // const netInfoState = await NetInfo.fetch();
    // if (netInfoState.isConnected) {

    if (dataArr.length - 1 >= position) {
      let spinnerMarks = [];

      for (let index = 1; index <= dataArr[position]?.max_mark; index++) {
        spinnerMarks.push({ item: index + "" });
      }
      setSpinnerMarkArr(spinnerMarks);

      let arr = spinnerMarks.map((item, index) => {
        item.isSelected = false;
        item.marks = index;
        return { ...item };
      });

      SetGenderArr(arr);
      setPosition(position + 1);
      setQuesID(dataArr[position]?.q_id);
      setQues(dataArr[position]?.quest);
      setRemarks(dataArr[position]?.remarks);
      setMesLength(dataArr[position]?.remarks?.length);
      setMaxMarks(dataArr[position]?.max_mark);
      setMarkValue(dataArr[position]?.selected_mark);
      setSelectedGender(dataArr[position]?.selected_mark);

      if (selectedGender > 0) {
        submitApi(false, dataArr, position);
      } else {
        SimpleToast.show("Select the marks", 0);
      }

    } else {

      if (selectedGender > 0) {
        submitApi(false, dataArr, position);
      } else {
        SimpleToast.show("Select the marks", 0);
      }

      totalAttepted();
      setIsAttemtDialog(true);
    }
  };

  const priviousQues = () => {
    if (position > 1)
      if (dataArr.length >= position) {
        let spinnerMarks = [];

        for (let index = 1; index <= dataArr[position - 2]?.max_mark; index++) {
          spinnerMarks.push({ item: index + "" });
        }
        setSpinnerMarkArr(spinnerMarks);

        let arr = spinnerMarks.map((item, index) => {
          item.isSelected = false;
          item.marks = index;
          return { ...item };
        });
        SetGenderArr(arr);
        setPosition(position - 1);
        setQues(dataArr[position - 2]?.quest);
        setMesLength(dataArr[position]?.remarks.length);
        setMaxMarks(dataArr[position - 2]?.max_mark);
        setQuesID(dataArr[position - 2]?.q_id);
        setRemarks(dataArr[position - 2]?.remarks);
        setMarkValue(dataArr[position - 2]?.selected_mark);
        setSelectedGender(dataArr[position - 2]?.selected_mark);
      }
  };

  const nextQuesClickWise = async (position) => {

    if (dataArr.length - 1 >= position) {
      let spinnerMarks = [];

      for (let index = 1; index <= dataArr[position]?.max_mark; index++) {
        spinnerMarks.push({ item: index + "" });
      }
      setSpinnerMarkArr(spinnerMarks);

      let arr = spinnerMarks.map((item, index) => {
        item.isSelected = false;
        item.marks = index;
        return { ...item };
      });

      SetGenderArr(arr);
      setPosition(position + 1);
      setQuesID(dataArr[position]?.q_id);
      setQues(dataArr[position]?.quest);
      setRemarks(dataArr[position]?.remarks);
      setMesLength(dataArr[position]?.remarks?.length);
      setMaxMarks(dataArr[position]?.max_mark);
      setMarkValue(dataArr[position]?.selected_mark);
      setSelectedGender(dataArr[position]?.selected_mark);

    } else {

      totalAttepted();
      setIsAttemtDialog(true);
    }
  };

  const OnClickQuestion = (quest_pos) => {
    setPosition(quest_pos)
    nextQuesClickWise(quest_pos - 1);
    // console.log("----:---", quest_pos);
  }

  const totalAttepted = () => {
    let tot = 0;
    dataArr.map((item) => {
      if (item.isSelected) {
        tot++;
      }
    });
    setAttemptedQues(tot);
  };

  const renderItemMarks = (item, dataArr, position) => {
    return (
      <TouchableOpacity
        style={[styles.viewTouch]}
        onPress={() => selectionGenderHandler(item, dataArr, position)}
      >
        <View
          style={[
            {
              borderColor: ConfigColor.pinkColor,
              backgroundColor: item.item.isSelected
                ? ConfigColor.pinkColor
                : ConfigColor.white,
            },
            styles.selectView,
          ]}
        >
          <Text
            style={[
              styles.selectText,
              {
                fontWeight: item.item.isSelected ? "700" : "400",
                color: item.item.isSelected
                  ? ConfigColor.white
                  : ConfigColor.pinkColor,
              },
            ]}
          >
            {item.item.item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectionGenderHandler = (ind, dataArr, position) => {

    let arr = genderArr.map((item, index) => {

      if (ind.index === index) {
        item.isSelected = true;
        setSelectedGender(item.item);
        dataArr[position - 1].selected_mark = item.item;
        setIsGenderVisible(false);
      } else {
        item.isSelected = false;
      }
      return { ...item };
    });

    setIsGenderVisible(false);
    SetGenderArr(arr);
  };

  const renderItem = (item) => {
    return (

      <TouchableOpacity onPress={() => OnClickQuestion(item.index + 1)}>

        <View
          style={[
            styles.renderView,
            {
              backgroundColor: item.item.isSelected
                ? COLORS.colorGreen
                : "#E5DAF8",
            },
          ]}
        >
          <Text
            style={[
              styles.item,
              { color: item.item.isSelected ? COLORS.white : COLORS.textColors },
            ]}
          >
            {item.index + 1}
          </Text>
        </View>
      </TouchableOpacity>

    );
  };

  const RenderCam = () => {
    return (
      <>
        {/* <RNCamera
          ref={cameraRef}
          // autoFocus
          // useNativeZoom={true}
          // maxZoom={1}
          // zoom={0}
          // VideoCodec={"H264"}
          playSoundOnRecord={false}
          flashMode={RNCamera.Constants.FlashMode.auto}
          // path={`${RNFS.DocumentDirectoryPath}/myVideos/video.mp4`}
          // path={RNCamera.constants.RecordingsDirectoryPath}
          style={[styles.hidenI, { height: uriVideo ? 0 : normalize(70) }]}
          // defaultVideoQuality={RNCamera.Constants.VideoQuality["4:3"]}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['low']}
          type={RNCamera.Constants.Type.back}
          //  flashMode={RNCamera.Constants.FlashMode.on}
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
        /> */}

        <RNCamera
          ref={cameraRef}
          // style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          captureAudio={true}
          // playSoundOnRecord={false}
          flashMode={RNCamera.Constants.FlashMode.auto}
          // path={`${RNFS.DocumentDirectoryPath}/myVideos/video.mp4`}
          // defaultVideoQuality={RNCamera.Constants.VideoQuality["4:3"]}
          style={[styles.hidenI, { height: uriVideo ? 0 : normalize(70) }]}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['low']}
          // type={RNCamera.Constants.Type.back}
          // quality={RNCamera.Constants.VideoQuality['320p']}
          // maxFileSize={20 * 1024 * 1024}
          // quality={RNCamera.Constants.VideoQuality['1080p']}
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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 25, }}>
          <Text style={stylesd.timerText}>Timer:-{formatTime(timer)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={stylesd.containers}>

            <View style={stylesd.containers}>

              {/* <Image 
            style={[stylesd.videoeHeights]}
            source={DynamicImage.VideoIconShow} /> */}

              {isTaskCompleted && (
                <Image
                  style={[stylesd.videoeHeights]}
                  source={DynamicImage.VideoIconShow} />
              )}

              {isVideoLoading ? (
                <>
                  <ActivityIndicator size={"small"} color={COLORS.orange} />
                  <Text style={[stylesd.remarks, { marginTop: 5, marginLeft: 2 }]}>
                    {"Video uploading On S3..."}
                  </Text>
                </>
              ) : null}

            </View>

            {/* <TouchableOpacity style={stylesd.button_f} onPress={startRecording}>
              <Text style={styles.buttonText}>{buttonTitle}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={stylesd.button} onPress={startRecording}>
              <Text style={styles.buttonText}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <Example />

          <View style={styles.secView}>
            <Text style={[styles.head, styles.had]}>
              {examType == "viva" ? "VIVA" : "DEMO"}
            </Text>
          </View>

          <ScrollView
            scrollEnabled={true}
            vertical={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.viewStyle}>
              <View style={styles.dir}>
                <Text style={[styles.head]}>{`${position}.`} </Text>
                <Text style={[styles.QUES]}>{ques}</Text>
              </View>

              <View style={[styles.largeInputContainer]}>
                <TextInput
                  style={[styles.innerTextInput]}
                  multiline={true}
                  editable={true}
                  onChangeText={(text) => {
                    setRemarks(text);
                    setMesLength(text.length);
                  }}
                  defaultValue={remarks}
                  maxLength={200}
                  placeholder="Enter assessor remarks here ..."
                />
                {mesLength > 0 ? (
                  <Text style={styles.lenMess}>({mesLength}/200)</Text>
                ) : null}
              </View>

              {/* {!uriVideo && (
                <Text style={[styles.QUES, styles.Ques2]}>
                  {"00:" + seconds}
                </Text>
              )} */}
              {uriVideo ? (
                <Image
                  resizeMode="cover"
                  style={styles.videoIma}
                  source={DynamicImage.VideoIconShow}
                />
              ) : null}
              {/* {RenderCam()} */}

              {isProctering ? (
                RenderCam()
              ) : (
                videoLiveStreaming()
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>

                {isCompressing ? (
                  <View style={{ width: '80%' }}>
                    <Text style={{ marginBottom: 5, fontSize: 12 }}>Please wait Compress Capture Video ....</Text>
                    <ProgressBar progress={progress} width={null} />
                    <Text>{Math.round(progress * 100)}%</Text>
                  </View>
                ) : (
                  null
                  // <Button title="Compress Video" onPress={compressVideo} />
                )}

              </View>

              {/* <View style={{top:-30}}> */}

              {/* <View style ={{flexDirection:'row', height:100}}> */}

              {/* {  videoLiveStreaming()} */}

              {/* {videoLiveStreaming()} */}
              {/* </View> */}


              {/* </View> */}

              {compressingProgress > 0 && (
                <View style={{ alignSelf: "center" }}>
                  <Text style={[styles.QUES]}>
                    {"   "} video Compressing...{" "}
                    {Math.round(compressingProgress * 100) + "%"}
                  </Text>

                  <Progress.Bar progress={compressingProgress} width={240} />
                </View>
              )}

              <View style={styles.btn}>
                <Text style={styles.mark}>{`Mark Up To : ${maxMarks}`}</Text>

                <TouchableOpacity
                  style={styles.marks}
                  activeOpacity={0.8}
                  onPress={() => setIsGenderVisible(true)}
                >
                  <Text style={styles.genV}>
                    {selectedGender ? selectedGender : "  Select marks  ▽"}
                  </Text>
                </TouchableOpacity>
                <Modal
                  transparent={true}
                  visible={isGenderVisible}
                  onRequestClose={() => {
                    setIsGenderVisible(false);
                  }}
                >
                  <View
                    underlayColor={"rgba(0,0,0,0.8)"}
                    style={[styles.modalBg]}
                  >
                    <View style={[styles.viewTrans, { height: "75%" }]}>
                      <Text style={styles.selectGender}>
                        {"Select your Marks"}
                      </Text>
                      <View style={styles.line} />

                      <FlatList
                        contentContainerStyle={styles.flatGen}
                        nestedScrollEnabled={true}
                        data={genderArr}
                        numColumns={1}
                        keyExtractor={(i, index) => String(index)}
                        renderItem={(item) => renderItemMarks(item, dataArr, position)}
                      />
                    </View>
                  </View>
                </Modal>
              </View>

              <View style={styles.rowVi}>
                <View style={[styles.nextView, { marginLeft: 10 }]}>
                  <TouchableOpacity onPress={priviousQues}>
                    <Text style={[styles.next]}>{"Previous"}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.nextView,
                    {
                      backgroundColor:
                        dataArr.length - 1 >= position
                          ? COLORS.colorGreen
                          : "red",
                    },
                  ]}
                >
                  <TouchableOpacity onPress={nextQues}>
                    <Text style={styles.next}>
                      {dataArr.length - 1 >= position
                        ? "Save & Next"
                        : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => setIsInfoVisible(true)}>
                <Text style={styles.ViewDesign}>{"View"}</Text>
              </TouchableOpacity>

              <View style={styles.flat}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={dataArr}
                  numColumns={6}
                  keyExtractor={(i, index) => String(index)}
                  renderItem={(item) => renderItem(item)}
                />
              </View>
            </View>
          </ScrollView>
          <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} />

          <InfoDialog
            item={item}
            dialogVisible={isInfoVisible}
            onPress={() => {
              setIsInfoVisible(false);
            }}
          />
          <DialogAttempt
            total={dataArr.length}
            attemptedQues={attemptedQues}
            dialogVisible={isAttemtDialog}
            onPress={() => {
              alertSubmit();
              setIsAttemtDialog(false);
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default StartViva;
const stylesd = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: "#009de0",
    padding: 5,
    borderRadius: 5,
    marginRight: 2,
    justifyContent: 'flex-end'
  },
  button_f: {
    backgroundColor: "#009de0",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 20,
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  containers: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  remarks: {
    fontWeight: "500",
    fontSize: normalize(13),
    color: COLORS.blueDark,
    marginLeft: normalize(30),
    fontFamily: "Lato-Medium",
    marginTop: normalize(10),
  },
  videoeHeights: {
    width: normalize(40),
    height: normalize(40),
    marginRight: 15,
    marginHorizontal: normalize(1),
    borderColor: COLORS.blue,
  },

});