import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, SafeAreaView, StyleSheet, FlatList,
  PermissionsAndroid, TouchableOpacity, Image,ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import SimpleToast from "react-native-simple-toast";
import normalize from "react-native-normalize";

import { COLORS } from "../../constants/Theme";
import DynamicImage from "../../constants/DynamicImage";
import { SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import AssessmentItem from "./AssessmentItem";
import stylesNew from "../Audit/styles";

import {
  timeDateFormate, nameFixedCharacter,
  getData, deleteDataGroup,
  getDemoVideoPos, getDemoVideoPath, getDemoVideoGroup,
} from "../../utils/Utills";
import { getLocation } from "../../utils/helper";
import {
  getAssessorBatchCandidateList,
  uploadVideoTagDemoGroupApi,
  getdemoGroupVideosStatus,
} from "../../redux/Actions/AllContentAction";
import {
  createAssess_batchCandidateList, db,
  insertAssesCandidateListTable, deleteAssmtCandidateList,
} from "../../database/SqlLitedatabase";
import { AppConfig } from "./Utils";

import NetworkChecker from "../../components/NetworkChecker.js";

// ─── Constants ───────────────────────────────────────────────────────────────
const GROUP_MAP = { Group1: 0, Group2: 1, Group3: 2, Group4: 3 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "App needs access to your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const buildAddressFromComponents = (addressComponents = []) => {
  const getComponent = (type) =>
    addressComponents.find((c) => c.types.includes(type))?.long_name || "";

  const parts = [
    "sublocality_level_2",
    "sublocality_level_3",
    "administrative_area_level_3",
    "administrative_area_level_1",
    "country",
    "postal_code",
  ]
    .map((type) => getComponent(type))
    .filter(Boolean);

  return parts.join(", ");
};

// ─── Component ───────────────────────────────────────────────────────────────
const AssessmentDetailsScreen = ({ navigation, route }) => {
  const {
    dataDetails, position, batchIdNo, batch_id,
    DemoButtonStatus, vivaStatus, attempt,
    returnGroupPos,
  } = route.params;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // State
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [data, setData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [demoGroupVideoDt, setDemoGroupVideoDt] = useState([]);
  const [demoGroupVideoDtdf, setDemoGroupVideoDtdf] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [newData, setNewData] = useState([]);
  const [groupPos, setGroupPos] = useState("Group1");
  const [on_off_linemode, setOnOffLineMode] = useState();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [dateTime] = useState(new Date().toLocaleString());
  const [tokens, setTokens] = useState();
  const [loaderMessage, setLoaderMessage] = useState("Fetching data, please wait...");

  const dropdownRef = useRef(null);

  // Refs to avoid stale closures inside setTimeout callbacks
  const currentAddressRef = useRef(currentAddress);
  const latitudeRef = useRef(latitude);
  const longitudeRef = useRef(longitude);
  const groupIdRef = useRef(groupId);
  const tokensRef = useRef(tokens);

  useEffect(() => { currentAddressRef.current = currentAddress; }, [currentAddress]);
  useEffect(() => { latitudeRef.current = latitude; }, [latitude]);
  useEffect(() => { longitudeRef.current = longitude; }, [longitude]);
  useEffect(() => { groupIdRef.current = groupId; }, [groupId]);
  useEffect(() => { tokensRef.current = tokens; }, [tokens]);

  // ─── Location ──────────────────────────────────────────────────────────────
  const fetchLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      const { result } = await getLocation();
      const address = buildAddressFromComponents(result?.address_components);
      const lat = result?.geometry?.location?.lat;
      const lng = result?.geometry?.location?.lng;

      setCurrentAddress(address);
      setLatitude(lat);
      setLongitude(lng);

      console.log("Latitude:", lat, "| Longitude:", lng, "| Address:", address);
    } catch (error) {
      console.log("Error fetching location:", error);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // ─── Permission (on focus) ─────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadPermission = async () => {
        const granted = await requestLocationPermission();
        if (!active) return;
        console.log(granted ? "✅ Location permission granted" : "❌ Location permission denied");
      };
      loadPermission();
      return () => { active = false; };
    }, [])
  );

  // ─── Location + online-mode (on focus) ────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          await fetchLocation();
          if (!active) return;
          const mode = await getData(AppConfig.OnOffMode);
          setOnOffLineMode(mode ?? "true");
        } catch (err) {
          console.log("useFocusEffect error:", err);
        }
      };
      load();
      return () => { active = false; };
    }, [fetchLocation])
  );

  // ─── Init on focus ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFocused) return;
    const init = async () => {
      await getDemoGroupPos();
      try {
        await getAssessCandidateListTable();
      } catch (error) {
        console.log("Error fetching candidate list:", error);
      }
      const mode = await getData(AppConfig.OnOffMode);
      setOnOffLineMode(mode ?? "true");
    };
    init();
  }, [isFocused]);

  // ─── First load: clear DB then fetch API ──────────────────────────────────
  useEffect(() => {
    const bootstrap = async () => {
      await deleteAssmtCandidateList();
      await apiData();
    };
    bootstrap();
  }, []);

  // ─── Token + geo ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadTokenAndLocation = async () => {
      const token = await getData("token");
      setTokens(token);
      await geoLocation();
    };
    loadTokenAndLocation();
  }, []);

  // ─── API ───────────────────────────────────────────────────────────────────
  const apiData = async () => {
    setLoaderMessage("Loading candidates...");
    setLoadingIndicator(true);
    await createAssess_batchCandidateList();

    try {
      const assessmentId = (!attempt && !vivaStatus)
        ? `${dataDetails[position]?.assessment_id}/demo`
        : dataDetails[position]?.assessment_id;

      const dataRes = await dispatch(getAssessorBatchCandidateList(assessmentId));

      if (dataRes.status === 200 && dataRes?.data) {
        const groups = dataRes.data.groups || [];
        const candidates = dataRes.data.candidates || [];

        if (!attempt && !vivaStatus && groups.length > 0) {
          const initialIdx = returnGroupPos
            ? Math.max(0, groups.findIndex((g) => g.name === returnGroupPos))
            : 0;
          setGroupData(groups.map((g) => g.name));
          setGroupUsers(groups[initialIdx]);
          setGroupId(groups[initialIdx]?._id);
          setGroupPos(groups[initialIdx]?.name);
          setNewData(dataRes.data);
          getDemoGroupByVideoStatus(initialIdx);
          if (initialIdx > 0) {
            setTimeout(() => dropdownRef.current?.selectIndex(initialIdx), 200);
          }
        }

        await Promise.all(
          candidates.map((item) =>
            insertAssesCandidateListTable(
              item?._id,
              batch_id,
              item?.name,
              item?.viva_count,
              item?.demo_count,
              item?.candidate_id,
              item?.father_name,
              dataRes.data?.demo,
              dataRes.data?.viva,
              item?.attendance,
              item?.ojt_count,
              dataRes.data?.ojt ? 1 : 0
            )
          )
        );

        await fetchAssessCandidateListTable();
        setLoadingIndicator(false);
      } else {
        SimpleToast.show("There is No Data Present.");
      }
    } catch (error) {
      console.log("Error in apiData:", error);
      setLoadingIndicator(false);
    }
  };

  const getDemoGroupByVideoStatus = async (pos) => {
    setLoaderMessage("Fetching video status...");
    setLoadingIndicator(true);
    try {
      if (attempt || vivaStatus) {
        setLoadingIndicator(false);
        return;
      }
      const dataRes = await dispatch(getdemoGroupVideosStatus(batchIdNo));

      if (dataRes.status === 200) {
        if (dataRes?.data) {
          const groups = dataRes.data.assessmentVideo?.groups || [];
          setDemoGroupVideoDt(groups);
          setDemoGroupVideoDtdf(groups[pos]?.videos ?? []);
        }
      } else {
        SimpleToast.show("There is No Data Present.");
      }
    } catch (error) {
      console.log("getDemoGroupByVideoStatus error:", error);
    } finally {
      setLoadingIndicator(false);
    }
  };

  // ─── SQLite ────────────────────────────────────────────────────────────────
  const fetchAssessCandidateListTable = () =>
    new Promise((resolve, reject) => {
      setLoadingIndicator(true);
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM assess_candindateList_table WHERE batch_id = ?`,
          [batch_id],
          (_, results) => {
            const rows = [];
            for (let i = 0; i < results.rows.length; i++) {
              rows.push(results.rows.item(i));
            }
            if (rows.length > 0) setData(rows);
            setLoadingIndicator(false);
            resolve(rows);
          },
          (_, error) => {
            console.error("SQL SELECT error:", error);
            setLoadingIndicator(false);
            reject(error);
          }
        );
      });
    });

  const getAssessCandidateListTable = () =>
    new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM assess_candindateList_table WHERE batch_id = ?`,
          [batch_id],
          (_, results) => {
            const rows = [];
            for (let i = 0; i < results.rows.length; i++) {
              rows.push(results.rows.item(i));
            }
            if (rows.length > 0) setData(rows);
            resolve(rows);
          },
          (_, error) => reject(error)
        );
      });
    });

  // ─── Group / Video Logic ──────────────────────────────────────────────────
  const handleChange = (selectedItem, i) => {
    const groupEntry = newData.groups[i];
    setGroupUsers(groupEntry);
    setGroupId(groupEntry?._id);
    setGroupPos(groupEntry?.name);
    setDemoGroupVideoDtdf(demoGroupVideoDt[i]?.videos ?? []);
  };

  const getDemoGroupPos = async () => {
    try {
      const savedGroup = await getDemoVideoGroup(AppConfig.DEMOVIDEOGROUP);
      if (savedGroup !== null && GROUP_MAP[savedGroup] !== undefined) {
        setTimeout(() => UploadDemoV(GROUP_MAP[savedGroup]), 300);
      }
    } catch (error) {
      // silently ignore
    }
  };

  const UploadDemoV = (pos) => getDemoGroupVideoPath(pos);

  const getDemoGroupVideoPath = async (demoGroupPos) => {
    try {
      const videoPath = await getDemoVideoPath(AppConfig.DEMOGROUPVIDEOPATH);
      const videoPos = await getDemoVideoPos(AppConfig.DEMOGROUPVDPOS);

      if (videoPath !== null) {
        setLoadingIndicator(true);
        setTimeout(() => {
          if (on_off_linemode === "true") {
            getDemoGroupByVideoStatus(demoGroupPos);
          } else {
            setLoadingIndicator(false);
            GeotaggigOnVideo(videoPath, videoPos, demoGroupPos);
          }
        }, 6000);
      } else {
        setLoadingIndicator(false);
      }
    } catch (error) {
      setLoadingIndicator(false);
    }
  };

  const GeotaggigOnVideo = async (videoPath, videoNumber, pos) => {
    setLoaderMessage("Uploading video.........");
    setLoadingIndicator(true);
    console.log("--:call GeotaggigOnVideo--")
    // Read from refs so we always get the latest values even inside setTimeout
    const addr = currentAddressRef.current;
    const lat = latitudeRef.current;
    const lng = longitudeRef.current;
    const grpId = groupIdRef.current;
    const tkns = tokensRef.current;
    const timeStamp = `${timeDateFormate(new Date())}, ${addr}, Lat & Long - ${lat} & ${lng}`;

    try {
      console.log("timeStamp:", timeStamp, "| BatchIdNO:", batchIdNo, "| groupId:", grpId, "| videonumber:",videoNumber ,"| videoPath" ,videoPath ,"| tockens",tkns);
      const dataRes = await uploadVideoTagDemoGroupApi(
        timeStamp, "demo", batchIdNo, grpId, videoNumber, videoPath, tkns
      );
      console.log("--:dataRes--",dataRes)
      if (dataRes.url === undefined) {
        SimpleToast.show("Please check Internet Connection.");
      } else {
        console.log("--:dataRes.url--",dataRes.url)
        getDemoGroupByVideoStatus(pos);
      }
    } catch (error) {
      SimpleToast.show("Please check Internet Connection or Network request failed.");
    } finally {
      setLoadingIndicator(false);
    }
  };

  // ─── Video Capture ────────────────────────────────────────────────────────
  const deleteDemoVideosPath = async () => {
    await deleteDataGroup(AppConfig.DEMOVIDEOGROUP);
    await deleteDataGroup(AppConfig.DEMOGROUPVIDEOPATH);
    await deleteDataGroup(AppConfig.DEMOGROUPVDPOS);
  };

  const navigateToCapture = (optionF) => {
    const grpdata = groupUsers?.users ?? [];
    if (on_off_linemode === "true") {
      const selected = Array.isArray(dataDetails) ? dataDetails[position] : null;
      if (!selected?.btch_id) {
        console.warn("Invalid dataDetails or missing btch_id at position:", position);
        return;
      }
      navigation.navigate("AssmtRoom", {
        stmode: "1", dataDetails, position, batchIdNo, batch_id,
        DemoButtonStatus, vivaStatus, attempt, optionF, groupPos,
        roomId: `${selected.btch_id}_${groupId}_${optionF}`,
        latitude, longitude, currentAddress, dateTime,
        type: "demo", isGroup: true, grpdata,
      });
    } else {
      if (!Array.isArray(dataDetails) || !dataDetails[position]) {
        console.warn("Missing or invalid dataDetails[position] in offline mode");
        return;
      }
      navigation.navigate("VideoRecordingDemoPract", {
        dataDetails, position, batchIdNo, batch_id,
        DemoButtonStatus, vivaStatus, attempt,
        optionF, groupPos, grpdata, type: "demo",
      });
    }
  };

  const captureDemoVideo = async (videoNo) => {
    await deleteDemoVideosPath();
    const videoExists = Array.isArray(demoGroupVideoDtdf)
      ? demoGroupVideoDtdf.find((item) => item.videoNo === videoNo && item.videoExits === true)
      : null;

    console.log("--:check captureDemoVideo Exit or not--",videoExists); 
     
    if (videoExists) {
      SimpleToast.show("PRACTICAL Video Captured.");
      return;
    }
    navigateToCapture(String(videoNo));
  };

  const captureDemoVideoF = () => captureDemoVideo(1);
  const captureDemoVideoS = () => captureDemoVideo(2);
  const captureDemoVideoT = () => captureDemoVideo(3);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const geoLocation = async () => {
    // Placeholder: uses fetchLocation for actual logic
    await fetchLocation();
  };

  const onChangeText = (_text) => {};

  const hasVideoNo = (videoNo) =>
    Array.isArray(demoGroupVideoDtdf) &&
    !!demoGroupVideoDtdf.find((item) => item.videoNo === videoNo);

  // ─── Sub-components ───────────────────────────────────────────────────────
   const VideoCapture = ({ videoNo, onPress }) => (
  <View style={styles.videoCaptureContainer}>
    <TouchableOpacity onPress={onPress} style={styles.videoCaptureButton}>
      <Text style={styles.videoCaptureNumber}>{videoNo}.</Text>
      <Image
        resizeMode="contain"
        style={styles.videoCaptureIcon}
        source={DynamicImage.VideoIcon}
      />
    </TouchableOpacity>
    <View style={styles.videoCaptureStatus}>
      {hasVideoNo(videoNo) ? (
        <Image
          resizeMode="contain"
          style={styles.videoStatusIcon}
          source={DynamicImage.VideoIconShow}
        />
      ) : (
        <Text style={styles.tIds}>Tap to{"\n"}capture</Text>
      )}
    </View>
  </View>
);

  const renderGroupItem = ({ item, index }) => (
    <AssessmentItem
      Batch_Id={item?.batch_id}
      index={index}
      name={item?.name}
      vivaCount={item?.viva_count}
      demoCount={item?.demo_count}
      cand_id={item?.candidate_id}
      parent_name={item?.father_name}
      navigation={navigation}
      DemoButtonStatus={DemoButtonStatus}
      vivaStatus={false}
      attempt={attempt}
      isDemo
      isViva={item?.is_Viva}
      dataDetails={dataDetails[position]}
      data={groupUsers.users[index]}
      dataDetailsArr={dataDetails}
      id={item?._id}
      groupType="Group"
      attendance={item?.attendance === 1}
      onPress={() => navigation.navigate("AssessmentDetailsScreen")}
    />
  );

  const renderCandidateItem = ({ item, index }) => (
    <AssessmentItem
      Batch_Id={item?.batch_id}
      index={index}
      name={item?.name}
      vivaCount={item?.viva_count}
      demoCount={item?.demo_count}
      ojtCount={item?.ojt_count}
      cand_id={item?.cand_id}
      parent_name={item?.parent_name}
      navigation={navigation}
      DemoButtonStatus={DemoButtonStatus}
      vivaStatus={vivaStatus}
      attempt={attempt}
      isDemo={item?.is_Demo}
      isViva={item?.is_Viva}
      isOjt={item?.isOjt}
      dataDetails={dataDetails[position]}
      data={data[index]}
      dataDetailsArr={dataDetails}
      id={item?._id}
      groupType=""
      attendance={item?.attendance === 1}
      onPress={() => navigation.navigate("AssessmentDetailsScreen")}
    />
  );

