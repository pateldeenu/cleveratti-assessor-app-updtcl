import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import ModalDropdown from "react-native-modal-dropdown";
import { COLORS } from "../../constants/Theme";
import {
  AppConfig,
  DEMO_OPTIONS_Lang,
  isValidURL,
} from "../AssessmentDetails/Utils";
import dynamicStyles from "./styles";
import normalize from "react-native-normalize";
import CandidateDialogInfo from "./CandidateDialogInfo";
import CheckBox from "@react-native-community/checkbox";
import DialogAttempt from "./DialogAttempt";
import Tts from "react-native-tts";
import DynamicImage from "../../constants/DynamicImage";
import { RNCamera } from "react-native-camera";
import { useDispatch } from "react-redux";
import {
  candidateAnswerApi,
  getCandidateExamQuestion,
} from "../../redux/Actions/AllContentAction";
import { consoleLog, getData } from "../../utils/Utills";
import { RNS3 } from "react-native-aws3";
// import Loader from "../../components/Loader";
import { getCandAttemted } from "../../redux/Actions/BasicAction";
import VivaLiveStreaming from "../AssessmentDetails/VivaLiveSreaming/VivaLiveStreaming";
import CandidateHiddenLiveStreaming from "../AssessmentDetails/VivaLiveSreaming/CandidateHiddenLiveStreaming";
import SimpleToast from "react-native-simple-toast";

