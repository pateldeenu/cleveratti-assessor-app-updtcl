import { View, Text, SafeAreaView, TouchableOpacity,StyleSheet,Image, FlatList } from "react-native";
import React, { useEffect, useState , useCallback} from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import normalize from "react-native-normalize";
import Example from "../CredentialsAuth/Example";
import MenuIcon from "../../components/MenuIcon";
import { AppConfig, ConfigColor, isValidURL } from "../AssessmentDetails/Utils";
import { useDispatch } from "react-redux";
import { getCandidateExamQuestion, getCandidateVivaPracticlQuestion, getLiveStreamingApi } from "../../redux/Actions/AllContentAction";
import CandidateVivaLiveStreaming from "./CandidateVivaLiveStreaming";
import { GiftedChat , Bubble} from 'react-native-gifted-chat';

const CadidateVivaScreen = ({ navigation, route }) => {
  const { assessment_id , rtcToken,candId} = route.params;
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [position, setPosition] = useState(0);
  const [ques, setQues] = useState("");
  const dispatch = useDispatch()
  const candiadteViva = true;
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = React.useState([]);
  const [candidateId, setCandidateId] = useState('');
  const questionApi = async () => {
    setLoadingIndicator(true);
    let dataRes = await dispatch(getCandidateVivaPracticlQuestion(assessment_id));
    if (dataRes.status == 200) {
      
      let res = dataRes.data.questions.map((it) => {
        let eng_question = it.question.question.filter(
          (item) => item.lang == "eng"
        );
        return {
          quest_id: it.question._id,
          ques: eng_question[0].content,
          isSelected: false,
        
        };
      });


      if(res[position].ques){
        setPosition(position+1);
        setQues(res[position].ques);
      }
      setData(res);
      setLoadingIndicator(false);

    } else {
    }
    setLoadingIndicator(false);
  };
  useEffect(() => {
    questionApi()
  },[]);

  useEffect(() => {
    let myInterval = setInterval(() => {
     questionApi()
    }, 10 * 1000);
    return () => {
      clearInterval(myInterval);
    };
  });
  const videoLive = () => {
    return CandidateVivaLiveStreaming(rtcToken, candId, candiadteViva);
};




const onSend = useCallback(async(messagesArr = []) => {
let msg= messagesArr[0]
const myMsg= {
  ...msg,


}

setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))



}, [])


  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <Example />
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          <Text style={[styles.head]}>{"Practical Details"}</Text>
        </View>
        <View style={styles.constainer}>
          <View style={styles.viewStyle}>
          <View style={styles.dir}>
                <Text style={[styles.headTitle]}>{`${position}.`} </Text>
                {isValidURL(ques) ? (
                  <Image source={{ uri: ques }} style={styles.isVal} />
                ) : (
                    <Text style={[styles.QUES]}>
                      {ques}
                     
                    </Text>
                )}
              </View>
              <View style={{height:40,marginTop:10, backgroundColor:COLORS.blue, flexDirection:'row', justifyContent:'space-evenly', width:'100%', alignItems:'center'}}>
              <Text style={[[styles.headTitle, {color:'white'}]]}>{`Assesor`} </Text>

              <Text style={[styles.headTitle, {color:'white'}]}>{`Candidate`} </Text>


              </View>
              { videoLive()}

          </View>

        </View>  

          <GiftedChat
               messagesContainerStyle={{paddingTop:20,}}
               messages={messages}
               showAvatarForEveryMessage={true}
               onSend={messages => onSend(messages)}  
                />

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
  dir: {
    flexDirection: "row",
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    marginRight:20
  },
  QUES: {
    color: COLORS.textColors,
    fontSize: 16,
    fontFamily: "Lato-Bold",
    lineHeight: 20,
    fontWeight: "700",
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
  headTitle: {
    color: COLORS.black,
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  isVal: {
    height: normalize(40),
    width: normalize(40),
    paddingLeft: 5,
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

export default CadidateVivaScreen;
