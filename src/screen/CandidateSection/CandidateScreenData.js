// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { COLORS, FONTS } from "../../constants/Theme";
// import { CustomeButton } from "../../components";
// import normalize from "react-native-normalize";
// import MenuIcon from "../../components/MenuIcon";
// import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
// import { getData } from "../../utils/Utills";
// import { useDispatch } from "react-redux";
// import NetInfo from "@react-native-community/netinfo";

// import {
//   getLiveStreamingApi,
//   getCandidateProfileApi,
//   getCandidateExamList,
// } from "../../redux/Actions/AllContentAction";

// const CandidateScreenData = ({ navigation, route }) => {
//   const { assessment_id, attempted, screen } = route.params;

//   const [data, setData] = useState([]);
//   const [loadingIndicator, setLoadingIndicator] = useState(false);
//   const [rtcToken, setRtcToken] = useState("");
//   const [candId, setCandId] = useState("");
//   const [isConnected, setIsConnected] = useState(true);

//   const dispatch = useDispatch();

//   // =========================
//   // NETWORK LISTENER
//   // =========================
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       const connected = state.isConnected;
//       setIsConnected(connected);

//       if (connected) {
//         fetchProfile();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // =========================
//   // INITIAL LOAD
//   // =========================
//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     await candIdAsyn();
//     fetchProfile();
//   };

//   // =========================
//   // GET TOKEN
//   // =========================
//   const candIdAsyn = async () => {
//     try {
//       let getId = await getData(AppConfig._id);
//       setCandId(getId);

//       let resv = await dispatch(getLiveStreamingApi(getId, "audience"));
//       setRtcToken(resv?.data?.rtcToken || "");
//     } catch (e) {
//       console.log("RTC Error:", e);
//     }
//   };

//   // =========================
//   // FETCH PROFILE
//   // =========================
//   const fetchProfile = async (retry = true) => {
//     try {
//       setLoadingIndicator(true);

//       let res = await dispatch(getCandidateExamList());

//       if (res?.status === 200) {
//         setData(res.data);
//         console.log("--:res.data--",res);
//       }
//     } catch (error) {
//       console.log("Profile Error:", error);

//       if (retry) {
//         setTimeout(() => fetchProfile(false), 3000);
//       }
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.constainer}>
//       {/* HEADER */}
//       <View style={styles.viewMargin}>
//         <MenuIcon onPress={() => navigation.goBack()} back="back" />
//         <Text style={styles.head}>Candidate Details</Text>
//       </View>

//       <View style={styles.constainer}>
//         <View style={styles.viewStyle}>

//           {/* LOADER */}
//           {loadingIndicator ? (
//             <View style={styles.centerBox}>
//               <ActivityIndicator size="large" color="#1E88E5" />
//               <Text style={styles.infoText}>Loading...</Text>
//             </View>
//           ) : !isConnected ? (
//             <View style={styles.centerBox}>
//               <Text style={styles.errorText}>
//                 No Internet Connection
//               </Text>
//             </View>
//           ) : data.length === 0 ? (
//             <View style={styles.centerBox}>
//               <Text style={styles.infoText}>
//                 No Data Available
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.arrV}>

//               {/* NAME */}
//               <View style={[styles.mar10, styles.viewRow]}>
//                 <Text style={[styles.tIds, styles.tIds2]}>
//                   {AppConfig.STUDENT_NAME}
//                 </Text>
//                 <Text style={styles.tIds}>
//                   {data[0]?.name || "-"}
//                 </Text>
//               </View>

//               {/* ID */}
//               <View style={[styles.mar10, styles.viewRow]}>
//                 <Text style={[styles.tIds, styles.tIds2]}>
//                   Student Id
//                 </Text>
//                 <Text style={styles.tIds}>
//                   {data[0]?.candidateId || "-"}
//                 </Text>
//               </View>

//               {/* PARENT */}
//               <View style={[styles.mar10, styles.viewRow]}>
//                 <Text style={[styles.tIds, styles.tIds2]}>
//                   {AppConfig.Parent_Name}
//                 </Text>
//                 <Text style={styles.tIds}>
//                   {data[0]?.ParentName || "-"}
//                 </Text>
//               </View>

//               {/* MOBILE */}
//               <View style={[styles.mar10, styles.viewRow]}>
//                 <Text style={[styles.tIds, styles.tIds2]}>
//                   Mobile Number
//                 </Text>
//                 <Text style={styles.tIds}>
//                   {data[0]?.mobile || "-"}
//                 </Text>
//               </View>

//               {/* BUTTONS */}
//               <View style={[styles.cent, { flexDirection: "row" }]}>

