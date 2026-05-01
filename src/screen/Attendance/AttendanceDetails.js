import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import { CustomeButton } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import CameraIcon from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";
import ApiUrl from "../../utils/UrlConfig";
import LoadMapScreen from "../../router/Map/LoadMapScreen";
import CustomTextInput from "../../components/CustomTextInput";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceApi, postAttendanceSubmitApi, } from "../../redux/Actions/AllContentAction";
import { getData, getDate } from "../../utils/Utills";
import { getLocation } from "../../utils/helper";
import { RNS3 } from "react-native-aws3";
import CameraRoll from "@react-native-camera-roll/camera-roll";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import moment from 'moment';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import SimpleToast from "react-native-simple-toast";
import { useFocusEffect } from '@react-navigation/native';
import requestCameraAndAudioPermission from "../../components/permission";
import ImageTimeStamp from "../../components/ImageTimeStamp";

const AttendanceDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { batchId, batch_Id } = route.params;
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [dt, setDt] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  const [name, setName] = useState("");
  const [orientation, setOrientation] = useState("");
  const [canImage, setCanImage] = useState(ApiUrl.defaultImageUrl);
  const [capturImage, setCapturImage] = useState("");
  const [s3PhotoUploadedpath, setS3PhotoUploadedpath] = useState();
  const [data, setData] = useState();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('address');
  const [latitude, setLatitude] = useState('1');
  const [longitude, setLongitude] = useState('2');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isPhotoVisibleScrShot, setisPhotoVisibleScrShot] =
    useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDt(moment().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // for location
  const fetchLocation = async () => {
    try {
      setLocationLoading(true);
      const { result } = await getLocation();
      const addressComponents = result?.address_components || [];
      console.log("addressComponents", addressComponents);
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

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoadingIndicator(true);
      try {
        const res = await dispatch(getAttendanceApi(batchId));
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.log("Attendance fetch error:", error);
      } finally {
        setLoadingIndicator(false);
      }
    };
    fetchAttendance();
  }, [batchId, dispatch]);

  useEffect(() => {
    const init = async () => {
      const userName = await getData(AppConfig.NAME);
      setName(userName);
      setLatitude(dataLatLong.latitude);
      setLongitude(dataLatLong.longitude);
    };
    if (capturImage) init();
  }, [capturImage]);

  const openCamera = async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return SimpleToast.show("Check internet connection.");
    }
    ImagePicker.openCamera({
      compressImageQuality: 0.2,
      useFrontCamera: true,
      includeExif: true,
    })
      .then(async (image) => {
        const orientation = image.exif?.Orientation;
        let orientationText = 'Unknown';
        if (orientation === 6 || orientation === 8) orientationText = 'Portrait';
        else if (orientation === 1 || orientation === 3) orientationText = 'Landscape';
        setOrientation(orientationText);

        const filePath = image.path;
        const targetDir = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti/Attendence';
        const savedPath = await moveImageToDirectory(filePath, targetDir);
        setCapturImage(savedPath);
        setCanImage(savedPath);
        // onImageSave(savedPath);
        setisPhotoVisibleScrShot(true);
      })
      .catch((err) => console.log("Camera error:", err));
  };

  const moveImageToDirectory = (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    return RNFS.mkdir(targetDirectory)
      .then(() => RNFS.moveFile(filePath, targetFilePath))
      .then(() => targetFilePath);
  };

  const onImageSave = (uri) => {
    const targetDir = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/Attendence';
    setCanImage(uri);
    moveImageToDirectoryS3(uri, targetDir);
    UploadImageToS3(uri);
    CameraRoll.save(uri, { type: "photo", album: "../Cleveratii" });
  };

  const moveImageToDirectoryS3 = (filePath, baseDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const batch_id_clean = batch_Id.replace(/[\/_]/g, "_");
    const finalFileName = `${batch_id_clean}_${getDate()}_${fileName}`;
    const targetDir = `${baseDirectory}/Batch_${batch_id_clean}`;
    const finalPath = `${targetDir}/${finalFileName}`;
    setCanImage(finalPath);
    return RNFS.mkdir(targetDir)
      .then(() => RNFS.moveFile(filePath, finalPath))
      .then(() => finalPath);
  };

  const UploadImageToS3 = (uri) => {
    const file = {
      uri: uri,
      name: new Date() + "-image.png",
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
        latitude: latitude + "",
        longitude: longitude + "",
        photographer: AppConfig.PHOTO_GRAPHER,
      },
    };

    setLoadingIndicator(true);
    RNS3.put(file, options).then((res) => {
      setLoadingIndicator(false);
      if (res.status !== 201) {
        return SimpleToast.show("Failed to upload image to S3");
      }
      console.log("S3 upload success:", res.body);
      setS3PhotoUploadedpath(res.body.postResponse.location);
    });

  };

  const submitApi = async () => {
    const payload = data?.in_time_status
      ? {
        batch: batchId,
        out_time: dt,
        out_image: s3PhotoUploadedpath,
        out_time_status: true,
        location_out: { lat: latitude, lng: longitude },
        address_out: currentAddress,
      }
      : {
        batch: batchId,
        in_time: dt,
        in_image: s3PhotoUploadedpath,
        in_time_status: true,
        location_in: { lat: latitude, lng: longitude },
        address_in: currentAddress,
      };

    setLoadingIndicator(true);
    const res = await dispatch(postAttendanceSubmitApi(payload));
    setLoadingIndicator(false);

    if (res.status === 200) {
      navigation.navigate("Thankyou", { examType: "attendance" });
    }
  };

  return (
    <SafeAreaView style={styles.constainer}>
      <ScrollView>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.head}>Attendance dashboard</Text>
          </View>

          <View style={styles.viewStyle}>
            <View style={styles.viewS}>
              <Text style={styles.title1}>{name}</Text>
              <Text style={[styles.title2, styles.titel3]}>{dt}</Text>
            </View>
            <View style={styles.viewH} />
            <View style={{ height: 150 }}>
              <LoadMapScreen attendacePage="attendacePage" />
            </View>

            <TouchableOpacity
              style={styles.touch}
              onPress={() =>
                navigation.navigate("loadMapScreen", {
                  currentAddress,
                  latitude,
                  longitude,
                })
              }
            >
              <Text style={styles.title2}>View Map</Text>
            </TouchableOpacity>
            <View style={styles.main}>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={openCamera}>
                  <Image source={{ uri: canImage }} style={styles.centerAlign} />
                  <View style={styles.circleStyleGrey}>
                    <CameraIcon size={20} color={COLORS.white} name="camera" />
                  </View>
                </TouchableOpacity>
                {/* <Text style={styles.imageTex}>{currentAddress}</Text> */}
              </View>

              <View style={styles.cent}>
                <Text style={[styles.imageTex, styles.place]}>Your Current Place</Text>
                <CustomTextInput
                  placeholder="Enter Place name"
                  inputValue={currentAddress}
                  setInputValue={setCurrentAddress}
                />
              </View>
            </View>
            <View style={styles.buttonView}>
              <CustomeButton
                isdisabled={!s3PhotoUploadedpath}
                textColor={ConfigColor.white}
                label={data?.in_time_status ? "Submit OutTime" : "Submit InTime"}
                onPress={submitApi}
                buttonContainerStyle={[
                  styles.container,
                  { backgroundColor: s3PhotoUploadedpath ? COLORS.blue : "grey" },
                ]}
              />
            </View>
          </View>

          <View>
            <ImageTimeStamp
              uri={capturImage}
              currentAddress={currentAddress}
              latitude={latitude + ''}
              longitude={longitude + ''}
              dialogVisible={isPhotoVisibleScrShot}
              RightCheckonPress={uri => {
                setisPhotoVisibleScrShot(false);
                onImageSave(uri, 1);
              }}
              onPress={() => {
                setisPhotoVisibleScrShot(false);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    height: "100%",
  },
  containV: {
    marginTop: 200,
    backgroundColor: "white",
  },
  viewS: { flexDirection: "row", marginLeft: normalize(20) },
  viewH: {
    height: 1,
    alignSelf: "center",
    backgroundColor: "#000",
    width: "100%",
    marginTop: 40,
  },
  cent: {
    width: "70%",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 30,
  },
  circleStyleGrey: {
    height: 35,
    position: "absolute",
    right: -12,
    top: 50,
    alignSelf: "center",
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
    alignSelf: "center",
    lineHeight: 22,
    fontFamily: "Lato-Bold",
  },
  touch: {
    position: "absolute",
    top: 190,
    right: 10,
    elevation: 3,
    backgroundColor: "#f44336",
    marginLeft: normalize(80),
    borderRadius: 14,
    height: 30,
    width: 90,
    alignSelf: "center",
  },
  main: {
    marginTop: -15,
  },
  centerAlign: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
  place: {
    textAlign: "center",
    marginBottom: -20,
    color: "grey",
  },
  dir: { flexDirection: "row" },
  iconStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
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
    flex: 1,
    height: "100%",
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
  container: {
    borderRadius: 10,
    height: normalize(40),
    backgroundColor: COLORS.blue,
    width: "50%",
    alignSelf: "center",
    marginVertical: normalize(10),
  },
  head: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "bold",
    //textDecorationLine: "underline",
  },
  title2: {
    fontWeight: "700",
    fontSize: normalize(14),
    fontFamily: "Lato-Bold",
    paddingHorizontal: 15,
    color: COLORS.white,
    borderRadius: 14,
    paddingVertical: 5,
  },
  title1: {
    fontWeight: "bold",
    fontSize: normalize(16),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  titel3: {
    backgroundColor: COLORS.bluecolrHead,
    position: "absolute",
    right: 10,
    top: 30,
  },
  buttonView: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
export default AttendanceDetails;