const GroupListFooter = () => (
  <View style={styles.footerContainer}>

    {/* Refresh Row */}
    <View style={styles.refreshRow}>
      <Text style={styles.refreshMessage}>
        📹 After capturing a video, if it's not visible here — tap Refresh to update the status.
      </Text>
      <TouchableOpacity
        onPress={() => apiData()}
        style={styles.refreshButton}
      >
        <Icon name="refresh" size={14} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>

    {/* Video Capture Row */}
    <View style={styles.videoCaptureRow}>
      <VideoCapture videoNo={1} onPress={captureDemoVideoF} />
      <View style={styles.videoDivider} />
      <VideoCapture videoNo={2} onPress={captureDemoVideoS} />
      <View style={styles.videoDivider} />
      <VideoCapture videoNo={3} onPress={captureDemoVideoT} />
    </View>

  </View>
);
  

  const LoaderWithMessage = ({ message = "Fetching data, please wait..." }) => (
  <View style={styles.overlay}>
    <View style={styles.box}>
      <ActivityIndicator size="large" color={COLORS.bgBlueColor} />
      <Text style={styles.text}>{message}</Text>
    </View>
  </View>
);

  const currentDetail = dataDetails[position];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <SearchComponent
              containerStyle={styles.search}
              onChangeText={onChangeText}
            />
          </View>

          <View style={styles.det} />

          <View style={styles.viewStyle}>
            {/* Batch Info Card */}
            <View style={styles.asses}>
              <View style={[styles.rowDir, { paddingTop: normalize(10) }]}>
                <View>
                  <Text style={styles.title1}>{AppConfig.ASSESSMENT}</Text>
                  <Text style={styles.title2}>{nameFixedCharacter(currentDetail?.test_name)}</Text>
                </View>
                <View>
                  <Text style={styles.title1}>{AppConfig.BATCH_TYPE}</Text>
                  <Text style={styles.title2}>{currentDetail?.batch_type}</Text>
                </View>
                <View>
                  <Text style={styles.title1}>{AppConfig.BATCH_ID}</Text>
                  <Text style={styles.title2}>{currentDetail?.batch_id}</Text>
                </View>
              </View>

              <View style={styles.viewM} />

              <View style={[styles.rowDir, { marginHorizontal: normalize(20) }]}>
                <View style={styles.mar10}>
                  <Text style={[styles.title1, { color: COLORS.textColorsBlue }]}>{AppConfig.START_DATE}</Text>
                  <Text style={styles.title2}>{currentDetail?.start_date}</Text>
                </View>
                <View style={styles.mar10}>
                  <Text style={[styles.title1, { color: COLORS.textColorsBlue }]}>{AppConfig.END_DATE}</Text>
                  <Text style={styles.title2}>{currentDetail?.end_date}</Text>
                </View>
                <View style={styles.mar10}>
                  <Text style={[styles.title1, { color: COLORS.textColorsBlue }]}>{AppConfig.DURATION}</Text>
                  <Text style={styles.title2}>{dataDetails[0]?.duration}</Text>
                </View>
              </View>
            </View>

            {/* Group Dropdown */}
            <View style={styles.dropdown}>
              {!attempt && !vivaStatus && (
                <SelectDropdown
                  ref={dropdownRef}
                  data={groupData}
                  onSelect={handleChange}
                  defaultButtonText={groupData[0]}
                  renderButton={(selectedItem, isOpened) => (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {selectedItem || groupData[0]}
                      </Text>
                      <Icon
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        style={styles.dropdownButtonArrowStyle}
                      />
                    </View>
                  )}
                  renderItem={(item, index, isSelected) => (
                    <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: "#D2D9DF" }]}>
                      <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              )}
            </View>

            {/* Candidate / Group List */}
            <View style={styles.listContainer}>
              {!attempt && !vivaStatus ? (
                groupUsers.users?.length > 0 ? (
                  <FlatList
                    data={groupUsers.users}
                    keyExtractor={(_, index) => String(index)}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderGroupItem}
                    ListFooterComponent={GroupListFooter}
                  />
                ) : (
                  <NoData/>
                )
              ) : (
                data?.length > 0 ? (
                  <FlatList
                    data={data}
                    keyExtractor={(_, index) => String(index)}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderCandidateItem}
                    contentContainerStyle={{paddingBottom: 100}}
                  />
                ) : (
                  <NoData />
                )
              )}
            </View>
          </View>
        </View>

         {/* Loader Overlay */}
      {loadingIndicator && <LoaderWithMessage message={loaderMessage} />}
       {/* Network Checker — always mounted, self-managed */}
      <NetworkChecker />

      </SafeAreaView>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    marginTop: 15,
  },
  mar10: { marginTop: normalize(10) },
  asses: {
    borderColor: COLORS.bgBlueColor,
    borderWidth: 1,
    elevation: 2,
    marginHorizontal: 20,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  search: { flex: 1, marginRight: 30 },
  viewM: {
    borderBottomWidth: 0.7,
    alignSelf: "center",
    marginTop: 10,
    width: "85%",
    borderBottomColor: COLORS.black,
  },
  dropdown: {
    width: "100%",
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  det: {
    alignItems: "center",
    marginTop: 10,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    paddingTop: 5,
    // marginBottom: normalize(20),
    flexGrow: 1,
    borderTopLeftRadius: normalize(15),
    borderTopEndRadius: normalize(15),
  },
  listContainer: {
    flex: 1,
    paddingBottom: 10,   // ← small safe padding only
  },
  title2: {
    fontWeight: "700",
    fontSize: normalize(14),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  rowDir: {
    flexDirection: "row",
    marginHorizontal: normalize(10),
    justifyContent: "space-around",
  },
  title1: {
    fontWeight: "bold",
    fontSize: normalize(16),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
  },
  button: {
    width: "90%",
    height: 50,
    backgroundColor: "lightgray",
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  videoeHeights: {
    width: normalize(30),
    height: normalize(30),
    marginRight: 15,
    marginLeft: 5,
    marginTop: 5,
    marginHorizontal: normalize(1),
    borderColor: COLORS.blue,
  },
  tIds: {
    fontWeight: "100",
    fontSize: normalize(12),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "60%",
  },
  dropdownStyle: {
    backgroundColor: "white",
  },
  dropdownButtonStyle: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    marginHorizontal: 20,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
  },
  dropdownItemStyle: {
    width: "80%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
  },

    overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 12,
    elevation: 6,
  },
  text: {
    fontSize: normalize(14),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    marginTop: 10,
    textAlign: "center",
  },

  footerContainer: {
  marginBottom: 20,
  paddingHorizontal: 16,
  width: "90%",
  justifyContent: "center",
  marginLeft: 20,
  marginTop: 10,
},
refreshRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#EEF6FF",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#B3D4F5",
},
refreshMessage: {
  flex: 1,
  fontSize: normalize(12),
  color: "#444",
  fontFamily: "Lato-Bold",
  marginRight: 10,
  lineHeight: 18,
},
refreshButton: {
  backgroundColor: COLORS.bgBlueColor,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
},
refreshButtonText: {
  color: "#fff",
  fontSize: normalize(12),
  fontFamily: "Lato-Bold",
  marginLeft: 4,
},
videoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
},

