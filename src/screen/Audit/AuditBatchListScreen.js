import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import BatchItem from "./BatchItem";
import { useDispatch } from "react-redux";
import { dateFormate } from "../../utils/Utills";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import { AppConfig } from "../AssessmentDetails/Utils";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const AuditBatchListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      getApi();
      console.log("--:call api--")
    }, [])
  )

  const getApi = async () => {
    setLoadingIndicator(true);
    try {
      //let dataRes = await dispatch(getAssessorAssList("all"));
      let dataRes = await dispatch(getAssessorAssList("today"));
      //console.log("--:dataRes.data--",dataRes.data);
      if (dataRes.status == 200) {
        let res = dataRes.data.map((item) => {
          return {
            assessment_id: item?._id,
            audit_status: item?.audit_status, // Default to "Unknown" if null/undefined
            batch_id: item?.batch?.batch_id ?? "Invalid Batch ID", // Handle null/undefined
            start_date: dateFormate(item?.start_date) ?? "No Start Date", // Default if missing
            end_date: dateFormate(item?.end_date) ?? "No End Date", // Default if missing
            _id: item?.batch?._id ?? "N/A" // Handle missing _id
          };

        });
        setData(res);
        //console.log("res data items:--", res);
        setLoadingIndicator(false);
      }
    } catch (error) {
      //console.log("error--", error);
      alert(error.message);
      setLoadingIndicator(false);
    }
    setLoadingIndicator(false);
  };


  return (
    <>
      <SafeAreaView style={styles.constainer1}>
        <View style={styles.constainer}>

          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.batchV}>{AppConfig.BATCH_LIST}</Text>
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
                    <BatchItem
                      index={item.index}
                      audit_status={item?.item?.audit_status}
                      Batch_Id={item?.item?.batch_id}
                      startDate={item?.item?.start_date}
                      endDate={item?.item?.end_date}
                      onPress={() =>
                        navigation.navigate("AuditQuestion", {
                          assessment_id: item?.item?.assessment_id,
                          batch_id: item?.item?.batch_id,
                          _id: item?.item?._id
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
  batchV: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },
  constainer1: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
    marginBottom: 21,
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
    marginBottom: 30,
  },
});

export default AuditBatchListScreen;
