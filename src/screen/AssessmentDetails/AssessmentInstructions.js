import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { COLORS } from "../../constants/Theme";
import { RNS3 } from "react-native-aws3";
import { CustomeButton } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import CheckBox from "@react-native-community/checkbox";
import CameraIcon from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";
import ApiUrl from "../../utils/UrlConfig";
import ImageTimeStamp from "../CandidateSection/ImageTimeStamp";
import { deleteDataGroup, getDate } from "../../utils/Utills";
import uuid from "react-native-uuid";
import CameraRoll from "@react-native-camera-roll/camera-roll";
import {
  getAssessorVivaList,
  getLiveStreamingApi,
} from "../../redux/Actions/AllContentAction";
import { useDispatch, useSelector } from "react-redux";
import RNFS from "react-native-fs";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { getLocation } from "../../utils/helper";
import {
  createAssessQuestionTable,
  db,
  insertAssessQuestionTableTable,
  deleteVivaDemoQuestion,
} from "../../database/SqlLitedatabase";
import { AppConfig, ConfigColor } from "./Utils";
import DynamicImage from "../../constants/DynamicImage";
import NetInfo from "@react-native-community/netinfo";
import SimpleToast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';


export const requestLocationPermissionOnAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Alert",
        message:
          "Turning on location services allows us to show your distance from other users when browsing matches, and allows other users to see their distance from you.",
        buttonPositive: "OKAY",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    throw error;
  }
};

export const requestLocationPermissionOnIOS = async () => {
  try {
    // Using react-native-permissions recommended approach:
    const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return res === RESULTS.GRANTED;
  } catch (error) {
    throw error;
  }
};

export const enableGPSOnAndroid = async () => {
  try {
    const response = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    });
    return response === "already-enabled" || response === "enabled";
  } catch (error) {
    return false;
  }
};

