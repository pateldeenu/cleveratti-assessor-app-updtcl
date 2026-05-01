import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet, FlatList, KeyboardAvoidingView, } from "react-native";
import React, { useState } from "react";
import { Alert } from 'react-native';
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import ItemQuestion from "./ItemQuestion";
import { CustomeButton } from "../../components";
import { useDispatch } from "react-redux";
import { getAuditQuestion, postauditAnswerApi, } from "../../redux/Actions/AllContentAction";
import { useEffect } from "react";
import { createQuestTable, updateBatch_StatusWise, getBatchTableData, db, insertQuestionTable, } from "../../database/SqlLitedatabase";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import { useIsFocused } from '@react-navigation/native';
import SimpleToast from "react-native-simple-toast";


const AuditQuestionScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { assessment_id, batch_id, _id } = route.params;
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [data, setData] = useState([]);
  const [dataSubmitArr, setDataSubmitArr] = useState({});
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const initData = async () => {
      if (isFocused) {
        getData();
      }
    };
    initData();
  }, [isFocused]);

  const getData = async () => {
    await fetchQuestTable();
  };

  const QuestionApi = async () => {
    try {
      setLoadingIndicator(true);
      let dataRes = await dispatch(getAuditQuestion(_id));
      if (dataRes.status == 200) {
        //  console.log("--dataRes.data:--",dataRes.data)
        let res = dataRes.data.map((item) => {
          if (undefined !== item.hasTime) {
            insertQuestionTable(
              item?._id,
              item?.question,
              item?.hasDoc,
              item?.hasImage,
              item?.hasVideo,
              item?.hasTime,
              batch_id,
              "",
              "",
              "",
              ""
            );
            return {
              id: item?._id,
              quest: item?.question,
              hasImage: item?.hasImage,
              hasVideo: item?.hasVideo,
              hasTime: item?.hasTime,
              remarks: "",
              isSelected: false,
              hasDoc: item?.hasDoc,
            };

          } else {
            insertQuestionTable(
              item?._id,
              item?.question,
              item?.hasDoc,
              item?.hasImage,
              item?.hasVideo,
              0,
              batch_id,
              "",
              "",
              "",
              ""
            );
            return {
              id: item?._id,
              quest: item?.question,
              hasImage: item?.hasImage,
              hasVideo: item?.hasVideo,
              hasTime: 0,
              remarks: "",
              isSelected: false,
              hasDoc: item?.hasDoc,
            };
          }

        });
        setData(res);
        //consoleLog("res audit ques", res);
        await fetchQuestTable();
        setLoadingIndicator(false);
      }
    } catch (error) {
      alert(error.message);
      setLoadingIndicator(false);
    }
    setLoadingIndicator(false);
  };

  const fetchQuestTable = async () => {
    await createQuestTable();
    setLoadingIndicator(true);
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM question_table where batch_id = '${batch_id}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }

          if (temp.length > 0) {

            setData(temp);
            // console.log("has_timer:--",temp)
            setLoadingIndicator(false);
          } else {
            QuestionApi();
          }
        }
      );
    });
  };

  const finalSubmitAlert = () => {
    Alert.alert(
      'Alert',
      'Are You Sure You Want Submit. Please check all upload data Using check status',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed')
        },
        {
          text: 'OKay',
          onPress: async () => {
            //setLoadingIndicator(true);
            SimpleToast.show(`Please wait .......`);
            setIsFinalSubmit(true);
            let dataSubmitArr = {
              assessment: assessment_id,
              question: "",
              image: "",
              video: "",
              doc: "",
              remark: "",
              final_submit: true,
            };

            let dataRes = await dispatch(postauditAnswerApi(dataSubmitArr));
            if (dataRes.status == 200) {
              setLoadingIndicator(false);
              navigation.navigate("AuditBatchList")
              SimpleToast.show(`Your Audit data uploaded successfully`);
            } else {
              setLoadingIndicator(false);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <KeyboardAvoidingView style={styles.constainer}>
          <View style={styles.constainer}>
            {/* <Example />  */}
            <View style={styles.viewMargin}>
              <MenuIcon onPress={() => navigation.goBack()} back="back" />
              <Text style={styles.ques}>{"Evidence Question "}</Text>
            </View>
            <View style={styles.viewMargin1}>
              <Text style={styles.ques1}>{"Batch-Name:- " + batch_id}</Text>
            </View>

            <View style={styles.viewStyle}>

              {loadingIndicator ? (
                // 👇 Loader view
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.bluecolrHead} />
                  <Text style={styles.loaderText}>Loading...</Text>
                </View>
              ) : data?.length > 0 ? (
                <>
                  <FlatList
                    data={data}
                    style={{ flex: 1, marginBottom: 0 }}
                    keyExtractor={(i, index) => String(index)}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item, index) => {
                      return (
                        <ItemQuestion
                          setDataSubmitArr={(value) => {
                            setDataSubmitArr(value);
                          }}
                          isFinalSubmit={isFinalSubmit}
                          assessment_id={assessment_id}
                          questionId={item?.item?.q_id}
                          batch_id={item?.item?.batch_id}
                          index={item.index}
                          ques={item?.item?.quest}
                          hasImage={item?.item?.has_img}
                          hasVideo={item?.item?.has_video}
                          hasTime={item?.item?.has_time}
                          remarks={item?.item?.remarks}
                          hasDoc={item?.item?.has_doc}
                          hasVideoPath={item?.item?.has_video_path}
                          hasDocPath={item?.item?.has_doc_path}
                          navigation={navigation}
                          _id={_id}
                        />
                      );
                    }}
                  />

                  <View style={{ alignSelf: "center" }}>
                    <CustomeButton
                      textColor={ConfigColor.white}
                      label={"Submit"}
                      onPress={() => {
                        finalSubmitAlert();
                        // dataSubmitArr
                        //   ? navigateScreen()
                        //   : alert(
                        //       "Please atleast one answer and caputre the data eviendences "
                        //     );   
                      }}

                      buttonContainerStyle={[
                        styles.container,
                        {
                          backgroundColor: dataSubmitArr
                            ? COLORS.blue
                            : COLORS.gray,
                        },
                      ]}
                    />
                  </View>
                </>

              ) : (
                <NoData />
              )}

            </View>
          </View>
        </KeyboardAvoidingView>
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
    // backgroundColor: COLORS.bgBlueColor,
  },
  ques: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },

  viewMargin1: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgBlueColor,
  },

  ques1: {
    fontWeight: "500",
    fontSize: normalize(15),
    color: COLORS.black,
    lineHeight: 22,
    width: "78%",
    marginLeft: normalize(10),
    fontFamily: "Lato-Medium",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
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

  container: {
    height: 45,
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 10,
    paddingHorizontal: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuditQuestionScreen;