//                 {screen === "TheoryScreen" && (
//                   <CustomeButton
//                     isdisabled={attempted}
//                     label={attempted ? "Attempted" : "Attempt Theory"}
//                     textColor={ConfigColor.white}
//                     onPress={() =>
//                       navigation.navigate("CandidateInstruction", {
//                         assessment_id,
//                       })
//                     }
//                     buttonContainerStyle={styles.container}
//                   />
//                 )}

//                 {screen === "AssessorFeedbackScreen" && (
//                   <CustomeButton
//                     isdisabled={attempted}
//                     label={attempted ? "Attempted" : "Assessor Feedback"}
//                     textColor={ConfigColor.white}
//                     onPress={() =>
//                       navigation.navigate("CandidateFeedback", {
//                         id: assessment_id,
//                         screen_type: "AssessorFeedbackScreen",
//                       })
//                     }
//                     buttonContainerStyle={styles.container}
//                   />
//                 )}

//                 {screen === "AssessmentFeedbackScreen" && (
//                   <CustomeButton
//                     isdisabled={attempted}
//                     label={
//                       attempted ? "Attempted" : "Assessment Feedback"
//                     }
//                     textColor={ConfigColor.white}
//                     onPress={() =>
//                       navigation.navigate("CandidateFeedback", {
//                         id: assessment_id,
//                         screen_type: "AssessmentFeedbackScreen",
//                       })
//                     }
//                     buttonContainerStyle={styles.container}
//                   />
//                 )}
//               </View>
//             </View>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default CandidateScreenData;

// const styles = StyleSheet.create({
//   constainer: {
//     width: "100%",
//     backgroundColor: COLORS.bgBlueColor,
//     flex: 1,
//   },

//   viewMargin: {
//     marginTop: 10,
//     flexDirection: "row",
//   },

//   head: {
//     alignSelf: "center",
//     color: "#4284f3",
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 10,
//   },

//   viewStyle: {
//     backgroundColor: COLORS.white,
//     marginTop: 10,
//     paddingTop: 20,
//     marginBottom: normalize(120),
//     flexGrow: 1,
//     borderTopLeftRadius: normalize(15),
//     borderTopEndRadius: normalize(15),
//   },

//   arrV: {
//     marginVertical: 8,
//     borderRadius: 8,
//     elevation: 5,
//     marginHorizontal: normalize(10),
//     width: "95%",
//     borderWidth: 1.5,
//     borderColor: COLORS.bluecolrHead,
//     backgroundColor: "#fff",
//     paddingBottom: 10,
//   },

//   mar10: {
//     marginTop: normalize(10),
//   },

//   viewRow: {
//     backgroundColor: "#F5FCFF",
//     flexDirection: "row",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },

//   tIds2: {
//     width: "50%",
//     color: "#444",
//   },

//   tIds: {
//     width: "50%",
//     fontWeight: "700",
//     fontSize: normalize(16),
//     color: COLORS.textColors,
//   },

//   cent: {
//     alignSelf: "center",
//   },

//   container: {
//     height: 45,
//     borderRadius: 14,
//     marginHorizontal: 20,
//     backgroundColor: COLORS.blue,
//     marginVertical: 20,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   centerBox: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//   },

//   infoText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#555",
//   },

//   errorText: {
//     fontSize: 15,
//     color: "#E53935",
//     fontWeight: "600",
//   },
// });





import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import { CustomeButton, SearchComponent } from "../../components";
import normalize from "react-native-normalize";
import MenuIcon from "../../components/MenuIcon";
import { createCandidateBatchTable, db } from "../../database/SqlLitedatabase";
import { AppConfig, ConfigColor } from "../AssessmentDetails/Utils";
import { getData } from "../../utils/Utills";
import { useDispatch } from "react-redux";
import { getCandidateInstruction, getLiveStreamingApi } from "../../redux/Actions/AllContentAction";

