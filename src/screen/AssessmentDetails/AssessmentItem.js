import React, { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { COLORS } from "../../constants/Theme";
import McqDialog from "./DialogComponent/McqDialog";
import { useDispatch } from "react-redux";
import { postAttendaceApi } from "../../redux/Actions/AllContentAction";
import { consoleLog } from "../../utils/Utills";
import { AppConfig, ConfigColor } from "./Utils";

const AssessmentItem = ({
  name,
  enrolment_no,
  tp,
  cand_id,
  parent_name,
  index,
  navigation,
  onPress,
  isViva = false,
  dataDetails,
  data,
  attendance,
  vivaCount,
  demoCount,
  ojtCount,
  dataDetailsArr,
  id,
  DemoButtonStatus,
  vivaStatus,
  attempt,
  isDemo,
  isOjt,
  groupType
}) => {
  const [isAbsentSelected, setAbsentSelected] = useState(true);
  const [isPrsesentSelected, setPresentSelected] = useState(attendance);
  const [dialogVisible, setDialogVisible] = useState(false);
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  //console.log("attempt---", attempt)
  //console.log("vivaCount---", vivaCount)
  //console.log("--:ojtCount--", ojtCount)
  //console.log("--:demoCount--", demoCount)

   //console.log("--:isDemo--", isDemo)
  //  console.log("--:isViva--", isViva)
  //  console.log("--:isOjt--", isOjt)

  // console.log("--:groupType--", groupType)

  const attendabceApi = async (isAttendace) => {
    setLoadingIndicator(true);
    try {
      let dataRes = await dispatch(postAttendaceApi(id, isAttendace));
      if (dataRes.status == 200) {
        console.log("--:dataRes.status--",dataRes)
        setLoadingIndicator(false);
      } else {
      }
    } catch (eror) {
      setLoadingIndicator(false);
    }
    setLoadingIndicator(false);
  };

  useEffect(() => {
    if (attendance) {
      setAbsentSelected(false);
    }
  }, []);

  return (
    <View style={[styles.viewStyle, { borderColor: COLORS.blue }]}>
      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
            { color: COLORS.textColors },
          ]}
        >
          {"Name  "}
        </Text>
        <Text style={[styles.tIds]}>{name}</Text>
      </View>
      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
          ]}
        >
          {"Parent Name  "}
        </Text>
        <Text style={[styles.tIds]}>{parent_name}</Text>
      </View>

      <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
        <Text
          style={[
            styles.tIds,
            styles.tIds2,
          ]}
        >
          {"Candidate Id  "}
        </Text>
        <Text style={[styles.tIds]}>{cand_id}</Text>
      </View>

      {/* <View style={styles.viva}> */}

      {attempt ? (
        <>
          {/* {console.log("attempt call first---", attempt)} */}
          {isViva ? (
            <View>
              <View style={styles.viva}>
                <CustomeButton
                  textColor={ConfigColor.white}
                  label={vivaCount > 0 ? "VIVA Attempted" : "VIVA"}
                  isdisabled={(vivaCount > 0 ? true : false) || isAbsentSelected}//main
                  //isdisabled={(vivaCount < 0 ? true : false) || isAbsentSelected}//testing
                  labelStyle={{ fontSize: 10 }}
                  buttonContainerStyle={[
                    styles.container_ojt,
                    {
                      backgroundColor:
                        // vivaCount > 0
                        //   ? COLORS.gray2
                        //   : COLORS.blue ||

                        !isAbsentSelected ? COLORS.blue : COLORS.gray2,
                      // opacity: 0.3,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("AssessmentInstructions", {
                      dataDetails,
                      data,
                      dataDetailsArr,
                      examType: "viva",
                      groupType,
                    });
                  }}
                />
              </View>
              {vivaCount !== 1 && (
                <View style={styles.viewCheck}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      value={isPrsesentSelected}
                      onValueChange={(check) => {
                        attendabceApi(check);
                        setPresentSelected(check);
                        if (check) {
                          setAbsentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                    <CheckBox
                      value={isAbsentSelected}
                      onValueChange={(check) => {
                        setAbsentSelected(check);
                        attendabceApi(false);
                        if (!check) {
                          setPresentSelected(true);
                        } else {
                          setPresentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : null}

          {isDemo ? (
            <View>
              <View style={styles.viva}>

                <CustomeButton
                  textColor={ConfigColor.white}
                  label={demoCount > 0 ? "PRACTICAL Attempted" : "PRACTICAL"}
                  isdisabled={demoCount > 0 ? true : false || isAbsentSelected}// main code
                  //isdisabled={demoCount < 0 ? true : false || isAbsentSelected}//Only for test
                  labelStyle={{ fontSize: 10 }}
                  buttonContainerStyle={[
                    styles.container_ojt,
                    {
                      backgroundColor: !isAbsentSelected
                        ? COLORS.colorGreen
                        : COLORS.gray2,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("AssessmentInstructions", {
                      dataDetails,
                      data,
                      dataDetailsArr,
                      examType: "demo",
                      groupType,
                    });
                  }}
                />

              </View>
              {demoCount !== 1 && (
                <View style={styles.viewCheck}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      value={isPrsesentSelected}
                      onValueChange={(check) => {
                        attendabceApi(check);
                        setPresentSelected(check);
                        if (check) {
                          setAbsentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                    <CheckBox
                      value={isAbsentSelected}
                      onValueChange={(check) => {
                        setAbsentSelected(check);
                        attendabceApi(false);
                        if (!check) {
                          setPresentSelected(true);
                        } else {
                          setPresentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : null}

          {isOjt ? (
            <View>
              <View style={styles.viva}>
                <CustomeButton
                  textColor={ConfigColor.white}
                  label={ojtCount > 0 ? "OJT Attempted" : "OJT"}
                  isdisabled={ojtCount > 0 ? true : false || isAbsentSelected}
                  labelStyle={{ fontSize: 10 }}
                  buttonContainerStyle={[
                    styles.container_ojt,
                    {
                      backgroundColor: !isAbsentSelected
                        ? COLORS.blue
                        : COLORS.gray2,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("AssessmentInstructions", {
                      dataDetails,
                      data,
                      dataDetailsArr,
                      examType: "ojt",
                      groupType,
                    });
                  }}
                />
              </View>
              {ojtCount !== 1 && (
                <View style={styles.viewCheck}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      value={isPrsesentSelected}
                      onValueChange={(check) => {
                        attendabceApi(check);
                        setPresentSelected(check);
                        if (check) {
                          setAbsentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                    <CheckBox
                      value={isAbsentSelected}
                      onValueChange={(check) => {
                        setAbsentSelected(check);
                        attendabceApi(false);
                        if (!check) {
                          setPresentSelected(true);
                        } else {
                          setPresentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
                  </View>
                </View>
              )}

            </View>
          ) : null}
{/* 
          {vivaCount !== 1 && demoCount !== 1 && ojtCount !== 1 && (
            <View style={styles.viewCheck}>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  value={isPrsesentSelected}
                  onValueChange={(check) => {
                    attendabceApi(check);
                    setPresentSelected(check);
                    if (check) {
                      setAbsentSelected(false);
                    }
                  }}
                  style={{ alignSelf: "flex-start" }}
                  tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                />
                <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
              </View>
              <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                <CheckBox
                  value={isAbsentSelected}
                  onValueChange={(check) => {
                    setAbsentSelected(check);
                    attendabceApi(false);
                    if (!check) {
                      setPresentSelected(true);
                    } else {
                      setPresentSelected(false);
                    }
                  }}
                  style={{ alignSelf: "flex-start" }}
                  tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                />
                <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
              </View>
            </View>
          )} */}

        </>
      ) : (
        <>
          {vivaStatus && (isViva ? (
            <View>
              <View style={styles.viva}>
                <CustomeButton
                  textColor={ConfigColor.white}
                  label={vivaCount > 0 ? "VIVA Attempted" : "VIVA"}
                  isdisabled={(vivaCount > 0 ? true : false) || isAbsentSelected}
                  labelStyle={{ fontSize: 13 }}
                  buttonContainerStyle={[
                    styles.container,
                    {
                      backgroundColor:
                        // vivaCount > 0
                        //   ? COLORS.gray2
                        //   : COLORS.blue ||

                        !isAbsentSelected ? COLORS.blue : COLORS.gray2,
                      // opacity: 0.3,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("AssessmentInstructions", {
                      dataDetails,
                      data,
                      dataDetailsArr,
                      examType: "viva",
                      groupType,
                    });
                  }}
                /></View>

              {vivaCount !== 1 && (
                <View style={styles.viewCheck}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      value={isPrsesentSelected}
                      onValueChange={(check) => {
                        attendabceApi(check);
                        setPresentSelected(check);
                        if (check) {
                          setAbsentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                    <CheckBox
                      value={isAbsentSelected}
                      onValueChange={(check) => {
                        setAbsentSelected(check);
                        attendabceApi(false);
                        if (!check) {
                          setPresentSelected(true);
                        } else {
                          setPresentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
                  </View>
                </View>
              )}
            </View>

          ) : null)}

          {!vivaStatus && (isDemo ? (
            <View>
              <View style={styles.viva}>
                <CustomeButton
                  textColor={ConfigColor.white}
                  label={demoCount > 0 ? "PRACTICAL Attempted" : "PRACTICAL"}
                  isdisabled={demoCount > 0 ? true : false || isAbsentSelected}
                  labelStyle={{ fontSize: 11 }}
                  buttonContainerStyle={[
                    styles.container,
                    {
                      backgroundColor: !isAbsentSelected
                        ? COLORS.colorGreen
                        : COLORS.gray2,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate("AssessmentInstructions", {
                      dataDetails,
                      data,
                      dataDetailsArr,
                      examType: "demo",
                      groupType,
                    });
                  }}
                />
              </View>

              {demoCount !== 1 && (
                <View style={styles.viewCheck}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      value={isPrsesentSelected}
                      onValueChange={(check) => {
                        attendabceApi(check);
                        setPresentSelected(check);
                        if (check) {
                          setAbsentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
                    <CheckBox
                      value={isAbsentSelected}
                      onValueChange={(check) => {
                        setAbsentSelected(check);
                        attendabceApi(false);
                        if (!check) {
                          setPresentSelected(true);
                        } else {
                          setPresentSelected(false);
                        }
                      }}
                      style={{ alignSelf: "flex-start" }}
                      tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
                    />
                    <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : null)}
        </>
      )}
      {/* </View> */}

      {/* {vivaCount !== 1 && demoCount !== 1 && (
        <View style={styles.viewCheck}>
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              value={isPrsesentSelected}
              onValueChange={(check) => {
                attendabceApi(check);
                setPresentSelected(check);
                if (check) {
                  setAbsentSelected(false);
                }
              }}
              style={{ alignSelf: "flex-start" }}
              tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
            />
            <Text style={[styles.checktitle]}>{AppConfig.PRESENT}</Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: normalize(40) }}>
            <CheckBox
              value={isAbsentSelected}
              onValueChange={(check) => {
                setAbsentSelected(check);
                attendabceApi(false);
                if (!check) {
                  setPresentSelected(true);
                } else {
                  setPresentSelected(false);
                }
              }}
              style={{ alignSelf: "flex-start" }}
              tintColors={{ true: '#007AFF', false: '#007AFF' }} // Blue color
            />
            <Text style={[styles.checktitle]}>{AppConfig.ABSENT}</Text>
          </View>
        </View>
      )} */}


      {/* <McqDialog
        dialogVisible={dialogVisible}
        title={"Allocate MCQ Theory Marks"}
        content={"content"}
        desc={"description"}
        onPress={() => {
          setDialogVisible(false);
        }}
      /> */}

    </View>
  );
};
const styles = StyleSheet.create({
  viewStyle: {
    margin: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    width: "90%",
    borderWidth: 2,
    borderColor: COLORS.orange,
    backgroundColor: "#fff",
  },
  checktitle: {
    fontWeight: "700",
    marginTop: 3,
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    paddingLeft: normalize(5),
  },
  viewCheck: {
    marginBottom: normalize(10),
    flexDirection: "row",
    marginHorizontal: normalize(15),
  },
  tIds2: {
    marginLeft: normalize(20),
    width: "40%",
  },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(15),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "60%",
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
    paddingRight: 25,
  },
  viva: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    borderRadius: 14,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    width: "45%",
    marginHorizontal: normalize(10),
    marginVertical: normalize(10),
  },

  container_ojt: {
    borderRadius: 14,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    width: "30%",
    marginHorizontal: normalize(10),
    marginVertical: normalize(10),
  },
});

export default AssessmentItem;
