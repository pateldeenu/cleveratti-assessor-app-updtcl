import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Picker,
  Alert,
  BackHandler,
} from "react-native";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { COLORS } from "../../constants/Theme";
import {
  AppConfig,
} from "../AssessmentDetails/Utils";
import dynamicStyles from "./styles";
import DialogAttempt from "../CandidateSection/DialogAttempt";
import { useDispatch } from "react-redux";
import {
  getAssessorVivaList,
  postSubmitQuestinApi,
} from "../../redux/Actions/AllContentAction";
import ItemMarks from "./ItemMarks";
import { getData } from "../../utils/Utills";
import Loader from "../../components/Loader";
import VivaLiveStreaming from "../AssessmentDetails/VivaLiveSreaming/VivaLiveStreaming";
import CandidateHiddenLiveStreaming from "../AssessmentDetails/VivaLiveSreaming/CandidateHiddenLiveStreaming";
import SimpleToast from "react-native-simple-toast";;
import { ConfigColor } from "./Utils";

const StartRubricDemo = ({ navigation, route }) => {
  const { assessment_id, id, examType, candS3Path, idS3Path, candWithIdS3Path, latitude, longitude,currentAddress } = route.params;

  const styles = dynamicStyles();
  const camera = useRef(null);
  const chevron = require("../../assets/images/chevron-down.png");
  const sliceColor = ["#F44336", "#44b149"];
  const dispatch = useDispatch();
  const [item, setItem] = useState();
  const [data, setData] = useState([]);
  const [datarubric, setDataRubric] = useState([]);
  const [datarubricmark, setDataRubric_mark] = useState([]);
  const [rubric, setRubric] = useState([]);
  const [ques, setQues] = useState("");
  const [ques_id, setQues_id] = useState("");
  const [rb_one, setRb_one] = useState("");
  const [marks, setMarks] = useState("");
  const [demo_q_marks, setDemoQmarks] = useState("");
  const [quesId, setQuesId] = useState("");
  const [minutes, setMinutes] = useState(29);
  const [attemptedQues, setAttemptedQues] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isAttemtDialog, setIsAttemtDialog] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [position, setPosition] = useState(1);
  const [selectedQuest_marks, setSelectedQuest_marks] = useState("");

  const [isGenderVisible, setIsGenderVisible] = useState(false)
  const [selectedGender, setSelectedGender] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState("");

  let df_sl_mrk = "";

  const dataItem = async () => {
    const name = await getData("name");
    const canid = await getData("candidateId");
    const parent = await getData("ParentName");

    const item = {
      id: 1,
      name: name,
      batch_id: canid,
      parent: parent,
    };

    setItem(item);
  };

  useEffect(() => {
    questionApi();
  }, []);

  useEffect(() => {
    setLoadingIndicator(true);
    setTimeout(() => {
      setLoadingIndicator(false);
    }, 4000);
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(AppConfig.ALERT, AppConfig.MESSAGE_EXIT, [
        {
          text: "OKAY",
          onPress: () => null,
          style: "cancel",
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const questionApi = async () => {
    let dataRes = await dispatch(getAssessorVivaList(examType, assessment_id, id));
    //console.log("--dataRes:--", dataRes)
    if (dataRes.status == 200) {
      let res = dataRes.data.questions.map((it) => {
        let eng_question = it.question.question.filter((item) => item.lang == "eng");
        const rubricData_first = eng_question[0]?.rubric;
        setRubric(rubricData_first)
        return {
          quest_id: it.question._id,
          marks: it.max_mark,
          demo_q_marks: "",
          isrubric: 1,
          isSelected: false,
          ques: eng_question[0]?.content,
          rubricData: rubricData_first,
          rubricmarkData: it.rubric,
        };
      });

      setQues(res[0]?.ques);
      setQues_id(res[0]?.quest_id);
      setMarks(res[0]?.marks);
      setDemoQmarks(res[0]?.demo_q_marks);
      setRb_one(res[0]?.rb_one);
      setData(res);
      setDataRubric(res[0].rubricData)
      setDataRubric_mark(res[0].rubricmarkData)
    } else {
    }
  };

  const submitRubricApi = async (isFlag, data, position) => {
    // Use reduce to sum the "answer" values
    const sum = datarubricmark.reduce((acc, obj) => {
      const answerValue = parseInt(obj.answer); // Convert the answer to an integer
      if (!isNaN(answerValue)) {
        return acc + answerValue;
      }
      return acc; // Ignore non-numeric values
    }, 0);
    let dataJson = {};
    if (isFlag == "false") {
      dataJson = {
        question: ques_id,
        answer: sum,
        remark: "",
        final_submit: false,
        rubric: datarubricmark
      };
    } else {
      dataJson = {
        question: ques_id,
        answer: sum,
        remark: "",
        final_submit: isFlag,
        rubric: datarubricmark,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: candS3Path,
          adhaar: idS3Path,
          image_with_id: candWithIdS3Path,
          video: "",
          mode: Platform.OS + "",
        },
      };
    }

    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, id, dataJson));
    // console.log("--dataRes:--", dataRes.config.data);
    if (dataRes.status == 200) {
      data[position - 1].isSelected = true;
      totalAttepted();

      if (isFlag == "true") {
        navigation.navigate("TodayAssessment");
        SimpleToast.show(
          "Data Uploaded Successfully"
        );
      }
    } else {
    }

  };

  const submitRubricApiF = async (isFlag, data, position) => {
    const sum = datarubricmark.reduce((acc, obj) => {
      const answerValue = parseInt(obj.answer); // Convert the answer to an integer
      if (!isNaN(answerValue)) {
        return acc + answerValue;
      }
      return acc; // Ignore non-numeric values
    }, 0);

    let dataJson = {};
    if (isFlag == "false") {
      dataJson = {
        question: ques_id,
        answer: sum,
        remark: "",
        final_submit: false,
        rubric: datarubricmark
      };
    } else {

      dataJson = {
        question: ques_id,
        answer: sum,
        remark: "",
        final_submit: isFlag,
        rubric: datarubricmark,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: candS3Path,
          adhaar: idS3Path,
          image_with_id: candWithIdS3Path,
          video: "",
          mode: Platform.OS + "",
        },
      };
    }

    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, id, dataJson));
    // console.log("--dataRes:--", dataRes.config.data);
    if (dataRes.status == 200) {
      data[position - 1].isSelected = true;
      totalAttepted();
      if (isFlag == "true") {
        navigation.navigate("TodayAssessment");
        SimpleToast.show(
          "Data Uploaded Successfully"
        );
      }
    } else {
    }
  };

  const submitApi = async (isFlag, data, position) => {
    let dataJson = {};
    if (isFlag == "false") {
      dataJson = {
        question: ques_id,
        answer: demo_q_marks,
        remark: "",
        final_submit: false,
      };
    } else {

      dataJson = {
        question: ques_id,
        answer: demo_q_marks,
        remark: "",
        final_submit: isFlag,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: candS3Path,
          adhaar: idS3Path,
          image_with_id: candWithIdS3Path,
          video: "",
          mode: Platform.OS + "",
        },
      };
    }

    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, id, dataJson));
    // console.log("--dataRes:--", dataRes.config.data);
    if (dataRes.status == 200) {
      data[position - 1].isSelected = true;
      totalAttepted();
      if (isFlag == "true") {
        navigation.navigate("TodayAssessment");
        SimpleToast.show(
          "Data Uploaded Successfully"
        );
      }
    } else {
    }
  };

  const submitApiF = async (isFlag, data, position) => {
    let dataJson = {};
    if (isFlag == "false") {
      dataJson = {
        question: ques_id,
        answer: demo_q_marks,
        remark: "",
        final_submit: false,
      };
    } else {
      dataJson = {
        question: ques_id,
        answer: demo_q_marks,
        remark: "",
        final_submit: isFlag,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: candS3Path,
          adhaar: idS3Path,
          image_with_id: candWithIdS3Path,
          video: "",
          mode: Platform.OS + "",
        },
      };
    }

    let dataRes = await dispatch(postSubmitQuestinApi(examType, assessment_id, id, dataJson));
    if (dataRes.status == 200) {
      data[position - 1].isSelected = true;
      totalAttepted();
      if (isFlag == "true") {
        navigation.navigate("TodayAssessment");
        SimpleToast.show(
          "Data Uploaded Successfully"
        );
      }
    } else {
    }
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const nextQues = async () => {
    if (data.length > position) {
      setPosition(position + 1);
      setQues(data[position].ques);
      setQues_id(data[position].quest_id);
      setMarks(data[position].marks);
      setDemoQmarks(data[position].demo_q_marks);
      setQuesId(data[position].quest_id);
      setDataRubric(data[position].rubricData)
      setDataRubric_mark(data[position].rubricmarkData)
      setRb_one(data[position].rb_one);

      if (datarubricmark.length > 0) {
        let total_attempt;
        datarubricmark.map((it) => {
          if (it.answer > 0) {
            total_attempt = 1;
          } else {
            total_attempt = 0;
          }
        });
        if (total_attempt == 0) {
        } else {
          submitRubricApi("false", data, position);
        }
      } else {
        if (demo_q_marks > 0) {
          submitApi("false", data, position);
        }
      }
    } else {
      SubmitLastQuest(data, position);
      totalAttepted();
      setIsAttemtDialog(true);
    }
  };

  const priviousQues = () => {
    if (position > 1) {
      setPosition(position - 1);
      setQues(data[position - 2].ques);
      setQues_id(data[position - 2].quest_id);
      setDataRubric(data[position - 2].rubricData)
      setDataRubric_mark(data[position - 2].rubricmarkData)
      setQuesId(data[position - 2].quest_id);
      setMarks(data[position - 2].marks);
      setDemoQmarks(data[position - 2].demo_q_marks);
      setRb_one(data[position - 2].rb_one);
    }
  };

  const nextQuesClickWise = async (position) => {
    if (data.length > position) {
      setPosition(position + 1);
      setQues(data[position].ques);
      setQues_id(data[position].quest_id);
      setDataRubric(data[position].rubricData)
      setDataRubric_mark(data[position].rubricmarkData)
      setQuesId(data[position].quest_id);
      setMarks(data[position].marks);
      setDemoQmarks(data[position].demo_q_marks);
      setRb_one(data[position].rb_one)
    } else {
      setQuesId(data[position - 1].quest_id);
      setQues_id(data[position - 1].quest_id);
      totalAttepted();
      setIsAttemtDialog(true);
    }
  };

  const OnClickQuestion = (quest_pos) => {
    setPosition(quest_pos)
    nextQuesClickWise(quest_pos - 1);
  }

  const totalAttepted = () => {
    let tot = 0;
    data.map((item) => {
      if (item.isSelected) {
        tot++;
      }
    });
    setAttemptedQues(tot);
  };

  const SubmitLastQuest = (data, position) => {
    if (datarubric && datarubric.length > 0) {
      submitRubricApi("false", data, position)
    } else {
      submitApi("false", data, position);
    }
  };

  const alertSubmit = () => {
    Alert.alert(AppConfig.ALERT, `Are you sure you want to submit exam.`, [
      {
        text: "NO",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          if (datarubric && datarubric.length > 0) {
            submitRubricApiF("true", data, position);
          } else {
            submitApiF("true", data, position);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    totalAttepted();
  }, [position, attemptedQues]);

  function handleselectmarks(itemValue, position) {
    setSelectedQuest_marks(itemValue);
    data[position - 1].demo_q_marks = itemValue;
  }

  const handleChange = (selectedItem, position) => {
    data[position - 1].demo_q_marks = selectedItem;
    setSelectedNumber(selectedItem);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => OnClickQuestion(item.index + 1)}>
        <View
          style={[
            styles.renderView,
            {
              backgroundColor: item.item.isSelected
                ? COLORS.colorGreen
                : item.item.isReview
                  ? COLORS.colorYellow
                  : sliceColor[0],
            },
          ]}>
          <Text
            style={[
              styles.item,
              { color: item.item.isSelected ? COLORS.white : COLORS.black },
            ]}
          >
            {item.index + 1}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectionGenderHandler = (ind, index_nomber) => {
    data[index_nomber - 1].demo_q_marks = ind.item;
    setDemoQmarks(ind.item)
    setIsGenderVisible(false);
  };

  const renderItemMarks = (item, index_nomber) => {
    return (
      <TouchableOpacity
        style={[styles.viewTouch]}
        onPress={() => selectionGenderHandler(item, index_nomber)}
      >
        <View
          style={[
            {
              borderColor: ConfigColor.pinkColor,
              backgroundColor: item.item.isSelected
                ? ConfigColor.pinkColor
                : ConfigColor.white,
            },
            styles.selectView,
          ]}
        >
          <Text
            style={[
              styles.selectText,
              {
                fontWeight: item.item.isSelected ? "700" : "400",
                color: item.item.isSelected
                  ? ConfigColor.white
                  : ConfigColor.pinkColor,
              },
            ]}
          >
            {item.item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.constainer}>

        <View style={styles.constainer}>
          <View style={styles.secView}>
            <Text style={[styles.head]}> {"PRACTICAL"}</Text>
            <Text style={styles.timeLeft}>
              {"Time Left: "}
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>
          <ScrollView
            scrollEnabled={true}
            vertical={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.viewStyle}>

              <View style={styles.dir}>
                <Text style={[styles.QUES_rb]}>{`${position}.`} </Text>
                <Text style={[styles.QUES_rb, { marginRight: 10, }]}>
                  {ques}
                </Text>
              </View>

              <View style={styles.dir}>
                {datarubric && datarubric.length > 0 ? (
                  <FlatList
                    data={datarubric}
                    style={{ marginBottom: 0, marginRight: 10 }}
                    keyExtractor={(i, index) => String(index)}
                    showsHorizontalScrollIndicator={false}
                    renderItem={(item, index) => {
                      return (
                        <ItemMarks
                          index_nomber={item?.index + 1}
                          content={item?.item?.content}
                          marks={item?.item?.marks}
                          rubricmarkd={datarubricmark}
                          select_marks={""}
                        />
                      );
                    }}
                  />
                ) : (

                  <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <View style={styles.rb_btn}>
                      <TouchableOpacity
                        style={styles.rb_marks}
                        activeOpacity={0.8}
                        onPress={() => setIsGenderVisible(true)}
                      >
                        <Text style={styles.genV}>
                          {selectedGender ? selectedGender : "  Select marks  ▽"}
                        </Text>
                        <Text style={styles.genV}>
                          {demo_q_marks}
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        transparent={true}
                        visible={isGenderVisible}
                        onRequestClose={() => {
                          setIsGenderVisible(false);
                        }}
                      >
                        <View
                          underlayColor={"rgba(0,0,0,0.8)"}
                          style={[styles.modalBg]}
                        >
                          <View style={[styles.viewTrans, { height: "75%" }]}>
                            <Text style={styles.selectGender}>
                              {"Select your Marks"}
                            </Text>
                            <View style={styles.line} />

                            <FlatList
                              contentContainerStyle={styles.flatGen}
                              nestedScrollEnabled={true}
                              data={Array.from({ length: marks }, (_, index) => (index + 1).toString())}
                              numColumns={1}
                              keyExtractor={(i, index) => String(index)}
                              renderItem={(item) => renderItemMarks(item, position)}
                            />
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>

                )}
              </View>
              <View style={styles.rowVi}>
                <View
                  style={[
                    styles.nextView,
                    {
                      marginLeft: 10,
                      backgroundColor:
                        position == 1 ? COLORS.gray : COLORS.colorGreen,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={priviousQues}>
                    <Text style={[styles.next]}>{AppConfig.PREVIOUS}</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.nextView,
                    {
                      backgroundColor:
                        position == data.length ? "#0074f6" : COLORS.colorGreen,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={nextQues}>
                    <Text style={styles.next}>
                      {position == data.length
                        ? AppConfig.SUBMIT
                        : AppConfig.NEXT}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inf}>
                <TouchableOpacity onPress={() => setIsInfoVisible(true)}>
                  <Text style={styles.ViewDesign}>{"View"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.nv} />

              <View style={styles.main4}>
                <Text style={styles.note}>{"Note:-"}</Text>
                <View style={styles.dirH}>
                  <View
                    style={[styles.viewDot, { backgroundColor: sliceColor[1] }]}
                  />
                  <Text style={styles.dotText}>{AppConfig.ATTEMPTED}</Text>

                  <View
                    style={[styles.viewDot, { backgroundColor: sliceColor[0] }]}
                  />
                  <Text style={styles.dotText}>{AppConfig.NOT_ATTEMPTED}</Text>
                </View>
              </View>
              <View style={styles.list} />
              <View style={styles.flat}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={data}
                  numColumns={6}
                  keyExtractor={(i, index) => String(index)}
                  renderItem={(item) => renderItem(item)}
                />
              </View>
            </View>
          </ScrollView>
          <DialogAttempt
            total={data.length}
            attemptedQues={attemptedQues}
            dialogVisible={isAttemtDialog}
            onPress={() => {
              alertSubmit();
              setIsAttemtDialog(false);
            }}
          />
          <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} />
        </View>

      </SafeAreaView>
    </>
  );
};

export default StartRubricDemo;