const CandidateScreenData = ({ navigation, route }) => {
  const { assessment_id, attempted, screen } = route.params;
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [rtcToken, setRtcToken] = useState('')
  const [candId, setCandId] = useState('')

  const dispatch = useDispatch();
  const candIdAsyn = async () => {
    let getId = await getData(AppConfig._id);
    setCandId(getId)
    let resv = await dispatch(getLiveStreamingApi(getId, 'audience'));
    setRtcToken(resv.data.rtcToken);
  }

  useEffect(() => {
    candIdAsyn()
    fetchCandLogintbl();
  }, []);

  const fetchCandLogintbl = async () => {
    setLoadingIndicator(true);
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM table_login", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        if (temp.length > 0) {
          setData(temp);
          console.log("--temp:--", temp);
          setLoadingIndicator(false);
        }
      });
    });
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          <Text style={[styles.head]}>{"Candidate Details"}</Text>
        </View>
        <View style={styles.constainer}>
          <View style={styles.viewStyle}>
            <View style={styles.arrV}>
              <View style={[styles.mar10, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>
                  {AppConfig.STUDENT_NAME}
                </Text>
                <Text style={[styles.tIds]}>{data[0]?.name}</Text>
              </View>
              <View style={[styles.mar10, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"Student Id"}</Text>
                <Text style={[styles.tIds]}>{data[0]?.candidateId}</Text>
              </View>

              <View style={[styles.mar10, styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>{"User Name"}</Text>
                <Text style={[styles.tIds]}>{data[0]?.user_name}</Text>
              </View>
              <View style={[styles.mar10, , styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>
                  {AppConfig.Parent_Name}
                </Text>
                <Text style={[styles.tIds]}>{data[0]?.ParentName}</Text>
              </View>
              <View style={[styles.mar10, , styles.viewRow]}>
                <Text style={[styles.tIds, styles.tIds2]}>
                  {"Mobile Number"}
                </Text>
                <Text style={[styles.tIds]}>{data[0]?.mobile}</Text>
              </View>

              <View style={[styles.cent, { flexDirection: 'row' }]}>
                {/* <CustomeButton
                  textColor={ConfigColor.white}
                  label={'Attempt VIVA'}
                  onPress={() =>
                    navigation.navigate("CadidateVivaScreen", {
                      assessment_id,
                      rtcToken,
                      candId

                    })
                  }
                  buttonContainerStyle={styles.container}
                /> */}
                {/* <CustomeButton
                  isdisabled={attempted}
                  label={attempted ? "Attempted" : "Attempt Theory"}
                  textColor={ConfigColor.white}
                  onPress={() =>
                    navigation.navigate("CandidateInstruction", {
                      assessment_id,
                    })
                  }
                  buttonContainerStyle={styles.container}
                /> */}

                {screen === "TheoryScreen" && (
                  <CustomeButton
                    isdisabled={attempted}
                    label={attempted ? "Attempted" : "Attempt Theory"}
                    textColor={ConfigColor.white}
                    onPress={() =>
                      navigation.navigate("CandidateInstruction", {
                        assessment_id,
                      })
                    }
                    buttonContainerStyle={styles.container}
                  />
                )}

                {screen === "AssessorFeedbackScreen" && (
                  <CustomeButton
                    isdisabled={attempted}
                    label={attempted ? "Attempted" : "Assessor Feedback"}
                    textColor={ConfigColor.white}
                    onPress={() => {
                      console.log("Pressed");
                      navigation.navigate("CandidateFeedback", {
                        id: assessment_id,
                        screen_type: "AssessorFeedbackScreen"
                      });
                    }}
                    buttonContainerStyle={styles.container}
                  />
                )}

                {screen === "AssessmentFeedbackScreen" && (
                  <CustomeButton
                    isdisabled={attempted}
                    label={attempted ? "Attempted" : "Assessment Feedback"}
                    textColor={ConfigColor.white}
                    onPress={() =>
                      // navigation.navigate("CandidateFeedback", { id: assessment_id, screen_type: "AssessmentFeedbackScreen" })
                      navigation.navigate("CandidateFeedback", {
                        id: assessment_id,
                        screen_type: "AssessmentFeedbackScreen"
                      })
                    }
                    buttonContainerStyle={styles.container}
                  />
                )}
              </View>
            </View>
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
  },
  mar10: { marginTop: normalize(10) },
  arrV: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 5,
    marginHorizontal: normalize(10),
    width: "95%",
    borderWidth: 2,
    borderColor: COLORS.bluecolrHead,
    backgroundColor: "#fff",
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
  },
  mainLogo: {
    opacity: 0.2,
    marginTop: 90,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    paddingTop: 20,
    marginBottom: normalize(120),
    flexGrow: 1,
    height: "100%",

    borderTopLeftRadius: normalize(15),
    borderTopEndRadius: normalize(15),
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 40,
  },
  cent: { alignSelf: "center" },
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

  head: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
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
  common: {
    flexDirection: "row",
    marginTop: 30,
    marginHorizontal: 40,
  },
  container: {
    height: 45,
    borderRadius: 14,
    marginHorizontal: 20,
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tIds2: {
    marginLeft: normalize(20),
    width: "50%",
  },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "50%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
  },
});

export default CandidateScreenData;
