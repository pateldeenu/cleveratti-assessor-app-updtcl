import React from "react";
import { useState, useRef ,useEffect} from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Picker,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import dynamicStyles from "./styles";
import normalize from "react-native-normalize";
import SelectDropdown from 'react-native-select-dropdown';


const ItemMarks = ({
  index,
  content,
  marks,
  rubricmarkd,
  select_marks,

}) => {
  // const [mesLength, setMesLength] = useState(0);
  // const [remarksInput, setRemarksInput] = useState(remarks ? remarks : "");
  // const [canImage, setCanImage] = useState([]);
  // const [canVideo, setCanVideo] = useState([]);
  // const [showImage, setShowImage] = useState("");
  // const [imgQuestionId, setImgQuestionId] = useState("");
  // const [imgtableId, setImgtableId] = useState("");
  const styles = dynamicStyles();
  // const [remarksInput, setRemarksInput] = useState(remarks ? remarks : "");
 // const [selectedNumber, setSelectedNumber] = useState("");

  const numbers_marks = Array.from({ length: marks }, (_, index) => (index + 1).toString());

  let df_sl_mrk = "";
  try {
    //  df_sl_mrk = rubricmarkd[index - 1]?.answer > 0 ? rubricmarkd[index - 1]?.answer : "Select marks"; 
        df_sl_mrk ="Select marks"; 
    //  console.log("--:df_sl_mrk--", df_sl_mrk);
    //  console.log("--:df_sl_mrk_answer--", rubricmarkd[index - 1]?.answer);
  }
  catch (err) {
    //console.log("--:df_sl_mrk_answer err--", err);
  }
  const [count, setCount] = useState("Select marks");
  useEffect(async () => {
    df_sl_mrk ="Select marks";
    setCount("Select marks")
    setSelectedNumber("Select marks");
    console.log("--:call use effect--",df_sl_mrk);

  }, [rubricmarkd]);

  console.log("--:call index--",index);

  let sl_mrk = "";
  try {
  
    sl_mrk = rubricmarkd[index - 1]?.answer > 0 ? rubricmarkd[index - 1]?.answer : "";
    // setSelectedNumber(sl_mrk);
   // console.log("--:sl_mrk--", sl_mrk);
   // console.log("--:sl_mrk_answer--", rubricmarkd[index - 1]?.answer);
  }
  catch (err) {
    console.log("--:sl_mrk_answer err--", err);
  }

  const [selectedNumber_rb_one, setSelectedNumber_rb_one] = useState("");
  
  const [selectedNumber, setSelectedNumber] = useState(sl_mrk ? sl_mrk : "");

  // console.log("--:df_sl_mrk_second--", df_sl_mrk);
  // console.log("--: sl_mrk_second--", sl_mrk);
  // console.log("--: sl marksselectedNumber_second--", selectedNumber);
  //console.log("--:item selectedNumber_rb_one--", selectedNumber_rb_one);

  const handleChange = (selectedItem,rubricmarkd, index) => {
    console.log("--:selected marks--", selectedItem);
    rubricmarkd[index - 1].answer = selectedItem;
    console.log("--:after_update_answer--", rubricmarkd[index - 1].answer);
    setSelectedNumber(selectedItem);
    setCount(count + 1);
  };
  // function handleselectmarks_one(itemValue, rubricmarkd, index) {
  //   console.log("--:selected marks--", itemValue);
  //   rubricmarkd[index - 1].answer = itemValue;
  //   console.log("--:after_update_answer--", rubricmarkd[index - 1].answer);
  //   setSelectedNumber_rb_one(itemValue);

  // }

  return (
    <View >
      <View style={styles.dir_flatlist}>
        <Text style={[styles.QUES_rb]}>{index} </Text>

        <Text style={[styles.QUES_rb, { marginRight: 10, }]}>
          {content}
        </Text>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

        <View style={{ width: "80%", borderRadius: 1, borderColor: 'gray', borderWidth: 0.1, paddingHorizontal: 5, marginRight: 20, }}>
          {/* <Text style={styles.label}>Select a Number:</Text> */}

          <SelectDropdown
            data={numbers_marks}
            onSelect={(selectedItem) =>
               handleChange(selectedItem,rubricmarkd, index)}
            defaultButtonText={selectedNumber}
            // buttonTextAfterSelection={(selectedItem) => selectedItem}
            // rowTextForSelection={(item) => item}
            // buttonTextAfterSelection={count}
          />

        </View>

      </View>

      {/* <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

        <View style={{ width: "80%", borderRadius: 1, borderColor: 'gray', borderWidth: 0.1, paddingHorizontal: 5, marginRight: 20, }}>
          {/* <Text style={styles.label}>Select a Number:</Text> */}
      {/* <Picker
            style={[{ height: 35, fontSize: 5 }]}
            selectedValue={selectedNumber_rb_one}
            // onValueChange={(itemValue) => setSelectedNumber_rb_one(itemValue)}
            onValueChange={(itemValue) => handleselectmarks_one(itemValue, rubricmarkd, index)}
          >
            
            <Picker.Item label={"Select marks"} value={"Select marks"} enabled={false} />
            {Array.from({ length: marks }, (_, index) => index + 1).map((number) => (

              <Picker.Item style={{ fontSize: 10 }} key={number} label={number.toString()} value={number} />
            ))}
          </Picker>

        </View> 

      </View> */}

    </View>
  );
};

export default ItemMarks;
