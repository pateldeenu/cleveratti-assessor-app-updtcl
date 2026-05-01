import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import { SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import ItemToday from "./ItemToday";
import { useDispatch } from "react-redux";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import { consoleLog, dateFormate, deleteDataGroup } from "../../utils/Utills";
import normalize from "react-native-normalize";
import SimpleToast from "react-native-simple-toast";
import { createAssess_batchTable, db, insertAssbatchTable, } from "../../database/SqlLitedatabase";
import { AppConfig } from "../AssessmentDetails/Utils";

const TodayAssessment = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [todayass_batchListDb, setDatatodayAssbatchDb] = useState([]);
  const DemoButtonStatus = true;

  // ✅ Run only once on mount
  useEffect(() => {
    const init = async () => {
      await fetchassessbatchTabl();
      await deleteDemoVideosPath();
    };
    init();
  }, []);

  const formatCandidateKyc = (candidateKyc) => {
    try {
      return JSON.stringify(candidateKyc);
    } catch {
      return "[]";
    }
  };

  const getAssessmentBatchApi = async () => {
    setLoadingIndicator(true);
    try {
      let dataRes = await dispatch(getAssessorAssList("today"));
      await createAssess_batchTable();

      if (dataRes?.status === 200) {
        dataRes.data.forEach((item) => {
          insertAssbatchTable(
            item?._id,
            item?.batch?._id,
            item?.batch?.batch_id,
            item?.name,
            dateFormate(item?.start_date),
            dateFormate(item?.end_date),
            item?.strategy?.duration,
            item?.batch?.batch_type?.name,
            item?.audit_status,
            item?.demoGroup ?? "null",
            formatCandidateKyc(item?.candidate_kyc)
          );
        });

        await fetchassessbatchTabl();
      } else {
        SimpleToast.show("There is No Data Present.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingIndicator(false);
    }
  };

  // ✅ fetch assess batch id list
  const fetchassessbatchTabl = async () => {
    setLoadingIndicator(true);
    await createAssess_batchTable();

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM assess_batch_table", [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        if (temp.length > 0) {
          setDatatodayAssbatchDb(temp);
          setLoadingIndicator(false);
        } else {
          getAssessmentBatchApi();
        }
      });
    });
  };

  const onChangeText = (SearchText) => {
    consoleLog("SearchText", SearchText);
  };

  // ✅ delete data capture demogroupwise related
  const deleteDemoVideosPath = async () => {
    await deleteDataGroup(AppConfig.DEMOVIDEOGROUP);
    await deleteDataGroup(AppConfig.DEMOGROUPVIDEOPATH);
    await deleteDataGroup(AppConfig.DEMOGROUPVDPOS);
  };

  return (
    <SafeAreaView style={styles.constainer}>
      <View style={styles.constainer}>
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          <SearchComponent
            containerStyle={{ flex: 1, marginRight: 30 }}
            onChangeText={onChangeText}
          />
        </View>
        <View style={styles.viewStyle}>
          <View style={{ alignItems: "center" }}>
            <Text style={[{ ...FONTS.h3 }, styles.text]}>
              {"Today's Assessment"}
            </Text>
          </View>

          <View style={styles.viewStyle}>

            {loadingIndicator ? (
              // 👇 Loader view
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.bluecolrHead} />
                <Text style={styles.loaderText}>Loading...</Text>
              </View>
            ) : todayass_batchListDb?.length > 0 ? (

              <FlatList
                data={todayass_batchListDb}
                keyExtractor={(i, index) => String(index)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <ItemToday
                    index={index}
                    Batch_Id={item?.batch_id}
                    Batch_name={item?.batch_type}
                    test_name={item?.test_name}
                    startDate={item?.start_date}
                    endDate={item?.end_date}
                    duration={item?.duration}
                    BatchType={item?.batch_type}
                    demoGroupStatus={item?.dm}
                    auditStatus={item?.ass_batch_at_status}
                    onPress={() =>
                      navigation.navigate("AssessmentDetailsScreen", {
                        dataDetails: todayass_batchListDb,
                        position: index,
                        batchIdNo: item?.btch_id,
                        batch_id: item?.batch_id,
                        vivaStatus: true,
                      })
                    }
                    onPressTwo={() =>
                      navigation.navigate("AssessmentDetailsScreen", {
                        dataDetails: todayass_batchListDb,
                        position: index,
                        batchIdNo: item?.btch_id,
                        batch_id: item?.batch_id,
                        DemoButtonStatus: DemoButtonStatus,
                        vivaStatus: false,
                      })
                    }
                    onPressAttempt={() =>
                      navigation.navigate("AssessmentDetailsScreen", {
                        dataDetails: todayass_batchListDb,
                        position: index,
                        batchIdNo: item?.btch_id,
                        batch_id: item?.batch_id,
                        attempt: true,
                      })
                    }
                  />
                )}
              />
            ) : (
              <NoData />
            )}

          </View>
        </View>
      </View>
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
    backgroundColor: COLORS.bgBlueColor,
    marginTop: 15,
    flexGrow: 1,
    marginBottom: 50,
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: normalize(22),
    fontWeight: "bold",
  },
});

export default TodayAssessment;
