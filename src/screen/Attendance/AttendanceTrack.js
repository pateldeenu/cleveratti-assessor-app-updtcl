import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator, // 👈 import loader
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import ApiUrl from "../../utils/UrlConfig";
import NoData from "../../components/Nodata";
import TrackItem from "./TrackItem";
import {
  dateFormate,
  dateFormateDate,
  getData,
  get_time_diff,
  timeFormate,
} from "../../utils/Utills";
import SimpleToast from "react-native-simple-toast";
import CalenderCOmp from "../../components/Componentes/CalenderCOmp";
import { useDispatch } from "react-redux";
import { getAttendanceApi } from "../../redux/Actions/AllContentAction";
import { AppConfig } from "../AssessmentDetails/Utils";

const AttendanceTrack = ({ navigation }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [canImage, setCanImage] = useState(ApiUrl.defaultImageUrl);
  const [loadingIndicator, setLoadingIndicator] = useState(false); // loader state
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [name, setName] = useState("");

  const getTrackAttendance = async () => {
    setLoadingIndicator(true); // show loader
    try {
      let dataRes = await dispatch(
        getAttendanceApi("", fromDate, toDate, "track")
      );
      if (dataRes.status == 200) {
        setData(dataRes?.data);
        setCanImage(dataRes?.data?.data[0]?.in_image);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIndicator(false); // hide loader
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let name = await getData(AppConfig.NAME);
      setName(name);
      getTrackAttendance();
    };
    fetchData();
  }, [toDate, fromDate]);

  const dateChangeGrabber = async ({ type, value }) => {
    let from, to;
    if (type === "from") {
      from = value;
      to = toDate;
    } else {
      to = value;
      from = fromDate;
    }
    if (from > to) {
      SimpleToast.show(`From cannot be greater than To`);
      return;
    }
  };

  return (
    <View style={styles.constainer}>
      <View style={styles.viewMargin}>
        <MenuIcon onPress={() => navigation.goBack()} back="back" />
        <Text style={[styles.head]}>{AppConfig.TRACK_ATTENDANCE}</Text>
      </View>

      {/* ✅ Show Loader when API is fetching */}
      {loadingIndicator ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.bluecolrHead} />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.constainer}>
          <View style={styles.viewStyle}>
            <View style={styles.name}>
              <Text style={[styles.title1]}>{name}</Text>
            </View>

            <View style={styles.viewH} />
            <View style={styles.mainView}>
              <View>
                <Text style={[styles.title1]}>{"Total Days"}</Text>
                <Text style={styles.days}>{"30"}</Text>
              </View>
              <View style={styles.line} />
              <View>
                <Text style={[styles.title1]}>{AppConfig.PRESENT}</Text>
                <Text style={styles.days}>{data?.present_days}</Text>
              </View>
              <View style={styles.line} />
              <View>
                <Text style={[styles.title1]}>{AppConfig.ABSENT}</Text>
                <Text style={styles.days}>{30 - data?.present_days}</Text>
              </View>
              <View style={styles.line} />
            </View>
            <View style={styles.mainC} />

            <View style={styles.viewStyle}>
              <View style={styles.row}>
                <View style={{ width: "45%" }}>
                  <CalenderCOmp
                    title={"Start date"}
                    text={"From"}
                    onChangeDate={(d) => {
                      setFromDate(d);
                    }}
                    givenDate={new Date()}
                  />
                </View>
                <View style={{ width: "45%" }}>
                  <CalenderCOmp
                    title={"End date"}
                    text={"To"}
                    givenDate={new Date()}
                    onChangeDate={(d) => {
                      setToDate(d);
                    }}
                  />
                </View>
              </View>

              <View style={styles.view1}>
                <Text style={styles.item}>{AppConfig.BATCH_ID}</Text>
                <Text style={styles.item}>
                  {AppConfig.ATTENDANCE + " " + AppConfig.DATE}
                </Text>
                <Text style={styles.item}>{"In Time 24-hours"}</Text>
                <Text style={styles.item}>{"Out Time 24-hours"}</Text>
                <Text style={styles.item}>
                  {AppConfig.DURATION + "\n(H:M:S)"}
                </Text>
              </View>
              {data?.data?.length > 0 ? (
                <FlatList
                  data={data?.data}
                  keyExtractor={(i, index) => String(index)}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item, index) => {
                    return (
                      <TrackItem
                        index={item.index}
                        Batch_Id={item?.item?.batch?.batch_id}
                        center_name={item.item.address_in}
                        date={dateFormateDate(item.item.in_time)}
                        in_time={timeFormate(item.item.in_time)}
                        out_time={timeFormate(item.item.out_time)}
                        duration={get_time_diff(
                          item.item.in_time,
                          item.item.out_time
                        )}
                      />
                    );
                  }}
                />
              ) : (
                <NoData />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
   loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgBlueColor,
  },
  loaderText: {
    marginTop: 10,
    color: COLORS.textColors,
    fontSize: normalize(14),
  },
  mainView: {
    width: "100%",
    marginHorizontal: normalize(30),
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: normalize(10),
  },
  viewH: {
    height: 1,
    alignSelf: "center",
    backgroundColor: "#000",
    width: "100%",
    opacity: 0.4,
    marginTop: 35,
  },
  AbsView: {
    marginLeft: normalize(30),
    width: normalize(15),
    marginTop: normalize(15),
    height: normalize(15),
  },
  name: { flexDirection: "row", marginLeft: normalize(20) },
  days: {
    fontWeight: "700",
    fontSize: normalize(14),
    fontFamily: "Lato-Bold",
    paddingHorizontal: 15,
    color: COLORS.textColors,
    borderRadius: 14,
    paddingVertical: 5,
  },
  prese: {
    fontWeight: "normal",
    fontSize: normalize(15),
    marginTop: normalize(12),
    marginLeft: normalize(20),
    color: COLORS.textColors,
    fontFamily: "Lato",
  },
  PRES: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
  },
  rows: {
    flexDirection: "row",
  },
  mainC: {
    height: 1,
    alignSelf: "center",
    backgroundColor: "#000",
    width: "100%",
    opacity: 0.5,
  },
  chart: {
    marginTop: normalize(-25),
    marginLeft: normalize(20),
    flexDirection: "row",
  },

  view1: {
    flexDirection: "row",
    backgroundColor: COLORS.bluecolrHead,
    height: normalize(45),
    alignItems: "center",
    justifyContent: "space-around",
  },
  viewP: {
    marginLeft: normalize(30),
    width: normalize(15),
    marginTop: normalize(15),
    height: normalize(15),
  },
  item: {
    fontSize: normalize(14),
    color: "white",
    fontWeight: "700",
    width: 80,
    textAlign: "center",
  },
  opacity: { marginTop: normalize(20), opacity: 0.5 },
  touch: {
    position: "absolute",
    top: 170,
    right: 10,
    elevation: 3,
    backgroundColor: "#f44336",
    marginLeft: normalize(80),
    borderRadius: 14,
    height: 30,
    width: 90,
    alignSelf: "center",
  },
  line: {
    height: 35,
    alignSelf: "center",
    backgroundColor: "#000",
    width: 1,
    opacity: 0.5,
    marginLeft: normalize(20),
  },
  main: {
    marginTop: -15,
  },
  centerAlign: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },

  dir: { flexDirection: "row" },
  iconStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
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
    paddingTop: normalize(20),
    marginTop: 10,
    flex: 1,

    borderTopLeftRadius: normalize(20),
    borderTopEndRadius: normalize(20),
  },
  abs: {
    fontWeight: "normal",
    fontSize: normalize(15),
    marginTop: normalize(12),
    marginLeft: normalize(20),
    color: COLORS.textColors,
    fontFamily: "Lato",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginLeft: 10,
    bottom: 20,
  },

  viewArr: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    zIndex: 1,
    borderRadius: 40 / 2,
    borderWidth: 2,
    borderColor: "#3B45FF",
    marginRight: 20,
    opacity: 0,
  },

  head: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: 22,
    // textDecorationLine: "underline",
  },
  title2: {
    fontWeight: "700",
    fontSize: normalize(14),
    fontFamily: "Lato-Bold",
    paddingHorizontal: 15,
    color: COLORS.white,
    borderRadius: 14,
    paddingVertical: 5,
    marginTop: 30,
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
    top: -1,
  },
});

export default AttendanceTrack;