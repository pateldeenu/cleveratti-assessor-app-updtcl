import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import AttendanceItem from "./AttendanceItem";
import { useDispatch } from "react-redux";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import { dateFormate } from "../../utils/Utills";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AppConfig } from "../AssessmentDetails/Utils";

const AttendanceListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { track } = route.params;
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [data, setData] = useState([]);

  const getApi = async () => {
    setLoadingIndicator(true);
    try {
      let dataRes = await dispatch(getAssessorAssList("today"));
      if (dataRes.status == 200) {
        setData(dataRes?.data);
        setLoadingIndicator(false);
      }
    } catch (error) {
      alert(error.message);
      setLoadingIndicator(false);
    }
    setLoadingIndicator(false);
  };

  useEffect(() => {
    // do not mark async directly
    const fetchData = async () => {
      await getApi();
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // runs every time screen is focused
      getApi();
    }, [])
  );

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.attenList}>{AppConfig.BATCH_LIST}</Text>
          </View>

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
                      assessor_attendance={
                        item?.item?.batch?.assessor_attendance
                          ?.in_time_status &&
                        item?.item?.batch?.assessor_attendance?.out_time_status
                      }
                      viewAttendance={track}
                      Batch_Id={item?.item?.batch?.batch_id}
                      startDate={dateFormate(item?.item?.start_date)}
                      endDate={dateFormate(item?.item?.end_date)}
                      onPress={() =>
                        track
                          ? navigation.navigate("AttendanceTrack", {
                            batchId: item?.item?.batch?._id,
                          })
                          : navigation.navigate("AttendanceDetails", {
                            batchId: item?.item?.batch?._id,
                            batch_Id: item?.item?.batch?.batch_id
                          })
                      }
                    />
                  );
                }}
              />
            ) : (
              <NoData />
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    marginBottom: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewMargin: {
    marginTop: 10,
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

  attenList: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },
});

export default AttendanceListScreen;