const CandidateExam = ({ navigation, route }) => {
  const { assessment_id, latitude, longitude, cadn_id,
    rtcToken } = route.params;

  const styles = dynamicStyles();
  const camera = useRef(null);
  const chevron = require("../../assets/images/chevron-down.png");
  const sliceColor = ["#F44336", "#44b149"];
  const dispatch = useDispatch();

  const [item, setItem] = useState();
  const [data, setData] = useState([]);

  const [ques, setQues] = useState("");

  const [ques_lang, setQues_lang] = useState("");
  const [ques_ln, setQuesln] = useState("");
  const [quesId, setQuesId] = useState("");
  const [ansId, setAnsId] = useState("");
  const [minutes, setMinutes] = useState(59);
  const [attemptedQues, setAttemptedQues] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isAttemtDialog, setIsAttemtDialog] = useState(false);
  const [isOptionA, setIsOptionA] = useState(false);
  const [isOptionB, setIsOptionB] = useState(false);
  const [isOptionC, setIsOptionC] = useState(false);
  const [isOptionD, setIsOptionD] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const [OptionA, setOptionA] = useState("");
  const [OptionA_lang, setOptionA_lang] = useState("");
  const [OptionB_lang, setQuesB_lang] = useState("");
  const [OptionC_lang, setQuesC_lang] = useState("");
  const [OptionD_lang, setQuesD_lang] = useState("");


  const [OptionB, setOptionB] = useState("");
  const [OptionC, setOptionC] = useState("");
  const [OptionD, setOptionD] = useState("");
  const [position, setPosition] = useState(1);

  const [hiddenImage, setHiddenImage] = useState();
  const [markValue, setMarkValue] = useState("");

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

  const videoLiveStreaming = () => {
    console.log("--:call candidate hiddenlive streaming--")
    return CandidateHiddenLiveStreaming(rtcToken, cadn_id);
  };

  const questionApi = async () => {
    dataItem();
    setLoadingIndicator(true);
    let dataRes = await dispatch(getCandidateExamQuestion(assessment_id));
    // console.log("--Candidate Exam dataRes_quest:--", dataRes.data.questions)  
    if (dataRes?.data?.questions && dataRes?.data?.questions.length > 0) {
    } else {
      SimpleToast.show(
        "Please add the theory question."
      );
    }
    // consoleLog('live streaming start karni hai ', dataRes.data.assessment.proctor_allow)

    if (dataRes.status == 200) {
      let res = dataRes.data.questions.map((it) => {
        // let eng_question = it.question.question.filter((item) => item.lang == "eng");
        let eng_question = it.question.question.filter((item) => item.lang);
        // let eng_question = it.question.question.map((item));
        // console.log('eng_question', eng_question)

        if (eng_question[1]?.lang === undefined) {
          return {
            quest_id: it.question._id,
            ques: eng_question[0]?.content,
            ques_ln: "",
            ques_lang: "",
            isSelected: false,
            remarks: "",
            optionA: eng_question[0]?.options[0]?.content,
            optionA_lang: "",

            optionB: eng_question[0]?.options[1]?.content,
            optionB_lang: "",

            optionC: eng_question[0]?.options[2]?.content,
            optionC_lang: "",

            optionD: eng_question[0]?.options[3]?.content,
            optionD_lang: "",

            optionAnsA: eng_question[0]?.options[0]?._id,
            optionAnsB: eng_question[0]?.options[1]?._id,
            optionAnsC: eng_question[0]?.options[2]?._id,
            optionAnsD: eng_question[0]?.options[3]?._id,
            isCheckOptionA: false,
            isCheckOptionB: false,
            isCheckOptionC: false,
            isCheckOptionD: false,
            isReview: false,
          };

        } else {
          return {
            quest_id: it.question._id,
            ques: eng_question[0].content,
            ques_ln: eng_question[1].content,
            ques_lang: eng_question[1].lang,
            isSelected: false,
            remarks: "",
            optionA: eng_question[0]?.options[0]?.content,
            optionA_lang: eng_question[1]?.options[0]?.content,

            optionB: eng_question[0]?.options[1]?.content,
            optionB_lang: eng_question[1]?.options[1]?.content,

            optionC: eng_question[0]?.options[2]?.content,
            optionC_lang: eng_question[1]?.options[2]?.content,

            optionD: eng_question[0]?.options[3]?.content,
            optionD_lang: eng_question[1]?.options[3]?.content,

            optionAnsA: eng_question[0]?.options[0]?._id,
            optionAnsB: eng_question[0]?.options[1]?._id,
            optionAnsC: eng_question[0]?.options[2]?._id,
            optionAnsD: eng_question[0]?.options[3]?._id,
            isCheckOptionA: false,
            isCheckOptionB: false,
            isCheckOptionC: false,
            isCheckOptionD: false,
            isReview: false,
          };
        }

      });

      setQues(res[0].ques);
      setQuesln(res[1].ques_ln)
      setOptionA_lang(res[0].optionA_lang)
      setQuesB_lang(res[0].optionB_lang)
      setQuesC_lang(res[0].optionC_lang)
      setQuesD_lang(res[0].optionD_lang)

      setQues_lang(res[1].ques_lang)
      setQuesId(res[0].quest_id);
      setOptionA(res[0].optionA);
      setOptionB(res[0].optionB);
      setOptionC(res[0].optionC);
      setOptionD(res[0].optionD);
      setPosition(1);
      setData(res);
      setLoadingIndicator(false);

      //consoleLog("data", res);
    } else {
    }
    setLoadingIndicator(false);
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

  const UploadImageVideoS3 = async (uri) => {
    let date = await new Date();

    const file = {
      uri: uri,
      name: date + "-image.png",
      type: "image/png",
    };
    const options = {
      keyPrefix: AppConfig.MOBILES3,
      bucket: AppConfig.BUKET,
      region: AppConfig.REGION,
      accessKey: AppConfig.ACCESSKEY,
      secretKey: AppConfig.SECRET_KEY,
      successActionStatus: 201,
      metadata: {
        latitude: latitude, // Becomes x-amz-meta-latitude onec in S3
        longitude: longitude,
        photographer: AppConfig.PHOTO_GRAPHER,
      },
    };

    await RNS3.put(file, options).then((response) => {
      if (response.status !== 201) {
        console.log("Failed upload image from s3 storage");
      } else {
        console.log(JSON.stringify(response.body.postResponse.location));
        setHiddenImage(response.body.postResponse.location);
        // setHiddenImage([...hiddenImage, response.body.postResponse.location]);
      }
    });
  };

  const submitApi = async (isFinalSubmit, isAnswer) => {

    let dataJson;
    if (isFinalSubmit == "true") {
      dataJson = {
        question: quesId,
        image: hiddenImage,
        answer: ansId,
        time: new Date(),
        review: false,
        rest_time: seconds,
        last_active: position,
        final_submit: true,
        user_data: {
          location: `{lat:${latitude}, lng:${longitude}}`,
          image: "",
          adhaar: "",
          image_with_id: "",
          mode: "android",
        },
      };
    } else {
      dataJson = {
        question: quesId,
        image: hiddenImage,
        answer: isAnswer,
        time: new Date(),
        review: false,
        rest_time: seconds,
        last_active: position,
      };
    }
    // consoleLog("body", dataJson);
    let dataRes = await dispatch(candidateAnswerApi(dataJson, assessment_id));
    // console.log("--dataRes_upload data:--", dataRes?.data);

    if (dataRes.status == 200) {
      if (isFinalSubmit == "true") {
        dispatch(getCandAttemted(true));
        navigation.navigate("CandidateThankyou");
      }
      // consoleLog(" audit answer api--", dataRes.data);
    }
  };

  // const takePicture = async () => {
  //   if (camera.current) {
  //     try {
  //       const options = { quality: 0.5, base64: true };
  //       const data = await camera.current.takePictureAsync(options);
  //       console.log(data.uri);
  //       UploadImageVideoS3(data.uri);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };


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
    if (position == 1) {
      // takePicture();
    }
    if (position == 7) {
      // takePicture();
    }
    if (position == 12) {
      // takePicture();
    }
    if (data.length > position) {
      setPosition(position + 1);
      setQues(data[position].ques);
      setQuesId(data[position].quest_id);
      setOptionA(data[position].optionA);
      setOptionB(data[position].optionB);
      setOptionC(data[position].optionC);
      setOptionD(data[position].optionD);

      setQuesln(data[position].ques_ln)
      setOptionA_lang(data[position].optionA_lang)
      setQuesB_lang(data[position].optionB_lang)
      setQuesC_lang(data[position].optionC_lang)
      setQuesD_lang(data[position].optionD_lang)

      setIsOptionA(data[position].isCheckOptionA);
      setIsOptionB(data[position].isCheckOptionB);
      setIsOptionC(data[position].isCheckOptionC);
      setIsOptionD(data[position].isCheckOptionD);

      if (isOptionA) {
        data[position - 1].isCheckOptionA = true;
        submitApi("false", data[position - 1].optionAnsA);
      }
      if (isOptionB) {
        data[position - 1].isCheckOptionB = true;

        submitApi("false", data[position - 1].optionAnsB);
      }
      if (isOptionC) {
        data[position - 1].isCheckOptionC = true;
        submitApi("false", data[position - 1].optionAnsC);
      }
      if (isOptionD) {
        data[position - 1].isCheckOptionD = true;
        submitApi("false", data[position - 1].optionAnsD);
      }

      if (isOptionA || isOptionB || isOptionC || isOptionD) {
        data[position - 1].isSelected = true;
        data[position - 1].isReview = false;
      }
    } else {
      //  final submit button
      setQuesId(data[position - 1].quest_id);

      if (isOptionA) {
        data[position - 1].isCheckOptionA = true;
        setAnsId(data[position - 1].optionAnsA);
      }
      if (isOptionB) {
        data[position - 1].isCheckOptionB = true;
        setAnsId(data[position - 1].optionAnsB);
      }
      if (isOptionC) {
        data[position - 1].isCheckOptionC = true;
        setAnsId(data[position - 1].optionAnsC);
      }
      if (isOptionD) {
        data[position - 1].isCheckOptionD = true;
        setAnsId(data[position - 1].optionAnsD);
      }
      if (isOptionA || isOptionB || isOptionC || isOptionD) {
        data[position - 1].isSelected = true;
        // data[position - 1].isReview = false;
      }

      totalAttepted();
      setIsAttemtDialog(true);
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
          submitApi("true", "6296c99aa84bd0aa12877bb7");
        },
      },
    ]);
  };

  const priviousQues = () => {
    if (position > 1) {
      setPosition(position - 1);
      setQues(data[position - 2].ques);
      setQuesId(data[position - 2].quest_id);

      setOptionA(data[position - 2].optionA);
      setOptionB(data[position - 2].optionB);
      setOptionC(data[position - 2].optionC);
      setOptionD(data[position - 2].optionD);

      setQuesln(data[position]?.ques_ln)
      setOptionA_lang(data[position - 2].optionA_lang)
      setQuesB_lang(data[position - 2].optionB_lang)
      setQuesC_lang(data[position - 2].optionC_lang)
      setQuesD_lang(data[position - 2].optionD_lang)

      setIsOptionA(data[position - 2].isCheckOptionA);
      setIsOptionB(data[position - 2].isCheckOptionB);
      setIsOptionC(data[position - 2].isCheckOptionC);
      setIsOptionD(data[position - 2].isCheckOptionD);
    }
  };

  const totalAttepted = () => {
    let tot = 0;
    data.map((item) => {
      if (item.isSelected) {
        tot++;
      }
    });
    setAttemptedQues(tot);
  };

  useEffect(() => {
    totalAttepted();
  }, [position, attemptedQues]);

  const ttsMicEng = (text) => {
    Tts.setDefaultLanguage('en-US');
    Tts.speak(text, {
      androidParams: {
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: "STREAM_MUSIC",
        quality: 300,
      },
    });
  };

  const ttsMic = (text) => {
    //Tts.setDefaultLanguage('hi-IN');
    //Tts.setDefaultLanguage('bn-BD');	
    //Tts.setDefaultLanguage('ta-IN');
    switch (ques_lang) {
      case 'eng':
        break;
      case 'hin':
        Tts.setDefaultLanguage('hi-IN');
        break;
      case 'tam':
        Tts.setDefaultLanguage('ta-IN');
        break;
      case 'ben':
        Tts.setDefaultLanguage('bn-BD');
        break;
      case 'mar':
        Tts.setDefaultLanguage('mr');
        break;
      case 'guj':
        Tts.setDefaultLanguage('gu');
        break;
      case 'mal':
        Tts.setDefaultLanguage('ml-IN');
        break;
      case 'assame':
        Tts.setDefaultLanguage('as-IN');
        break;
      case 'kan':
        Tts.setDefaultLanguage('kn-IN');
        break;
      case 'oddi':
        Tts.setDefaultLanguage('or');
        break;
      case 'pan':
        Tts.setDefaultLanguage('pa-IN');
        break;
      case 'tel':
        Tts.setDefaultLanguage('te');
        break;
      default:
        break;
    }

    // console.log("---ques_lang:---", ques_lang);
    //"नमस्ते, कैसे हो?"
    //राहुल प्रतिदिन 8 घंटे की शिफ्ट पर काम करते हैं और 6 घंटे में एक छोटा सौर पीवी सिस्टम स्थापित कर सकते हैं। रविवार की छुट्टी के साथ वह एक सप्ताह में कितने सिस्टम स्थापित कर सकता है?"
    //வணக்கம், எப்படி இருக்கின்றீர்கள்?
    Tts.speak(text, {
      androidParams: {
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: "STREAM_MUSIC",
        quality: 300,
      },
    });
  };

  const nextQuesClickWise = async (position) => {

    if (data.length > position) {
      setPosition(position + 1);
      setQues(data[position].ques);

      setQuesId(data[position].quest_id);
      setOptionA(data[position].optionA);
      setOptionB(data[position].optionB);
      setOptionC(data[position].optionC);
      setOptionD(data[position].optionD);

      setQuesln(data[position].ques_ln)
      setOptionA_lang(data[position].optionA_lang)
      setQuesB_lang(data[position].optionB_lang)
      setQuesC_lang(data[position].optionC_lang)
      setQuesD_lang(data[position].optionD_lang)

      setIsOptionA(data[position].isCheckOptionA);
      setIsOptionB(data[position].isCheckOptionB);
      setIsOptionC(data[position].isCheckOptionC);
      setIsOptionD(data[position].isCheckOptionD);

      if (isOptionA) {
        data[position - 1].isCheckOptionA = true;
        submitApi("false", data[position - 1].optionAnsA);
      }
      if (isOptionB) {
        data[position - 1].isCheckOptionB = true;

        submitApi("false", data[position - 1].optionAnsB);
      }
      if (isOptionC) {
        data[position - 1].isCheckOptionC = true;
        submitApi("false", data[position - 1].optionAnsC);
      }
      if (isOptionD) {
        data[position - 1].isCheckOptionD = true;
        submitApi("false", data[position - 1].optionAnsD);
      }
      if (isOptionA || isOptionB || isOptionC || isOptionD) {
        data[position - 1].isSelected = true;
        data[position - 1].isReview = false;
      }
    } else {
      //  final submit button
      setQuesId(data[position - 1].quest_id);

      if (isOptionA) {
        data[position - 1].isCheckOptionA = true;
        setAnsId(data[position - 1].optionAnsA);
      }
      if (isOptionB) {
        data[position - 1].isCheckOptionB = true;
        setAnsId(data[position - 1].optionAnsB);
      }
      if (isOptionC) {
        data[position - 1].isCheckOptionC = true;
        setAnsId(data[position - 1].optionAnsC);
      }
      if (isOptionD) {
        data[position - 1].isCheckOptionD = true;
        setAnsId(data[position - 1].optionAnsD);
      }
      if (isOptionA || isOptionB || isOptionC || isOptionD) {
        data[position - 1].isSelected = true;
        // data[position - 1].isReview = false;
      }

      totalAttepted();
      setIsAttemtDialog(true);
    }
  };

  const OnClickQuestion = (quest_pos) => {
    setPosition(quest_pos)
    nextQuesClickWise(quest_pos - 1);
    console.log("----:---", quest_pos);
  }

  const renderItem = (item) => {
    return (
      // <TouchableOpacity onPress={() => setPosition(item.index + 1)}>
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

  return (
    <>
      <SafeAreaView style={styles.constainer}>
        {/* <RNCamera
          ref={camera}
          style={{ width: 1, height: 1 }}
          type={RNCamera.Constants.Type.front}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
        /> */}
        <View style={styles.constainer}>
          <View style={styles.secView}>
            <Text style={[styles.head]}> {"Theory Exam"}</Text>
            <ModalDropdown
              style={[styles.inputHeight]}
              textStyle={styles.dropText}
              options={DEMO_OPTIONS_Lang}
              value={markValue}
              defaultValue={"Language"}
              dropdownTextStyle={styles.dropView}
              onSelect={(index, value) => {
                setMarkValue(value);
              }}
              dropdownStyle={styles.dropDownView}
              renderRightComponent={() => (
                <Image source={chevron} style={[styles.animImage]} />
              )}
            />
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
                <Text style={[styles.head]}>{`${position}.`} </Text>

                {isValidURL(ques) ? (
                  <Image source={{ uri: ques }} style={styles.isVal} />
                ) : (
                  <View>
                    {undefined != ques && ques?.length > 0 ? (
                      <TouchableOpacity onPress={() => ttsMicEng(ques)}>
                        <Text style={[styles.QUES, { marginRight: 20, }]}>
                          {ques}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}

                    {undefined != ques_ln && ques_ln?.length > 0 ? (
                      <TouchableOpacity onPress={() => ttsMic(ques_ln)}>
                        <Text style={[styles.QUES, { marginRight: 20, }]}>
                          {ques_ln}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}
                  </View>
                )}

                {/* <View>
                  <TouchableOpacity onPress={() => ttsMicEng(ques)}>
                    <Text style={[styles.QUES, { marginRight: 20, }]}>
                      {ques}
                      <Image
                        source={DynamicImage.VolumeIcon}
                        style={styles.volume}
                      />
                    </Text>
                  </TouchableOpacity>
                  {ques_ln > 0 ? (
                    <TouchableOpacity onPress={() => ttsMic(ques_ln)}>
                      <Text style={[styles.QUES, { marginRight: 20, }]}>
                        {ques_ln}
                        <Image
                          source={DynamicImage.VolumeIcon}
                          style={styles.volume}
                        />
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    null
                  )}
                </View> */}

              </View>
              <View
                style={{ marginTop: normalize(0), marginLeft: normalize(20) }}
              >
                <View style={styles.optView}>

                  {undefined != OptionA && OptionA?.length > 0 ? (
                    <CheckBox
                      value={isOptionA}
                      onValueChange={setIsOptionA}
                      onCheckColor={COLORS.bluecolrHead}
                      onTintColor={COLORS.bluecolrHead}
                      tintColors={{
                        true: COLORS.bluecolrHead,
                        false: COLORS.bluecolrHead,
                      }}
                    />
                  ) : (
                    null
                  )}

                  {isValidURL(OptionA) ? (
                    <Image source={{ uri: OptionA }} style={styles.isValid} />
                  ) : (
                    <View>
                      {undefined != OptionA && OptionA?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMicEng(OptionA)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionA}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.image1}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}
                      {undefined != OptionA_lang && OptionA_lang?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMic(OptionA_lang)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionA_lang}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.image1}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}
                    </View>
                  )}

                  {/* <View>
                    <TouchableOpacity onPress={() => ttsMicEng(OptionA)}>
                      <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                        {OptionA}
                        <Image
                          source={DynamicImage.VolumeIcon}
                          style={styles.image1}
                        />
                      </Text>
                    </TouchableOpacity>
                    {OptionA_lang > 0 ? (
                      <TouchableOpacity onPress={() => ttsMic(OptionA_lang)}>
                        <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                          {OptionA_lang}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.image1}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}
                  </View> */}

                </View>

                <View style={styles.optView}>
                  {undefined != OptionB && OptionB?.length > 0 ? (
                    <CheckBox
                      value={isOptionB}
                      onValueChange={setIsOptionB}
                      onCheckColor={COLORS.bluecolrHead}
                      onTintColor={COLORS.bluecolrHead}
                      tintColors={{
                        true: COLORS.bluecolrHead,
                        false: COLORS.bluecolrHead,
                      }}
                    />
                  ) : (
                    null
                  )}

                  {isValidURL(OptionB) ? (
                    <Image source={{ uri: OptionB }} style={styles.isValid} />
                  ) : (

                    <View>
                      {undefined != OptionB && OptionB?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMicEng(OptionB)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionB}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}

                      {undefined != OptionB_lang && OptionB_lang?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMic(OptionB_lang)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionB_lang}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}
                    </View>
                  )}

                  {/* <View>

                    <TouchableOpacity onPress={() => ttsMicEng(OptionB)}>
                      <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                        {OptionB}
                        <Image
                          source={DynamicImage.VolumeIcon}
                          style={styles.volume}
                        />
                      </Text>
                    </TouchableOpacity>

                    {OptionB_lang > 0 ? (
                      <TouchableOpacity onPress={() => ttsMic(OptionB_lang)}>
                        <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                          {OptionB_lang}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}
                  </View> */}

                </View>

                <View style={styles.optView}>
                  {undefined != OptionC && OptionC?.length > 0 ? (
                    <CheckBox
                      value={isOptionC}
                      onValueChange={setIsOptionC}
                      onCheckColor={COLORS.bluecolrHead}
                      onTintColor={COLORS.bluecolrHead}
                      tintColors={{
                        true: COLORS.bluecolrHead,
                        false: COLORS.bluecolrHead,
                      }}
                    />
                  ) : (
                    null
                  )}

                  {isValidURL(OptionC) ? (
                    <Image source={{ uri: OptionC }} style={styles.isValid} />
                  ) : (

                    <View>
                      {undefined != OptionC && OptionC?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMicEng(OptionC)}>
                          <Text style={[styles.QUES, { marginRight: 25, paddingRight: 5 }]}>
                            {OptionC}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}

                      {undefined != OptionC_lang && OptionC_lang?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMic(OptionC_lang)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionC_lang}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}
                    </View>
                  )}

                  {/* <View>
                    {undefined != OptionC && OptionC > 0 ? (
                      <TouchableOpacity onPress={() => ttsMicEng(OptionC)}>
                        <Text style={[styles.QUES, { marginRight: 25, paddingRight: 5 }]}>
                          {OptionC}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}

                    {OptionC_lang > 0 ? (
                      <TouchableOpacity onPress={() => ttsMic(OptionC_lang)}>
                        <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                          {OptionC_lang}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}


                  </View> */}
                </View>
                <View style={styles.optView}>

                  {undefined != OptionD && OptionD?.length > 0 ? (
                    <CheckBox
                      value={isOptionD}
                      onValueChange={setIsOptionD}
                      onCheckColor={COLORS.bluecolrHead}
                      onTintColor={COLORS.bluecolrHead}
                      tintColors={{
                        true: COLORS.bluecolrHead,
                        false: COLORS.bluecolrHead,
                      }}
                    />
                  ) : (
                    null
                  )}

                  {isValidURL(OptionD) ? (
                    <Image source={{ uri: OptionD }} style={styles.isValid} />
                  ) : (

                    <View>
                      {undefined != OptionD && OptionD?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMicEng(OptionD)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionD}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}

                      {undefined != OptionD_lang && OptionD_lang?.length > 0 ? (
                        <TouchableOpacity onPress={() => ttsMic(OptionD_lang)}>
                          <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                            {OptionD_lang}
                            <Image
                              source={DynamicImage.VolumeIcon}
                              style={styles.volume}
                            />
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        null
                      )}

                    </View>
                  )}

                  {/* <View>
                    <TouchableOpacity onPress={() => ttsMicEng(OptionD)}>
                      <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                        {OptionD}
                        <Image
                          source={DynamicImage.VolumeIcon}
                          style={styles.volume}
                        />
                      </Text>
                    </TouchableOpacity>
                    {OptionD_lang > 0 ? (
                      <TouchableOpacity onPress={() => ttsMic(OptionD_lang)}>
                        <Text style={[styles.QUES, { marginRight: 20, paddingRight: 5 }]}>
                          {OptionD_lang}
                          <Image
                            source={DynamicImage.VolumeIcon}
                            style={styles.volume}
                          />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      null
                    )}

                  </View> */}
                </View>
              </View>
              {videoLiveStreaming()}

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
                    <Image source={chevron} style={styles.char} />
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
                    <Image source={chevron} style={styles.chervon} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inf}>
                <TouchableOpacity onPress={() => setIsInfoVisible(true)}>
                  <Text style={styles.ViewDesign}>{"View"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    data[position - 1].isReview = true;
                    nextQues();
                  }}
                >
                  <Text
                    style={[
                      styles.ViewDesign,
                      { backgroundColor: COLORS.colorYellow },
                    ]}
                  >
                    {"Review Later"}
                  </Text>
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
                </View>

                <View style={styles.dirH}>
                  <View
                    style={[styles.viewDot, { backgroundColor: sliceColor[0] }]}
                  />
                  <Text style={styles.dotText}>{AppConfig.NOT_ATTEMPTED}</Text>
                </View>
                <View style={styles.dirH}>
                  <View
                    style={[
                      styles.viewDot,
                      { backgroundColor: COLORS.colorYellow },
                    ]}
                  />
                  <Text style={styles.dotText}>{AppConfig.REVIEW}</Text>
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

          <CandidateDialogInfo
            item={item}
            dialogVisible={isInfoVisible}
            onPress={() => {
              setIsInfoVisible(false);
            }}
          />

          <DialogAttempt
            total={data.length}
            attemptedQues={attemptedQues}
            dialogVisible={isAttemtDialog}
            onPress={() => {
              alertSubmit();
              setIsAttemtDialog(false);
            }}
          />
          {/* <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} /> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default CandidateExam;
