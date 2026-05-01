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
  BackHandler,
  PermissionsAndroid,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import VivaLiveStreaming from "./VivaLiveSreaming/VivaLiveStreaming";
import {
  db,
  updateDemo,
  updateCandidateListTable,
} from "../../database/SqlLitedatabase";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import SimpleToast from "react-native-simple-toast";
import dynamicStyles from "./styles";
import DialogAttempt from "../CandidateSection/DialogAttempt";
import { useDispatch, useSelector } from "react-redux";
import InfoDialog from "./DialogComponent/InfoDialog";
import DynamicImage from "../../constants/DynamicImage";
import { uploadVideoTagApi, postSubmitQuestinApi } from "../../redux/Actions/AllContentAction";
import { timeDateFormate, getData, } from "../../utils/Utills";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useFocusEffect, CommonActions } from '@react-navigation/native';

const StartVivaVideoRecording = ({ navigation, route }) => {
  const {
    data,
    assessment_id,
    vivaData,
    candS3Path,
    idS3Path,
    candWithIdS3Path,
    dataDetails,
    dataDetailsArr,
    examType,
    batchIdNo,
    latitude,
    longitude,
    currentAddress,
    rtcToken,
    groupType,
    atm_quest,
    positionvrt
  } = route.params;

  const item = {
    id: 1,
    name: data?.name,
    parent: data?.parent_name,
    candId: data?.cand_id,
  };

  const styles = dynamicStyles();
  const dispatch = useDispatch();
  const [mesLength, setMesLength] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [uriVideo, setUriVideo] = useState("");
  const [ques, setQues] = useState("");
  const [vrecord, setVRecord] = useState("");
  const [quesId, setQuesID] = useState(null);
  const [maxMarks, setMaxMarks] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [position, setPosition] = useState(0);
  const [spinnerMarkArr, setSpinnerMarkArr] = useState([]);
  const [compressingProgress, setCompressingProgress] = useState(0);
  const [markValue, setMarkValue] = useState("");
  const [s3VideoUri, setS3VideoUri] = useState("");
  const [s3VideoUriSecond, setS3VideoUriSecond] = useState("");
  const [isGenderVisible, setIsGenderVisible] = useState(false);
  const camera = useRef(null);
  const [dataArr, setDataArr] = useState([]);
  const [livStreamData, setLiveStreamData] = useState();
  const [ui, setUI] = useState(false);
  const [selectedGender, setSelectedGender] = useState(0);
  const [genderArr, SetGenderArr] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Capture First Video');
  const [buttonTitleS, setButtonTitleS] = useState('Capture Second Video');;
  const [isProctering, setProctering] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVideoSecondLoading, setIsVideoSecondLoading] = useState(false);
  const [isUploadingS3, setIsUploadingS3] = useState(false);
  const [isUploadingSecondS3, setIsUploadingSecondS3] = useState(false);
  const [buttonTitleS3, setButtonTitleS3] = useState('Upload On S3');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isTaskCompletedSecond, setIsTaskCompletedSecond] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [latitudes, setLatitude] = useState("");
  const [longitudes, setLongitude] = useState("");
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [tokens, setTokens] = useState();
  const [attemptedQues, setAttemptedQues] = useState(0);
  const [isAttemtDialog, setIsAttemtDialog] = useState(false);
  const [optionF, setOptionF] = useState('option1');
  const [optionS, setOptionS] = useState('option2');
  const isFocused = useIsFocused();
  const [on_off_linemode, setOnOff_lineMode] = useState();
  const [dateTime, setDt] = useState(new Date().toLocaleString());

  useEffect(() => {
    const init = async () => {
      if (isFocused) {
        await getVideoRcordingPath();
        await getVideoRcordingPathSecond();
      }
      let on_off_mode = await getData(AppConfig.OnOffMode);
      setOnOff_lineMode(on_off_mode === null ? 'true' : on_off_mode);
      setVRecord(vivaData[positionvrt]?.vdrecord);
    };
    init();
  }, [isFocused]);


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
    const init = async () => {
      await requestExternalStoragePermission();
      let token = await getData("token");
      setTokens(token);
      setLatitude(dataLatLong.latitude);
      setLongitude(dataLatLong.longitude);
    };
    init();
  }, []);

  

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!isExamSubmitted) {
          return true; // block back only when exam is not submitted
        }
        return false; // allow back when exam is submitted
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [isExamSubmitted])
  );

  useEffect(() => {
    setDataArr(vivaData);
    setQues(vivaData[0]?.quest);
    setVRecord(vivaData[0]?.vdrecord)
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
  }, []);

  const videoLiveStreaming = () => {
    return VivaLiveStreaming(rtcToken, data?._id);
  };

  //add geotagging on videos
  const GeotaggigOnVideo = async (videopath, option) => {
    let timeStamp =
      timeDateFormate(new Date()) +
      ", " +
      currentAddress +
      ", Lat & Long - " +
      latitude +
      " & " +
      longitude;

    try {
      switch (option) {
        case 'option1':
          setIsTaskCompleted(true);
          setIsVideoLoading(true)
          break;
        case 'option2':
          setIsTaskCompletedSecond(true);
          setIsVideoSecondLoading(true);
          break;
        default:
      }

      let dataRes = await uploadVideoTagApi(timeStamp, examType, batchIdNo, data?._id, quesId, videopath, tokens);
      console.log('--Geotagging Video Url:--', dataRes.url);

      if (dataRes.url === undefined) {
        switch (option) {
          case 'option1':
            setButtonTitle("Capture First Video");
            setS3VideoUri("");
            setIsUploadingS3(true);
            setIsTaskCompleted(false)
            setIsVideoLoading(false)
            break;
          case 'option2':
            setButtonTitleS("Capture Second Video");
            setS3VideoUriSecond("");
            setIsUploadingSecondS3(true);
            setIsTaskCompletedSecond(false)
            setIsVideoSecondLoading(false);
            break;
          default:
        }
        SimpleToast.show(
          "Please check Internet Connection."
        );

      } else {
        switch (option) {
          case 'option1':
            setS3VideoUri(dataRes.url);
            setButtonTitle("First Video Captured");
            setIsUploadingS3(false);
            setIsVideoLoading(false)
            break;
          case 'option2':
            setS3VideoUriSecond(dataRes.url);
            setButtonTitleS("Second Video Captured");
            setIsUploadingSecondS3(false);
            setIsVideoSecondLoading(false);
            break;
          default:
        }
      }

    } catch (error) {
      // console.log("videos Error:--", error);
      switch (option) {
        case 'option1':
          setButtonTitle("Capture First Video");
          setS3VideoUri("");
          setIsUploadingS3(true);
          setIsTaskCompleted(false)
          setIsVideoLoading(true)
          break;
        case 'option2':
          setButtonTitleS("Capture Second Video");
          setS3VideoUriSecond("");
          setIsUploadingSecondS3(true);
          setIsTaskCompletedSecond(false)
          setIsVideoSecondLoading(false);
          break;
        default:
      }
      SimpleToast.show(
        "Please check Internet Connection or Network request failed."
      );
    }
  };

  //For First Video Upload on S3 Exicution
  const getVideoRcordingPath = async () => {
    try {
      const practical_videopath = await AsyncStorage.getItem('PRACTICAL_VIDEOPATH');
      if (practical_videopath !== null) {
        setTimeout(() => {
          if (s3VideoUri == "") {
            GeotaggigOnVideo(practical_videopath, 'option1');
          } else {
          }
        }, 1000);
      } else {
        setS3VideoUri("");
      }
    } catch (error) {
      // console.log('Error loading counter from AsyncStorage:', error);
    }
  }

  //For Second Video Upload on S3 Exicution
  const getVideoRcordingPathSecond = async () => {
    try {
      const practical_videopath_second = await AsyncStorage.getItem('PRACTICAL_VIDEOPATH_SECOND');
      if (practical_videopath_second !== null) {
        setTimeout(() => {
          if (s3VideoUriSecond == "") {
            GeotaggigOnVideo(practical_videopath_second, 'option2');
          } else {
          }
        }, 1000);
      } else {
        setS3VideoUriSecond("");
      }
    } catch (error) {
      // console.log('Error loading counter from AsyncStorage:', error);
    }
  }

  const UploadCompressVideoS3 = async () => {
    getVideoRcordingPath();
  };

  const UploadCompressVideoSecondS3 = async () => {
    getVideoRcordingPathSecond();
  };

  const CaptureVideoF = async () => {
    if (buttonTitle == 'Capture First Video') {
      if (on_off_linemode === 'true') {  // ✅ Correct comparison
        const roomId = dataDetails?.btch_id + "_" + data?._id + "_" + quesId;
        let type = examType;
        const isGroup = false;
        const stmode = "2";
        const copiedvivaData = JSON.parse(JSON.stringify(vivaData));
        const positionvrt = position - 1;//for capture videos question wise show
        navigation.navigate("AssmtRoom", {
          stmode, data, assessment_id, vivaData, copiedvivaData, quesId, positionvrt, candS3Path, idS3Path, candWithIdS3Path, dataDetailsArr, examType, batchIdNo,
          rtcToken, optionF, atm_quest, dataDetails, roomId, latitude, longitude, currentAddress, dateTime, type, isGroup
        })
      } else {
        navigation.navigate("VideoRecordingPractical", {
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
          rtcToken,
          optionF,
          atm_quest,
          dataDetails,
        });

      }

    } else {
      SimpleToast.show(`Video Captured.`);
    }
  };

  const submitApi = async (isFlag, dataArr, position) => {
    let dataJson = {};

    examType == "viva" ?
      (!isFlag ?
        dataJson = {
          question: quesId,
          answer: selectedGender,
          remark: remarks,
          final_submit: false,
        }
        :
        dataJson = {
          question: quesId,
          answer: selectedGender,
          remark: remarks,
          final_submit: isFlag,
          user_data: {
            location: `{lat:${latitudes}, lng:${longitudes}}`,
            image: candS3Path,
            adhaar: idS3Path,
            image_with_id: candWithIdS3Path,
            video: [s3VideoUri, s3VideoUriSecond],
            mode: Platform.OS + "",
          },
        }
      )
      :
      (examType == "demo" ?
        (!isFlag ?
          dataJson = {
            question: quesId,
            answer: selectedGender,
            remark: remarks,
            final_submit: false,
          }
          :
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
              video: [s3VideoUri, s3VideoUriSecond],
              mode: Platform.OS + "",
            },
          }
        )
        :
        (!isFlag ?
          dataJson = {
            nos: quesId,
            marks: selectedGender,
            final_submit: false,
          }
          :
          dataJson = {
            nos: quesId,
            marks: selectedGender,
            final_submit: isFlag,
            user_data: {
              location: `{lat:${latitude}, lng:${longitude}}`,
              image: candS3Path,
              adhaar: idS3Path,
              image_with_id: candWithIdS3Path,
              video: [s3VideoUri, s3VideoUriSecond],
              mode: Platform.OS + "",
            },
          }
        )
      );

    console.log("--:dataJson --", dataJson)
    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, data?._id, dataJson));
    console.log("--:dataRes config data--", dataRes?.config?.data)

    if (dataRes.status == 200) {

      if (isFlag) {
        // if (examType == "viva") {
        //   await updateCandidateListTable(1, data?.cand_id);
        // } else {
        //   await updateDemo(1, data?.cand_id);
        // }

        setIsExamSubmitted(true);

        // Pop to top to remove this screen from stack, then navigate to TodayAssessment
        navigation.popToTop();
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
            if (atm_quest > 0) {
              switch (examType) {
                case 'demo':
                  submitApi(true, dataArr, position);
                  break;
                case 'viva':
                  submitApi(true, dataArr, position);
                  break;
                case 'ojt':
                  submitApi(true, dataArr, position);
                  break;
                default:
              }

            } else {
              if (selectedGender > 0) {
                switch (examType) {
                  case 'demo':
                    submitApi(true, dataArr, position);
                    break;
                  case 'viva':
                    submitApi(true, dataArr, position);
                    break;
                  case 'ojt':
                    submitApi(true, dataArr, position);
                    break;
                  default:
                }
              } else {
                SimpleToast.show("Select the marks", 0);
              }
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

      setMaxMarks(dataArr[position]?.max_mark);
      setMarkValue(dataArr[position]?.selected_mark);
      setSelectedGender(dataArr[position]?.selected_mark);

      if (selectedGender > 0) {
        submitApi(false, dataArr, position);
      } else {
        SimpleToast.show("Please select marks before proceeding", 0);
        //SimpleToast.show("Select the marksks marks marks mar", 0);
        return;
      }

      SetGenderArr(arr);
      setPosition(position + 1);
      setQuesID(dataArr[position]?.q_id);
      setVRecord(vivaData[position]?.vdrecord)
      setQues(dataArr[position]?.quest);
      setRemarks(dataArr[position]?.remarks);
      setMesLength(dataArr[position]?.remarks?.length);

      atm_quest > 0
        ? (atm_quest == attemptedQues ?
          setIsAttemtDialog(true)
          :
          setIsAttemtDialog(false)
        )
        : (
          setIsAttemtDialog(false)
        );

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
        setVRecord(vivaData[position - 2]?.vdrecord)
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
      setVRecord(vivaData[position]?.vdrecord)
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
        <View style={{ flex: 1, alignItems: 'center', }}>
          <View style={{ alignSelf: "flex-end", padding: 5, marginEnd: 10 }}>
            {examType == "demo" ?
              <Text>Note:- Capture video not mandatory.</Text>
              :
              null
            }
          </View>
        </View>

        {/*--:capture video--*/}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>

          {on_off_linemode === 'true' ?
            <View style={stylesd.containers}>

              <View style={stylesd.containers}>
                {vrecord === '1' && (
                  <Image
                    style={[stylesd.videoeHeights]}
                    source={DynamicImage.VideoIconShow} />
                )}
              </View>
              <TouchableOpacity style={stylesd.button} onPress={CaptureVideoF}>
                <Text style={styles.buttonText}>{'Capture Video'}</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={stylesd.containers}>
              <View style={stylesd.containers}>
                {isTaskCompleted && (
                  <Image
                    style={[stylesd.videoeHeights]}
                    source={DynamicImage.VideoIconShow} />
                )}
              </View>

              <TouchableOpacity style={stylesd.button} onPress={CaptureVideoF}>
                <Text style={styles.buttonText}>{buttonTitle}</Text>
              </TouchableOpacity>

              {isUploadingS3 ? (
                <>
                  <TouchableOpacity style={stylesd.button} onPress={UploadCompressVideoS3}>
                    <Text style={styles.buttonText}>{buttonTitleS3}</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>

          }

        </View>

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          {isVideoLoading ? (
            <>
              <ActivityIndicator size={"small"} color={COLORS.orange} marginLeft={30} />
              <Text style={[stylesd.remarkss3, { marginTop: 5, }]}>
                {"First Video uploading On S3..."}
              </Text>
            </>
          ) : null}
        </View> */}

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={stylesd.containers}>

            <View style={stylesd.containers}>
              {isTaskCompletedSecond && (
                <Image
                  style={[stylesd.videoeHeights]}
                  source={DynamicImage.VideoIconShow} />
              )}
            </View>

            <TouchableOpacity style={stylesd.button} onPress={CaptureVideoS}>
              <Text style={styles.buttonText}>{buttonTitleS}</Text>
            </TouchableOpacity>

            {isUploadingSecondS3 ? (
              <>
                <TouchableOpacity style={stylesd.button} onPress={UploadCompressVideoSecondS3}>
                  <Text style={styles.buttonText}>{buttonTitleS3}</Text>
                </TouchableOpacity>
              </>
            ) : null}

          </View>

        </View> */}
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>

          <View style={styles.secView}>
            <Text style={[styles.head, styles.had]}>
              {examType == "viva" ? "VIVA" : (examType == "demo" ? "PRACTICAL" : "OJT")}
            </Text>
          </View>
          <View style={[{ flexDirection: "column" }]}>
            <Text style={[styles.tophdcont]}>{"Batch_Id Name:- "}{dataDetails?.batch_id}</Text>
            <Text style={[styles.tophdcont]}>{"Candidate Name:- "}{data?.name}</Text>
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

              <View>
                {examType == "ojt" ? (
                  null
                ) : (
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
                )}

              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}></View>
              {uriVideo ? (
                <Image
                  resizeMode="cover"
                  style={styles.videoIma}
                  source={DynamicImage.VideoIconShow}
                />
              ) : null}
              {/* {RenderCam()} */}
              {isProctering ? (
                // RenderCam()
                <View>
                  {groupType != 'Group' ? (
                    examType == "ojt" ? (
                      null
                    ) : (
                      RenderCam()
                      //null
                    )
                  ) : (
                    null
                  )}
                </View>
                // null
              ) : (
                videoLiveStreaming()
              )}

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
                <Text style={styles.mark}>{`Marks Up To : ${maxMarks}`}</Text>

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

                  <TouchableOpacity
                    style={{ padding: 3 }}
                    activeOpacity={0.6}
                    onPress={priviousQues}
                  >
                    <Text style={[styles.next]}>{"Previous"}</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.nextView,
                    {
                      //backgroundColor:dataArr.length - 1 >= position ? COLORS.colorGreen : "red",    
                      backgroundColor:
                        (atm_quest != 0 ? (
                          atm_quest >= attemptedQues + 1 ? COLORS.colorGreen : "red"
                        ) : (
                          dataArr.length - 1 >= position ? COLORS.colorGreen : "red"
                        ))
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{ padding: 3 }}
                    activeOpacity={0.6}
                    onPress={nextQues}
                  >
                    <Text style={styles.next}>
                      {/* {dataArr.length - 1 >= position ? "Save & Next" : "Submit"}  */}

                      {atm_quest != 0 ? (
                        atm_quest == attemptedQues
                          ? "Submit"
                          : (dataArr.length - 1 >= position
                            ?
                            "Save & Next"
                            :
                            "Submit")
                      ) : (
                        dataArr.length - 1 >= position ? "Save & Next" : "Submit"
                      )}

                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => setIsInfoVisible(true)}>
                <Text style={styles.ViewDesign}>{"View Candidate Detail"}</Text>
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
          {/* <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} /> */}

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
    margin: 5,
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

  remarkss3: {
    fontWeight: "500",
    fontSize: normalize(13),
    color: COLORS.blueDark,
    marginLeft: normalize(10),
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

export default StartVivaVideoRecording;
