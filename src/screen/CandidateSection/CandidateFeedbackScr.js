import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/Theme";
import normalize from "react-native-normalize";
import MenuIcon from "../../components/MenuIcon";
import { useDispatch } from "react-redux";
import {
  getCandFeedBackQuestList,
  postCandidateFeedbackApi,
} from "../../redux/Actions/AllContentAction";

const CandidateFeedbackScr = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const id = route.params?.id;
  const screen_type = route.params?.screen_type;
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [checkAttempted, setCheckAttempted] = useState(false);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [attemptedCount, setAttemptedCount] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // =========================
  // Fetch Questions
  // =========================

  const fetchQuestions = async () => {
    try {
      setFetchLoading(true);

      let res = await dispatch(getCandFeedBackQuestList(id));

      if (res?.status === 200) {
        const qList = res?.data?.questions || [];

        // ✅ Check only Assessor type answers
        const assessorQuestions = qList.filter((q) => q.type === "Assessor");
        const allAssessorAnswered = assessorQuestions.every(
          (q) => q.answer !== null && q.answer !== ""
        );
        // console.log("--:--hasAssessorAnswer:--", allAssessorAnswered)

        if (screen_type === "AssessmentFeedbackScreen") {
          if (allAssessorAnswered) {
            setCheckAttempted(false);
          } else {
            setCheckAttempted(true);
          }
        }

        // ✅ If already attempted
        //res?.data?.assessment?.feedback_enable
        if (res?.data?.feedbackStatus === true) {
          setAlreadyAttempted(true);
          return;
        }

        let filteredQuestions = [];

        if (screen_type === "AssessmentFeedbackScreen") {
          filteredQuestions = qList.filter((q) => q.type === "Assessment");
        } else if (screen_type === "AssessorFeedbackScreen") {
          filteredQuestions = qList.filter((q) => q.type === "Assessor");
        } else {
          filteredQuestions = qList;
        }

        setQuestions(filteredQuestions);

        let savedAnswers = {};

        filteredQuestions.forEach((q) => {
          if (q.answer) {
            savedAnswers[q._id] = q.answer;
          }
        });

        setAnswers(savedAnswers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoading(false);
    }
  };

  // =========================
  // Select Option
  // =========================
  const selectOption = (qId, optId) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optId,
    }));
  };

  // =========================
  // Status Color
  // =========================
  const getStatusColor = (item, index) => {
    const qId = item._id;

    if (index === currentIndex) return "#1E88E5";
    if (answers[qId]) return "#2E7D32";

    return "#212121";
  };

  // =========================
  // Submit Answer API
  // =========================


  const submitCandidateBack = async (index, final_submit = false) => {
    try {
      setLoading(true);
      const q = questions[index];
      if (!q) return;

      // Determine final submit behavior
      let isFinalSubmit = final_submit;

      if (screen_type === "AssessorFeedbackScreen") {
        isFinalSubmit = false;
      }

      const data = {
        question: q.question._id,
        answer: answers[q._id],
        review: review[q._id] || false,
      };

      // console.log("--submit data--", data);
      const res = await dispatch(postCandidateFeedbackApi(id, data));

      if (res?.status === 200) {
        // console.log("--submit res data--", res?.config?.data);
        setLoading(false);
        const isLastQuestion = index === questions.length - 1;

        //AssessorFeedbackScreen
        if (screen_type === "AssessorFeedbackScreen") {
          if (isLastQuestion) {
            // alert("Feedback Submitted Successfully");
            // navigation.navigate("CandidateDashBoardScr");
            calculateAttemptedQuestions();
            setShowSubmitDialog(true);

          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }

        if (screen_type === "AssessmentFeedbackScreen") {
          if (final_submit) {
            calculateAttemptedQuestions();
            setShowSubmitDialog(true);

          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }

      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttemptedQuestions = () => {
    const attempted = questions.filter((q) => answers[q._id]).length;
    setAttemptedCount(attempted);
  };
  const renderQuestionNumbers = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.qNumber,
          { backgroundColor: getStatusColor(item, index) },
        ]}
        onPress={() => setCurrentIndex(index)}
      >
        <Text style={styles.qNumberText}>{index + 1}</Text>
      </TouchableOpacity>
    );
  };

  // =========================
  // Legend Component
  // =========================
  const Legend = ({ color, label }) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );

  // =========================
  // Loading UI
  // =========================
  if (fetchLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ marginTop: 10 }}>Loading Questions...</Text>
      </SafeAreaView>
    );
  }

  // =========================
  // Already Attempted UI
  // =========================
  if (alreadyAttempted) {
    return (
      <SafeAreaView style={styles.constainer}>
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          <Text style={styles.head}>Candidate {screen_type}</Text>
        </View>
        <View style={styles.viewStyle}>
          <View style={styles.alreadyBox}>
            <Text style={styles.alreadyTitle}>Already Attempted</Text>
            <Text style={styles.alreadySub}>
              You have already submitted this feedback.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // Already Attempted UI
  // =========================
  if (checkAttempted) {
    return (
      <SafeAreaView style={styles.constainer}>
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          <Text style={styles.head}>Candidate {screen_type}</Text>
        </View>
        <View style={styles.viewStyle}>
          <View style={styles.alreadyBox}>
            <Text style={styles.alreadyTitle}>First Attempt All Assessor Feedback then start.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // No Data UI
  // =========================
  if (!fetchLoading && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <View style={styles.alreadyBox}>
          <Text style={styles.alreadyTitle}>Data is not available</Text>
          <Text style={styles.alreadyTitle}>OR Please Attempt theory first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const questionObj = questions?.[currentIndex];
  if (!questionObj) return null;
  const question = questionObj?.question?.question?.[0];

  const onPressOkay = async () => {

    if (screen_type === "AssessmentFeedbackScreen") {
      try {
        setLoading(true);
        const res = await dispatch(postCandidateFeedbackApi(id, { final_submit: true }));
        if (res?.status === 200) {
          setLoading(false);
          // console.log("--final submit status--", res?.config?.data);
          setShowSubmitDialog(false);
          navigation.navigate("CandidateDashBoardScr");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }

    } else {
      setShowSubmitDialog(false);
      navigation.navigate("CandidateDashBoardScr");
    }
  }

  return (
    <SafeAreaView style={styles.constainer}>
      {/* Header */}
      <View style={styles.viewMargin}>
        <MenuIcon onPress={() => navigation.goBack()} back="back" />
        <Text style={styles.head}>Candidate {screen_type}</Text>
      </View>

      <View style={styles.viewStyle}>
        <ScrollView style={styles.questionBox}>
          {/* Question */}
          <Text style={styles.questionText}>
            {currentIndex + 1}. {question?.content}
          </Text>

          {/* Options */}
          {question?.options?.map((opt) => {
            const selected = answers[questionObj._id] === opt._id;

            return (
              <TouchableOpacity
                key={opt._id}
                style={styles.optionRow}
                onPress={() => selectOption(questionObj._id, opt._id)}
              >
                <View
                  style={[styles.radio, selected && styles.radioSelected]}
                />

                <Text style={styles.optionText}>{opt.content}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Bottom Buttons */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              disabled={currentIndex === 0}
              style={[
                styles.nextBtn,
                currentIndex === 0 && { opacity: 0.4 },
              ]}
              onPress={() => setCurrentIndex(currentIndex - 1)}
            >
              <Text style={styles.btnText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextBtn}
              disabled={loading}
              onPress={() => {
                const selectedAnswer = answers[questionObj._id];

                if (!selectedAnswer) {
                  alert("Please select an option");
                  return;
                }

                if (currentIndex < questions.length - 1) {
                  submitCandidateBack(currentIndex, false);
                } else {
                  submitCandidateBack(currentIndex, true);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  {currentIndex === questions.length - 1
                    ? "Submit"
                    : "Save & Next"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Legend color="#212121" label="Not Visited" />
            <Legend color="#1E88E5" label="Active" />
            <Legend color="#2E7D32" label="Answered" />
          </View>

          {/* Question Numbers */}
          <View style={styles.qContainer}>
            <FlatList
              nestedScrollEnabled={true}
              data={questions}
              numColumns={6}
              keyExtractor={(i, index) => String(index)}
              renderItem={renderQuestionNumbers}
              contentContainerStyle={styles.qContainer}
            />
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showSubmitDialog}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Submit Feedback</Text>

            <Text style={styles.modalText}>
              Total Questions : {questions.length}
            </Text>

            <Text style={styles.modalText}>
              Attempted: {attemptedCount}
            </Text>

            <Text style={styles.modalText}>
              Not Attempted: {questions.length - attemptedCount}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", width: "90%" }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSubmitDialog(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  onPressOkay()
                }}
              >
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CandidateFeedbackScr;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: COLORS.bgBlueColor,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
  },

  head: {
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 16,
    fontWeight: "600",
  },

  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    paddingTop: 20,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  questionBox: {
    padding: 20,
  },

  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#888",
    marginRight: 12,
  },

  radioSelected: {
    backgroundColor: "#FB8C00",
    borderColor: "#FB8C00",
  },

  optionText: {
    fontSize: 15,
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  prevBtn: {
    width: "48%",
    backgroundColor: "#757575",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  nextBtn: {
    width: "48%",
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  qContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  qNumber: {
    margin: normalize(8),
    backgroundColor: "#E5DAF8",
    borderRadius: 1000,
    width: 40,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  qNumberText: {
    color: "#fff",
    fontWeight: "bold",
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 10,
    marginTop: 10,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },

  legendColor: {
    width: 14,
    height: 14,
    marginRight: 5,
  },

  legendText: {
    fontSize: 12,
  },

  alreadyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  alreadyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    color: "#E53935",
  },

  alreadySub: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  modalText: {
    fontSize: 15,
    marginVertical: 5,
  },

  modalButton: {
    marginTop: 20,
    backgroundColor: "#1E88E5",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 6,
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

