import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { COLORS } from "../../constants/Theme";
import { RNS3 } from "react-native-aws3";
import { CustomeButton, SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import CheckBox from "@react-native-community/checkbox";
import CameraIcon from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";
import ApiUrl from "../../utils/UrlConfig";
import ImageTimeStamp from "../CandidateSection/ImageTimeStamp";
import { consoleLog, dateFormate, getData } from "../../utils/Utills";
//import CameraRoll from "@react-native-community/cameraroll";
import CameraRoll from "@react-native-camera-roll/camera-roll";

import {
  getCandidateExamQuestion,
  getCandidateInstruction,
  getLiveStreamingApi,
  uploadInstructionImage,
} from "../../redux/Actions/AllContentAction";
import { useDispatch, useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Example from "../CredentialsAuth/Example";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import DynamicImage from "../../constants/DynamicImage";
import SimpleToast from "react-native-simple-toast";
import uuid from "react-native-uuid";
import { getLocation } from "../../utils/helper";
import requestCameraAndAudioPermission from "../../components/permission";
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
    let { status } = await PERMISSIONS.askAsync(PERMISSIONS.LOCATION);
    return status === "granted";
  } catch (error) {
    throw error;
  }
};

export const enableGPSOnAndroid = async () => {
  try {
    const response =
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
    return response === "already-enabled" || response === "enabled";
  } catch (error) {
    return false;
  }
};
const CandidateInstruction = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { assessment_id } = route.params;
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [canImage, setCanImage] = useState(ApiUrl.defaultImageUrl);
  const [canIDImage, setCanIdImage] = useState(ApiUrl.candId);
  const [canWithIdImage, setCanWithIdImage] = useState(ApiUrl.canWithId);
  const [isPhotoViewerVisibleScreenShot, setIsPhotoViewerVisibleScreenShot] = useState(false);
  const [cameraPos, setCameraPos] = useState(0);
  const [isInstructionSelected, setInstructionSelected] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [candS3Path, setCandS3Path] = useState("");
  const [idS3Path, setIdS3Path] = useState("");
  const [candWithIdS3Path, setCandWITHIDS3Path] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const [data, setData] = useState([]);
  const wasOfflineRef = useRef(false);

  const fetchInstruction = async () => {
    try {
      setLoadingApi(true);

      let dataRes = await dispatch(getCandidateInstruction(assessment_id));

      if (dataRes?.status === 200) {
        setData(dataRes?.data);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoadingApi(false);
    }
  };


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isConnected = state.isConnected;

      // ❌ No Internet → Show message (only once)
      if (!isConnected && !wasOfflineRef.current) {
        wasOfflineRef.current = true;

        Alert.alert(
          "No Internet",
          "Please check your internet connection."
        );
      }

      // ✅ Internet restored → Call API once
      if (isConnected && wasOfflineRef.current) {
        try {
          wasOfflineRef.current = false;

          setLoadingApi(true);
          await fetchInstruction();
        } catch (e) {
          console.log("Reload error:", e);
        } finally {
          setLoadingApi(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);


  // for location
  const fetchLocation = async () => {
    try {
      setLocationLoading(true);
      const { result } = await getLocation();
      const addressComponents = result?.address_components || [];
      // console.log("addressComponents", addressComponents);
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
      // console.log("--:Latitude--", result?.geometry?.location?.lat)
      // console.log("--:Longitude--", result?.geometry?.location?.lng)
      // console.log("--:Address--", fullLocation.trim())

      setLocationLoading(false);

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

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadPermission = async () => {
        await requestCameraAndAudioPermission();
      };

      if (isActive) {
        loadPermission();
      }

      return () => {
        isActive = false;
      };
    }, []),
  );

  const uploadProfileImage2 = async () => {
    if (
      isInstructionSelected &&
      candS3Path &&
      idS3Path &&
      candWithIdS3Path
    ) {
    } else {
    }
  }

  const uploadProfileImage = async () => {
    if (
      !isInstructionSelected ||
      !candS3Path ||
      !idS3Path ||
      !candWithIdS3Path
      // false
    ) {
      Alert.alert(AppConfig.ALERT, AppConfig.INSTRUCTION, [
        {
          text: "Okay",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
      return;
    }

    let dataJson = {
      location: JSON.stringify(`{lat: ${latitude}, lng:${longitude}}`),
      image: candS3Path,
      adhaar: idS3Path,
      image_with_id: candWithIdS3Path,
    };

    let dataResUpload = await dispatch(uploadInstructionImage(dataJson, assessment_id));
    //console.log("dataResUpload:--", dataResUpload?.data);
    let dataR = await dispatch(getCandidateExamQuestion(assessment_id));
    let token = dataR.data.assessment._id;
    let resv = await dispatch(getLiveStreamingApi(token, 'audience'));
    let rtcToken = resv.data.rtcToken;
    //console.log("resv:--", resv);
    if (resv.status == 200) {
      navigation.navigate("CandidateExam", {
        assessment_id,
        latitude,
        longitude,
        cadn_id: data?._id,
        rtcToken,
      });
    } else {
      Alert.alert(
        AppConfig.ALERT,
        "Something wrong/Check network connection...",
        [
          {
            text: "Okay",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ]
      );
    }
  };

  const openCamera = async (id) => {
    await ImagePicker.openCamera({
      compressImageQuality: 0.2,
      width: 700,
      height: 700,
      useFrontCamera: true,
    })
      .then((image) => {
        if (id == 1) {
          setCanImage(image.path);
          setIsPhotoViewerVisibleScreenShot(true);
          setCameraPos(1);
        } else if (id == 2) {
          setCanIdImage(image.path);
          setCameraPos(2);
          setIsPhotoViewerVisibleScreenShot(true);
        } else {
          setCanWithIdImage(image.path);
          setCameraPos(3);
          setIsPhotoViewerVisibleScreenShot(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UploadImageVideoS3 = async (uri, uuid, pos) => {
    setLoadingIndicator(true);
    const file = {
      uri: uri,
      name: uuid + "-image.png",
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
      await RNS3.put(file, options).then((response) => {
        if (response.status !== 201) {
          setLoadingIndicator(false);
        } else {
          setLoadingIndicator(false);
          if (pos == 1) {
            setCandS3Path(response.body.postResponse.location);
          } else if (pos == 2) {
            setIdS3Path(response.body.postResponse.location);
          } else if (pos == 3) {
            setCandWITHIDS3Path(response.body.postResponse.location);
          }
        }
      });
      setLoadingIndicator(false);
    } catch (err) {
      SimpleToast.show("Upload failed");
      setLoadingIndicator(false);
    }
  };

  const onImageSave = (uri, pos) => {
    try {
      UploadImageVideoS3(uri, uuid.v4(), pos);
      CameraRoll.save(uri, {
        type: "photo",
        album: `../ +${AppConfig.APP_NAME} `,
      })
        .then((res) => { })
        .catch((err) => {
          console.log("err for save img...", err);
        });
    } catch (err) {
      consoleLog("err", err);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <ScrollView>
          <View style={styles.constainer}>
            <View style={styles.viewMargin}>
              <MenuIcon onPress={() => navigation.goBack()} back="back" />
              <Text style={[styles.head]}>{"Exam Instructions"}</Text>
            </View>

            <View style={styles.viewStyle}>
              <View style={{ flexDirection: "row", marginLeft: normalize(20) }}>
                <Text style={[styles.title1]}>{"Exam Name"}</Text>
                <Text style={[styles.title2, { marginLeft: normalize(80) }]}>
                  {data?.name}
                </Text>
              </View>
              <View style={styles.viewH}></View>

              <View style={styles.dir}>
                <Text style={[styles.inst]}>1. </Text>
                <Text style={[styles.instMess]}>
                  {"All questions are compulsory. "}
                </Text>
              </View>

              <View style={styles.dir}>
                <Text style={[styles.inst]}>2. </Text>
                <Text style={[styles.instMess]}>
                  {"There is no negative marking for incorrect answer. "}
                </Text>
              </View>

              <View style={styles.dir}>
                <Text style={[styles.inst]}>3. </Text>
                <Text style={[styles.instMess]}>
                  {"Press Submit button after answering all the question. "}
                </Text>
              </View>

              <View style={styles.dir}>
                <Text style={[styles.inst]}>4. </Text>
                <Text style={[styles.instMess]}>
                  {"Candidate Aadhar card is mandatory for assessment. "}
                </Text>
              </View>

              <View style={styles.viewStyle}>
                <View style={[styles.viewRow]}>
                  <Text style={[styles.tIds, styles.tIds2]}>
                    {AppConfig.DURATION}
                  </Text>
                  <Text
                    style={[styles.tIds]}
                  >{`${data?.strategy?.duration} Minutes`}</Text>
                </View>
                <View style={[styles.marg10, styles.viewRow]}>
                  <Text style={[styles.tIds, styles.tIds2]}>
                    {"Start Date/Time "}
                  </Text>
                  <Text style={[styles.tIds]}>
                    {dateFormate(data?.start_date)}
                  </Text>
                </View>

                <View style={[styles.marg10, styles.viewRow]}>
                  <Text style={[styles.tIds, styles.tIds2]}>
                    {"End Date/Time "}
                  </Text>
                  <Text style={[styles.tIds]}>
                    {dateFormate(data?.end_date)}
                  </Text>
                </View>

                <View style={[styles.marg10, styles.viewRow]}>
                  <Text style={[styles.tIds, styles.tIds2]}>
                    {"Passing % "}
                  </Text>
                  <Text
                    style={[styles.tIds]}
                  >{`${data?.strategy?.pass_percentage} `}</Text>
                </View>

                <View style={[styles.marg10, styles.viewRow]}>
                  <Text style={[styles.tIds, styles.tIds2]}>
                    {AppConfig.BATCH_ID}
                  </Text>
                  <Text style={[styles.tIds]}>{data?.batch?.batch_id}</Text>
                </View>

                <View style={styles.main}>
                  <View>
                    <View style={styles.viewArr}>
                      <TouchableOpacity onPress={() => openCamera(1)}>
                        {candS3Path ? (
                          <Image
                            resizeMode="cover"
                            style={[styles.imageHeight]}
                            source={DynamicImage.checkSelcted}
                          />
                        ) : null}
                        <Image
                          source={{ uri: canImage }}
                          style={styles.centerAlign}
                        ></Image>

                        <View style={styles.circleStyleGrey}>
                          <CameraIcon
                            style={styles.iconStyle}
                            size={15}
                            color={COLORS.white}
                            name="camera"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.imageTex}>{AppConfig.CANDIDATE}</Text>
                  </View>

                  <View>
                    <View style={styles.viewArr}>
                      <TouchableOpacity onPress={() => openCamera(2)}>
                        <View>
                          {idS3Path ? (
                            <Image
                              resizeMode="cover"
                              style={[styles.imageHeight]}
                              source={DynamicImage.checkSelcted}
                            />
                          ) : null}
                          <Image
                            source={{ uri: canIDImage }}
                            style={styles.centerAlign}
                          ></Image>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.circleStyleGrey}>
                        <CameraIcon
                          style={styles.iconStyle}
                          size={15}
                          color={COLORS.white}
                          name="camera"
                        />
                      </View>
                    </View>
                    <Text style={styles.imageTex}>
                      {AppConfig.CANDIDATE_ID}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.viewArr}>
                      <TouchableOpacity onPress={() => openCamera(3)}>
                        {candWithIdS3Path ? (
                          <Image
                            resizeMode="cover"
                            style={[styles.imageHeight]}
                            source={DynamicImage.checkSelcted}
                          />
                        ) : null}
                        <Image
                          source={{ uri: canWithIdImage }}
                          style={styles.centerAlign}
                        ></Image>

                        <View style={styles.circleStyleGrey}>
                          <CameraIcon
                            style={styles.iconStyle}
                            size={15}
                            color={COLORS.white}
                            name="camera"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.imageTex,
                        { width: "80%", textAlign: "left" },
                      ]}
                    >
                      {"Candidate with Id"}
                    </Text>
                  </View>
                </View>

                <View style={styles.viewCheck}>
                  <CheckBox
                    value={isInstructionSelected}
                    onValueChange={setInstructionSelected}
                    style={{ alignSelf: "flex-start" }}
                  />
                  <Text style={[styles.checktitle]}>
                    {
                      "Tick this checkbox if you have read all instructions and ready to attempt Exam"
                    }
                  </Text>
                </View>
                <View style={styles.viT}>
                  <CustomeButton
                    textColor={ConfigColor.white}
                    label={"Start Theory Exam"}
                    onPress={uploadProfileImage}
                    buttonContainerStyle={styles.container}
                  />
                </View>
              </View>
            </View>
          </View>

          <ImageTimeStamp
            uri={
              cameraPos == 1
                ? canImage
                : cameraPos == 2
                  ? canIDImage
                  : canWithIdImage
            }
            currentAddress={currentAddress}
            latitude={latitude + ""}
            longitude={longitude + ""}
            dialogVisible={isPhotoViewerVisibleScreenShot}
            RightCheckonPress={(uri) => {
              setIsPhotoViewerVisibleScreenShot(false);
              if (cameraPos == 1) {
                // setCanImage(uri);
                onImageSave(uri, 1);
              } else if (cameraPos == 2) {
                // setCanIdImage(uri);
                onImageSave(uri, 2);
              } else if (cameraPos == 3) {
                // setCanWithIdImage(uri);
                onImageSave(uri, 3);
              }
            }}
            onPress={() => {
              setIsPhotoViewerVisibleScreenShot(false);
              if (cameraPos == 1) {
                setCanImage(ApiUrl.defaultImageUrl);
              } else if (cameraPos == 2) {
                setCanIdImage(ApiUrl.candId);
              } else if (cameraPos == 3) {
                setCanWithIdImage(ApiUrl.canWithId);
              }

            }}
          />
        </ScrollView>

        {loadingIndicator && (
          <View style={styles.loaderOverlay}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#1E88E5" />
              <Text style={styles.loaderText}>Please Uploading image...</Text>
            </View>
          </View>
        )}

        {loadingApi && (
          <View style={styles.loaderOverlay}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#1E88E5" />
              <Text style={styles.loaderText}>Loading, please wait.....</Text>
            </View>
          </View>
        )}
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

  viewH: {
    height: 0.5,
    alignSelf: "center",
    backgroundColor: "#000",
    width: "92%",
    marginTop: 10,
  },
  marg10: { marginTop: normalize(10) },
  circleStyleGrey: {
    height: 30,
    position: "absolute",
    right: -12,
    top: 50,
    backgroundColor: COLORS.textColorsBlue,
    justifyContent: "center",
    alignItems: "center",
    width: 30,

    borderRadius: 10,
  },

  imageHeight: {
    width: 30,
    height: 30,
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 100,
  },
  imageTex: {
    fontSize: 14,
    color: COLORS.textColors,
    marginTop: 10,
    alignSelf: "center",
    lineHeight: 22,
    fontFamily: "Lato-Bold",
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

  dir: { flexDirection: "row" },
  iconStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  viT: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  instMess: {
    fontSize: normalize(16),
    marginTop: normalize(15),
    marginRight: normalize(40),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  inst: {
    fontSize: normalize(16),
    marginLeft: normalize(20),
    marginTop: normalize(15),
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
    marginTop: normalize(20),
    paddingTop: normalize(20),
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
    width: "70%",
    marginLeft: normalize(8),
    marginVertical: normalize(10),
    alignItems: "center",
    marginBottom: 40,
  },

  head: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: normalize(22),
    fontWeight: "bold",
    // textDecorationLine: "underline",
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


  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  loaderBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  loaderText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CandidateInstruction;
