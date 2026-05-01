import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import AttendanceItem from "../Attendance/AttendanceItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateFormate } from "../../utils/Utills";
import {getAssessorAssList,getLiveStreamingApi,getLiveStreamingPositionApi,} from "../../redux/Actions/AllContentAction";
import SimpleToast from "react-native-simple-toast";
import { getLocation } from "../../utils/helper";
import { useFocusEffect } from '@react-navigation/native';

const LiveBatch = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [data, setData] = useState([]);
  const [livStreamData, setLiveStreamData] = useState();
  const [locationLoading, setLocationLoading] = useState(false);
  const [lat, setLat] = React.useState();
  const [long, setLong] = React.useState();

  const getApi = async () => {
    setLoadingIndicator(true);
    try {
      let dataRes = await dispatch(getAssessorAssList("today"));

      if (dataRes.status == 200) {
        let res = dataRes.data.map((item) => {
          return {
            assessor: item?.assessor,
            audit_status: item?.audit_status,
            batch_id: item?.batch?.batch_id,
            Channel_id: item?.batch?._id,
            start_date: item.start_date,
            end_date: item.end_date,
          };
        });
        // console.log("live res---", res);
        // getSreamLiveApi(res?.batch_id)
        setData(res);
        setLoadingIndicator(false);
      }
    } catch (error) {
      // alert(error.message);
      setLoadingIndicator(false);
    }
    setLoadingIndicator(false);
  };


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

      setLat(result?.geometry?.location?.lat);
      setLong(result?.geometry?.location?.lng);
      setLocationLoading(false);

    } catch (error) {
      console.log("Error fetching location", error);
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

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: normalize(18),
                  color: COLORS.black,
                  ...FONTS.h2,
                  alignSelf: "center",
                  justifyContent: "center",
                  width: "70%",
                  textAlign: "center",
                },
              ]}
            >
              {"Live Batch List"}
            </Text>
          </View>
          {/* <View style={{ marginBottom: 60 }}> */}
          <View style={styles.viewStyle}>
            
            {loadingIndicator ? (
              // 👇 Loader view
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.bluecolrHead} />
                <Text style={styles.loaderText}>Loading...</Text>
              </View>
            ) : data?.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={(i, index) => String(index)}
                showsVerticalScrollIndicator={false}
                renderItem={(item, index) => {
                  return (
                    <AttendanceItem
                      index={item.index}
                      Batch_Id={item.item.batch_id}
                      startDate={dateFormate(item.item.start_date)}
                      endDate={dateFormate(item.item.end_date)}
                      live={"live"}
                      onPress={async () => {
                        try {
                          await dispatch(getLiveStreamingPositionApi(data[0].assessor, lat, long));

                          let res = await dispatch(getLiveStreamingApi(item.item.Channel_id, "publisher"));

                          if (res.data.rtcToken) {
                            navigation.navigate("LiveStreaming", {
                              batch_id: item.item.Channel_id,
                              rtcToken: res.data.rtcToken,
                              appId: res.data.appId,
                              batch_id_show: item?.item?.batch_id,
                            })
                          }

                        } catch (error) {
                          SimpleToast.show(error);
                        }

                      }}
                    />
                  );
                }}
              />

            ) : (
              <NoData />
            )}

          </View>
        </View>
        {/* <Loader text={"Please wait..."} loading={loadingIndicator} /> */}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 25,
    marginBottom: 60,
    flexGrow: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  mainLogo: {
    opacity: 0.2,
    marginTop: 90,
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
  textStyle: {
    fontFamily: FONTS.fontFamily,
    marginLeft: 20,
    fontWeight: "400",
    fontSize: 15,
    textAlign: "center",
    color: COLORS.colorText,
    marginVertical: -16,
    paddingTop: 20,
  },
  common: {
    flexDirection: "row",
    marginTop: 30,
    marginHorizontal: 40,
  },
});

export default LiveBatch;