const AssessmentInstructions = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  // route params (defensive)
  const {
    dataDetails = {},
    data = {},
    dataDetailsArr = [],
    examType = "",
    groupType = "",
  } = route?.params || {};

  const [canImage, setCanImage] = useState(ApiUrl.defaultImageUrl);
  const [canIDImage, setCanIdImage] = useState(
    "https://s3.ap-southeast-1.amazonaws.com/images.asianage.com/images/aa-Cover-vhobga052m2s92bvuc37ca5556-20170807014459.jpeg"
  );
  const [canWithIdImage, setCanWithIdImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkXFWVobzyoZXD9_DQHk6y01cbi185bwSwNKHUbZUY9rkuLIlPLG0EmoBkhMR_EOXzQRM&usqp=CAU"
  );

  const [isPhotoViewerVisibleScreenShot, setIsPhotoViewerVisibleScreenShot] = useState(false);
  const [cameraPos, setCameraPos] = useState(0);
  const [isInstructionSelected, setInstructionSelected] = useState(false);
  const [dataArr, setDataArr] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [candS3Path, setCandS3Path] = useState("");
  const [idS3Path, setIdS3Path] = useState("");
  const [candWithIdS3Path, setCandWITHIDS3Path] = useState("");
  const [isRubric, setIsRubric] = useState("");
  const [atm_quest, setAtm_Quest] = useState(0);
  const [currentAddress, setCurrentAddress] = useState("");
  const [orientation, setOrientation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  // safe mount/unmount handling
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // for location
  const fetchLocation = async () => {
    try {
      setLocationLoading(true);
      const { result } = await getLocation();
      const addressComponents = result?.address_components || [];
      console.log("addressComponents instruction:---", addressComponents);
      const getComponent = type =>
        addressComponents.find(component => component.types.includes(type))
          ?.long_name || '';
      let fullLocation = `${getComponent('sublocality_level_2') &&
        getComponent('sublocality_level_2') + ','
        } ${getComponent('sublocality_level_3') &&
        getComponent('sublocality_level_3') + ','
        } ${getComponent('administrative_area_level_3') &&
        getComponent('administrative_area_level_3') + ','
        } ${getComponent('administrative_area_level_1') &&
        getComponent('administrative_area_level_1') + ','
        } ${getComponent('country') && getComponent('country') + ','
        } ${getComponent('postal_code')}`;

      setCurrentAddress(fullLocation.trim());
      setLatitude(result?.geometry?.location?.lat);
      setLongitude(result?.geometry?.location?.lng);
      setLocationLoading(false);

      console.log("--:Latitude instruction--", result?.geometry?.location?.lat)
      console.log("--:Longitude instruction--", result?.geometry?.location?.lng)
      console.log("--:Current Address instruction--", fullLocation.trim())

    } catch (error) {
      //console.log("Error fetching location", error);
      setLocationLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; // in case component unmounts during async work
      const loadLocation = async () => {
        try {
          await fetchLocation();
        } catch (err) {
          console.log("Error in useFocusEffect fetchLocation:", err);
        }
      };

      if (isActive) {
        loadLocation();
      }

      return () => {
        isActive = false; // cleanup
      };
    }, []),
  );

  // on mount: clear local questions and call apiData + cleanup demo video paths
  useEffect(() => {
    const init = async () => {
      try {
        setLoadingIndicator(true);
        await deleteVivaDemoQuestion();
        await apiData();
        await deleteDemoVideosPath();
      } catch (err) {
        // console.log(err);
      } finally {
        if (isMountedRef.current) setLoadingIndicator(false);
      }
    };
    init();
    // no cleanup necessary here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch questions from sqlite table (if exist)
  const fetchAssessQuestionTable = async () => {
    try {
      setLoadingIndicator(true);
      await createAssessQuestionTable();
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM assess_question_table",
          [],
          (tx, results) => {
            const tmp = [];
            for (let i = 0; i < results.rows.length; ++i) tmp.push(results.rows.item(i));
            if (tmp.length > 0) {
              if (isMountedRef.current) {
                setDataArr(tmp);
                setLoadingIndicator(false);
              }
            } else {
              // no local questions, fetch from server
              apiData().catch(() => { });
            }
          },
          (tx, error) => {
            console.error("SQL Error (fetchAssessQuestionTable):", error);
            if (isMountedRef.current) setLoadingIndicator(false);
          }
        );
      });
    } catch (err) {
      console.error("fetchAssessQuestionTable error:", err);
      if (isMountedRef.current) setLoadingIndicator(false);
    }
  };

  // main API call to get viva questions
  const apiData = async () => {
    setLoadingIndicator(true);
    try {
      const dataRes = await dispatch(
        getAssessorVivaList(examType, dataDetails?.assessment_id, data?._id)
      );

      if (dataRes?.status === 200) {
        const payload = dataRes?.data || {};

        if (payload?.demoRQC !== undefined) {
          setAtm_Quest(payload.demoRQC);
        }

        if (payload.questions && payload.questions.length > 0) {
          // insert each question into sqlite
          for (const it of payload.questions) {
            try {
              if (it.rubric && it.rubric.length > 0) {
                setIsRubric("rubric");
                SimpleToast.show("Rubric is present.");
              }
              if (examType === "ojt") {
                await insertAssessQuestionTableTable(
                  it?.nos?._id,
                  dataDetails?.assessment_id,
                  dataDetails?.batch_id,
                  it?.nos?.name,
                  it?.total_marks?.[0],
                  false,
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  examType,
                  "",
                  "",
                  latitude,
                  longitude,
                  currentAddress,
                  "0"
                );
              } else {
                const eng_question = (it.question?.question || []).find(
                  (item) => item.lang === "eng"
                );
                await insertAssessQuestionTableTable(
                  it.question?._id,
                  dataDetails?.assessment_id,
                  dataDetails?.batch_id,
                  eng_question ? eng_question.content : (it.question?.question?.[0]?.content || ""),
                  it.max_mark,
                  false,
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  examType,
                  "",
                  "",
                  latitude,
                  longitude,
                  currentAddress,
                  "0"
                );
              }
            } catch (qErr) {
              console.warn("Insert question error:", qErr);
            }
          }

          // fetch from local table to update UI
          await fetchAssessQuestionTable();
        } else {
          SimpleToast.show(`Assessment ${examType} Question is not Found.`);
        }
      } else {
        SimpleToast.show("Server Problem.");
      }
    } catch (err) {
      console.warn("apiData catch:", err);
      SimpleToast.show("Server Problem (504 Gateway Time-out).");
    } finally {
      if (isMountedRef.current) setLoadingIndicator(false);
    }
  };

  // camera and file handling
  const openCamera = async (id) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState?.isConnected) {
      SimpleToast.show("Check internet connection.");
      return;
    }

    try {
      const image = await ImagePicker.openCamera({
        cropperCircleOverlay: true,
        includeExif: true,
      });

      const orientationExif = image?.exif?.Orientation;
      let orientationText = "Unknown";
      if (orientationExif === 6 || orientationExif === 8) orientationText = "Portrait";
      else if (orientationExif === 1 || orientationExif === 3) orientationText = "Landscape";
      setOrientation(orientationText);

      const filePath = image.path;
      const targetDirectory = `file://${RNFS.PicturesDirectoryPath}/Claveratti/Assessment`;
      const targetFilePath = await moveImageToDirectory(filePath, targetDirectory);

      if (id === 1) {
        setCanImage(targetFilePath);
        setIsPhotoViewerVisibleScreenShot(true);
        setCameraPos(1);
      } else if (id === 2) {
        setCanIdImage(targetFilePath);
        setCameraPos(2);
        setIsPhotoViewerVisibleScreenShot(true);
      } else {
        setCanWithIdImage(targetFilePath);
        setCameraPos(3);
        setIsPhotoViewerVisibleScreenShot(true);
      }
    } catch (err) {
      // user cancelled or error
      // console.log("openCamera error", err);
    }
  };

  const moveImageToDirectory = async (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    try {
      await RNFS.mkdir(targetDirectory);
      await RNFS.moveFile(filePath, targetFilePath);
      return targetFilePath;
    } catch (err) {
      console.error("moveImageToDirectory error:", err);
      throw err;
    }
  };

  const UploadImageVideoS3 = async (uri, uniqueId, pos) => {
    const file = {
      uri: uri,
      name: `${uniqueId}-image.png`,
      type: "image/png",
    };

    const options = {
      keyPrefix: AppConfig.MOBILES3,
      bucket: AppConfig.BUKET,
      region: AppConfig.REGION,
      accessKey: AppConfig.ACCESSKEY,
      secretKey: AppConfig.SECRET_KEY,
      successActionStatus: 201,
      metadata: {
        latitude: latitude,
        longitude: longitude,
        photographer: AppConfig.PHOTO_GRAPHER,
      },
    };

    try {
      setLoadingIndicator(true);
      const response = await RNS3.put(file, options);
      if (response.status !== 201) {
        throw new Error("Failed to upload");
      } else {
        const location = response.body?.postResponse?.location || "";
        if (pos === 1) setCandS3Path(location);
        else if (pos === 2) setIdS3Path(location);
        else setCandWITHIDS3Path(location);
      }
    } catch (err) {
      console.warn("UploadImageVideoS3 error:", err);
    } finally {
      if (isMountedRef.current) setLoadingIndicator(false);
    }
  };

  const onImageSave = async (uri, pos) => {
    try {
      const uid = uuid.v4();
      await createfolder(uri, uid, pos);
      await CameraRoll.save(uri, { type: "photo", album: `../${AppConfig.APP_NAME}` });
    } catch (err) {
      // ignore
    }
  };

  const createfolder = (compressedUri, uid, pos) => {
    const targetDirectory = `file://${RNFS.PicturesDirectoryPath}/Claveratti_S3/Assessment`;
    moveImageToDirectoryCaptCandidateImage(compressedUri, targetDirectory, uid, pos).catch((e) =>
      console.warn("createfolder error:", e)
    );
  };

  const moveImageToDirectoryCaptCandidateImage = async (filePath, baseDirectory, uid, pos) => {
    try {
      const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
      const batch_id_replace = (dataDetails?.batch_id || "").replace(/[\/_]/g, "_");
      const fileNametwo = `${batch_id_replace}_${getDate()}_${fileName}`;
      const batchFolderName = `Batch_${batch_id_replace}`;
      const targetDirectory = `${baseDirectory}/${batchFolderName}`;
      const targetFilePath = `${targetDirectory}/${fileNametwo}`;

      if (pos === 1) {
        setCanImage(targetFilePath);
        setCameraPos(1);
      } else if (pos === 2) {
        setCanIdImage(targetFilePath);
        setCameraPos(2);
      } else {
        setCanWithIdImage(targetFilePath);
        setCameraPos(3);
      }

      setTimeout(() => {
        UploadImageVideoS3(targetFilePath, uid, pos).catch(() => { });
      }, 500);

      await RNFS.mkdir(targetDirectory);
      await RNFS.moveFile(filePath, targetFilePath);
      return targetFilePath;
    } catch (err) {
      console.warn("moveImageToDirectoryCaptCandidateImage error:", err);
      throw err;
    }
  };

  // clear capture video paths in AsyncStorage
  const getCaptureVideosPath = async () => {
    try {
      await AsyncStorage.setItem("PRACTICAL_VIDEOPATH", "");
      await AsyncStorage.setItem("PRACTICAL_VIDEOPATH_SECOND", "");
    } catch (err) {
      // ignore
    }
  };

  const DataNew = React.useMemo(() => {
    try {
      return JSON.parse(dataDetails?.candidateKyc || "{}");
    } catch (e) {
      return {};
    }
  }, [dataDetails]);

  const shouldShowElement = (key) => {
    if (examType === "viva") {
      return DataNew.viva && DataNew.viva[key] === true;
    } else if (examType === "demo") {
      return DataNew.demo && DataNew.demo[key] === true;
    }
    return false;
  };

  const deleteDemoVideosPath = async () => {
    await deleteDataGroup(AppConfig.DEMOVIDEOGROUP);
    await deleteDataGroup(AppConfig.DEMOGROUPVIDEOPATH);
    await deleteDataGroup(AppConfig.DEMOGROUPVDPOS);
  };

  const handlePress = async (imageuri, pos) => {
    try {
      await UploadImageVideoS3(imageuri, uuid.v4(), pos);
    } catch (err) {
      // ignore
    }
  };

  // capture video navigation helpers (example: group demo flows)
  const navigateToAssmtRoom = (optionF) => {
    const roomId = `${dataDetails?.btch_id}_${groupType || ""}_${optionF}`;
    const type = "demo";
    const stmode = "1";
    const isGroup = true;
    navigation.navigate("AssmtRoom", {
      stmode,
      dataDetails,
      position: 0,
      batchIdNo: dataDetails?.btch_id,
      batch_id: dataDetails?.batch_id,
      DemoButtonStatus: true,
      vivaStatus: false,
      attempt: false,
      optionF,
      groupPos: groupType,
      roomId,
      latitude,
      longitude,
      currentAddress,
      dateTime: new Date().toISOString(),
      type,
      isGroup,
    });
  };

  // UI render
  return (
    <SafeAreaView style={styles.constainer}>
      <ScrollView>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={[styles.head]}>{"Assessment Instructions"}</Text>
          </View>

          <View style={styles.viewStyle}>
            <View style={styles.viewSma}>
              <Text style={[styles.title1]}>{"Assessment"}</Text>
              <Text style={[styles.title2, { marginLeft: normalize(80) }]}>
                {dataDetails?.test_name}
              </Text>
            </View>
            <View style={styles.viewH} />

            <View style={styles.dir}>
              <Text style={[styles.inst]}>1. </Text>
              <Text style={[styles.instMess]}>
                {"All questions are compulsory or stated otherwise. "}
              </Text>
            </View>

            <View style={styles.dir}>
              <Text style={[styles.inst]}>2. </Text>
              <Text style={[styles.instMess]}>
                {"Candidate to answer "}
                {atm_quest > 0 ? atm_quest : "all"}
                {" question."}
              </Text>
            </View>

            <View style={styles.dir}>
              <Text style={[styles.inst]}>3. </Text>
              <Text style={[styles.instMess]}>
                {"There is no negative marking for incorrect answer. "}
              </Text>
            </View>

            <View style={styles.dir}>
              <Text style={[styles.inst]}>4. </Text>
              <Text style={[styles.instMess]}>
                {"Candidate Aadhar card is mandatory for assessment. "}
              </Text>
            </View>

            <View style={styles.dir}>
              <Text style={[styles.inst]}>5. </Text>
              <Text style={[styles.instMess]}>
                {"Please take the video for entire 1 minutes. Don't stop the video before that. "}
              </Text>
            </View>

            <View style={styles.dir}>
              <Text style={[styles.inst]}>6. </Text>
              <Text style={[styles.instMess]}>
                {"Press submit button after answering all the questions"}
              </Text>
            </View>

            <View style={styles.viewStyle}>
              <View style={[styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Duration  "}</Text>
                <Text style={[styles.tIds]}>{dataDetails?.duration}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Start Date/Time "}</Text>
                <Text style={[styles.tIds]}>{dataDetails?.start_date}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"End Date/Time "}</Text>
                <Text style={[styles.tIds]}>{dataDetails?.end_date}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Passing % "}</Text>
                <Text style={[styles.tIds]}>{"30"}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Batch Id  "}</Text>
                <Text style={[styles.tIds]}>{dataDetails?.batch_id}</Text>
              </View>

              <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Candidate Name:-"}</Text>
                <Text style={[styles.tIds]}>{data?.name}</Text>
              </View>

              {!shouldShowElement("notRequired") && (
                <View style={styles.main}>
                  {shouldShowElement("photo") && (
                    <View>
                      <View style={styles.viewArr}>
                        <TouchableOpacity onPress={() => openCamera(1)}>
                          {candS3Path ? (
                            <Image resizeMode="cover" style={[styles.imageHeight]} source={DynamicImage.checkSelcted} />
                          ) : null}

                          <Image source={{ uri: canImage }} style={styles.centerAlign} />
                          <View style={styles.circleStyleGrey}>
                            <CameraIcon style={styles.iconStyle} size={20} color={COLORS.white} name="camera" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.imageTex}>{AppConfig.CANDIDATE}</Text>
                      {cameraPos === 1 && !candS3Path && (
                        <TouchableOpacity style={styles.button} onPress={() => handlePress(canImage, 1)}>
                          <Text style={styles.buttonText}>Upload</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {shouldShowElement("candidate_id") && (
                    <View>
                      <View style={styles.viewArr}>
                        <TouchableOpacity onPress={() => openCamera(2)}>
                          {idS3Path ? <Image resizeMode="cover" style={[styles.imageHeight]} source={DynamicImage.checkSelcted} /> : null}
                          <Image source={{ uri: canIDImage }} style={styles.centerAlign} />
                          <View style={styles.circleStyleGrey}>
                            <CameraIcon style={styles.iconStyle} size={20} color={COLORS.white} name="camera" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.imageTex}>{"Candidate Id"}</Text>
                      {cameraPos === 2 && !idS3Path && (
                        <TouchableOpacity style={styles.button} onPress={() => handlePress(canIDImage, 2)}>
                          <Text style={styles.buttonText}>Upload</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {shouldShowElement("candidate_photo_with_id") && (
                    <View>
                      <View style={styles.viewArr}>
                        <TouchableOpacity onPress={() => openCamera(3)}>
                          {candWithIdS3Path ? <Image resizeMode="cover" style={[styles.imageHeight]} source={DynamicImage.checkSelcted} /> : null}
                          <Image source={{ uri: canWithIdImage }} style={styles.centerAlign} />
                          <View style={styles.circleStyleGrey}>
                            <CameraIcon style={styles.iconStyle} size={20} color={COLORS.white} name="camera" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.imageTex, { width: "80%", textAlign: "left" }]}>{"Candidate with Id"}</Text>
                      {cameraPos === 3 && !candWithIdS3Path && (
                        <TouchableOpacity style={styles.button} onPress={() => handlePress(canWithIdImage, 3)}>
                          <Text style={styles.buttonText}>Upload</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}

              <View style={styles.viewCheck}>
                <CheckBox
                  value={isInstructionSelected}
                  onValueChange={setInstructionSelected}
                  style={{ alignSelf: "flex-start" }}
                  tintColors={{ true: "#007AFF", false: "#007AFF" }}
                />
                <Text style={[styles.checktitle]}>
                  {`I have read all instructions and ready to attempt ${examType === "viva" ? "Viva" : "Demo"}  Exam`}
                </Text>
              </View>

              <View style={{ alignSelf: "center", flexDirection: "row", justifyContent: "space-around" }}>
                <CustomeButton
                  textColor={ConfigColor.white}
                  label={examType === "viva" ? "START VIVA" : (examType === "demo" ? "START PRACTICAL" : "START OJT")}
                  onPress={async () => {
                    if (dataArr.length <= 0) {
                      SimpleToast.show("Assessment Question is not Found.");
                      return;
                    }

                    const photoChecks =
                      (!shouldShowElement("photo") || candS3Path) &&
                      (!shouldShowElement("candidate_id") || idS3Path) &&
                      (!shouldShowElement("candidate_photo_with_id") || candWithIdS3Path);

                    if (!isInstructionSelected || !photoChecks) {
                      Alert.alert(AppConfig.ALERT, AppConfig.INSTRUCTION, [{ text: "Okay", style: "cancel" }]);
                      return;
                    }

                    if (isRubric === "rubric") {
                      await getCaptureVideosPath();
                      navigation.navigate("StartRubricDemo", {
                        assessment_id: dataDetails?.assessment_id,
                        id: data?._id,
                        examType,
                        candS3Path,
                        idS3Path,
                        candWithIdS3Path,
                        latitude,
                        longitude,
                        currentAddress
                      });
                    } else {
                      try {
                        console.log("--:StartVivaVideoRecording--")
                        await getCaptureVideosPath();
                        const resv = await dispatch(getLiveStreamingApi(data?._id, "publisher"));
                        // const rtcToken = resv?.data?.rtcToken;
                        console.log("--:resv--",resv)

                        const rtcToken = resv?.data?.rtcToken;
                        console.log("--:rtcToken last--",rtcToken)


                        navigation.navigate("StartVivaVideoRecording", {
                          rtcToken,
                          data,
                          examType,
                          batchIdNo: dataDetails?.btch_id,
                          assessment_id: dataDetails?.assessment_id,
                          vivaData: dataArr,
                          candS3Path,
                          idS3Path,
                          candWithIdS3Path,
                          dataDetails,
                          dataDetailsArr,
                          latitude,
                          longitude,
                          currentAddress,
                          groupType,
                          atm_quest,
                          positionvrt: "0",
                        });
                      } catch (err) {
                        SimpleToast.show("Unable to start live streaming.");
                      }
                    }
                  }}
                  buttonContainerStyle={styles.container}
                />
              </View>
            </View>
          </View>
        </View>

        <ImageTimeStamp
          uri={cameraPos === 1 ? canImage : cameraPos === 2 ? canIDImage : canWithIdImage}
          currentAddress={currentAddress}
          latitude={String(latitude)}
          longitude={String(longitude)}
          orientationMode={orientation}
          dialogVisible={isPhotoViewerVisibleScreenShot}
          RightCheckonPress={(uri) => {
            setIsPhotoViewerVisibleScreenShot(false);
            if (cameraPos === 1) {
              setCanImage(uri);
              onImageSave(uri, 1);
            } else if (cameraPos === 2) {
              setCanIdImage(uri);
              onImageSave(uri, 2);
            } else if (cameraPos === 3) {
              setCanWithIdImage(uri);
              onImageSave(uri, 3);
            }
          }}
          onPress={() => setIsPhotoViewerVisibleScreenShot(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    marginTop: 15,
  },
  viewSma: { flexDirection: "row", marginLeft: normalize(20) },
  viewH: {
    height: 0.5,
    alignSelf: "center",
    backgroundColor: "#000",
    width: "92%",
    marginTop: 10,
  },
  circleStyleGrey: {
    height: 35,
    position: "absolute",
    right: -12,
    top: 50,
    backgroundColor: COLORS.textColorsBlue,
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    borderRadius: 10,
  },
  imageTex: {
    fontSize: 14,
    color: COLORS.textColors,
    marginTop: 10,
    lineHeight: 22,
    fontFamily: "Lato-Bold",
    textAlign: "left",
  },
  main: {
    flexDirection: "row",
    marginTop: 15,
    width: "90%",
    marginLeft: 30,
    justifyContent: "space-between",
  },
  centerAlign: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
  imageHeight: {
    width: 30,
    height: 30,
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 100,
  },
  dir: { flexDirection: "row" },
  iconStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  instMess: {
    fontSize: normalize(16),
    marginTop: normalize(10),
    marginRight: normalize(40),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  inst: {
    fontSize: normalize(16),
    marginLeft: normalize(20),
    marginTop: normalize(10),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    fontWeight: "bold",
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: normalize(10),
    paddingTop: normalize(10),
    flexGrow: 1,
    borderTopLeftRadius: normalize(15),
    borderTopEndRadius: normalize(15),
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 40,
  },
  viewArr: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    zIndex: 1,
    borderRadius: 80 / 2,
    borderWidth: 2,
    borderColor: "#3B45FF",
    marginRight: 44,
  },
  checktitle: {
    fontWeight: "700",
    fontSize: normalize(14),
    color: COLORS.blue,
    paddingHorizontal: normalize(80),
    fontFamily: "Lato-Bold",
    paddingLeft: normalize(10),
  },
  viewCheck: {
    marginBottom: normalize(10),
    flexDirection: "row",
    marginVertical: normalize(20),
    marginHorizontal: normalize(15),
  },
  tIds2: {
    marginLeft: normalize(20),
    width: "40%",
    color: COLORS.textColors,
  },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "60%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
  },
  container: {
    borderRadius: 10,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    width: "60%",
    marginLeft: normalize(8),
    marginVertical: normalize(10),
    alignItems: "center",
  },
  head: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: normalize(22),
    fontWeight: "bold",
  },
  title2: {
    fontWeight: "700",
    fontSize: normalize(14),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  title1: {
    fontWeight: "bold",
    fontSize: normalize(16),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    width: 70,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 10,
  },
});

export default AssessmentInstructions;