///////
videoCaptureRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-start",
  width: "100%",
  paddingVertical: 10,
  backgroundColor: COLORS.white,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#B3D4F5",
  paddingHorizontal: 8,
},
videoCaptureContainer: {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
  paddingHorizontal: 4,
},
videoCaptureButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: 8,
},
videoCaptureNumber: {
  fontSize: normalize(14),
  fontWeight: "bold",
  color: COLORS.textColors,
  marginRight: 4,
},
videoCaptureIcon: {
  width: normalize(28),
  height: normalize(28),
  tintColor: "#2096f3",
},
videoCaptureStatus: {
  alignItems: "center",
  justifyContent: "center",
  minHeight: normalize(40),
  marginTop: 4,
},
videoStatusIcon: {
  width: normalize(28),
  height: normalize(28),
},
tIds: {
  fontWeight: "100",
  fontSize: normalize(11),
  color: COLORS.textColors,
  fontFamily: "Lato-Bold",
  textAlign: "center",
},

footerContainer: {
  marginBottom: 30,
  paddingHorizontal: 12,
  width: "95%",
  alignSelf: "center",
  marginTop: 10,
},
refreshRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#EEF6FF",
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#B3D4F5",
  width: "100%",
},
refreshMessage: {
  flex: 1,
  fontSize: normalize(12),
  color: "#444",
  fontFamily: "Lato-Bold",
  marginRight: 10,
  lineHeight: 18,
},
refreshButton: {
  backgroundColor: COLORS.blueDark,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  minWidth: normalize(85),
},
refreshButtonText: {
  color: "#fff",
  fontSize: normalize(12),
  fontFamily: "Lato-Bold",
  marginLeft: 4,
},
videoCaptureRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  width: "100%",
  paddingVertical: 16,
  paddingHorizontal: 8,
  backgroundColor: COLORS.white,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#B3D4F5",
  marginBottom: 30,
},
videoCaptureContainer: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},
videoCaptureButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
  paddingHorizontal: 6,
},
videoCaptureNumber: {
  fontSize: normalize(14),
  fontWeight: "bold",
  color: COLORS.textColors,
  marginRight: 4,
},
videoCaptureIcon: {
  width: normalize(26),
  height: normalize(26),
  tintColor: "#2096f3",
},
videoCaptureStatus: {
  alignItems: "center",
  justifyContent: "center",
  minHeight: normalize(36),
  marginTop: 6,
  paddingHorizontal: 4,
},
videoStatusIcon: {
  width: normalize(30),
  height: normalize(30),
},
videoDivider: {
  width: 1,
  height: "80%",
  backgroundColor: "#B3D4F5",
  alignSelf: "center",
},
});

export default AssessmentDetailsScreen;
