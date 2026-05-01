import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Picker,
  Modal,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import dynamicStyles from "./styles";
import normalize from "react-native-normalize";
import SelectDropdown from 'react-native-select-dropdown';
import { AppConfig, ConfigColor } from "./Utils";


const ItemMarks = ({
  index_nomber,
  content,
  marks,
  rubricmarkd,
  select_marks,

}) => {

  const [spinnerMarkArr, setSpinnerMarkArr] = useState([]);
  const [genderArr, SetGenderArr] = useState([])
  const [isGenderVisible, setIsGenderVisible] = useState(false)
  const [selectedGender, setSelectedGender] = useState(0);
  const styles = dynamicStyles();
  const [selectedNumber, setSelectedNumber] = useState("");

  const numbers_marks = Array.from({ length: marks }, (_, index) => (index + 1).toString());

  let sl_mrk = "";
  try {
    sl_mrk = rubricmarkd[index_nomber - 1]?.answer > 0 ? rubricmarkd[index_nomber - 1]?.answer : "";
    // console.log("--:sl_mrk--", sl_mrk);
  }
  catch (err) {
    console.log("--:sl_mrk_answer err--", err);
  }

  const selectionGenderHandler = (ind, index_nomber) => {
    rubricmarkd[index_nomber - 1].answer = ind.item;
    setSelectedNumber(ind.item)
    sl_mrk = ind.item;
    // console.log("--:after choose sl_mrk--", sl_mrk);
    setIsGenderVisible(false);
  };

  const renderItemMarks = (item, index_nomber) => {
    // console.log("--index_nomber:--", index_nomber);
    // console.log("--item:--", item.item);
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
    <View >
      <View style={styles.dir_flatlist}>
        <Text style={[styles.QUES_rb]}>{index_nomber} </Text>

        <Text style={[styles.QUES_rb, { marginRight: 10, }]}>
          {content}
        </Text>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

        <View style={styles.rb_btn}>

          {/* <Text style={styles.mark}>{`Mark Up To : ${marks}`}</Text> */}

          <TouchableOpacity
            style={styles.rb_marks}
            activeOpacity={0.8}
            onPress={() => setIsGenderVisible(true)}
          >
            <Text style={styles.genV}>
              {selectedGender ? selectedGender : "  Select marks  ▽"}
            </Text>
            <Text style={styles.genV}>
              {sl_mrk}
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
                  data={numbers_marks}
                  numColumns={1}
                  keyExtractor={(i, index) => String(index)}
                  renderItem={(item) => renderItemMarks(item, index_nomber)}
                />
              </View>
            </View>
          </Modal>
        </View>
        {/* <View style={{ width: "80%", borderRadius: 1, borderColor: 'gray', borderWidth: 0.1, paddingHorizontal: 5, marginRight: 20, }}>
          {/* <Text style={styles.label}>Select a Number:</Text> */}

        {/* <SelectDropdown
            data={numbers_marks}
            onSelect={(selectedItem) =>
               handleChange(selectedItem,rubricmarkd, index)}
            defaultButtonText={selectedNumber}
            // buttonTextAfterSelection={(selectedItem) => selectedItem}
            // rowTextForSelection={(item) => item}
            // buttonTextAfterSelection={count}
          /> 

        </View> */}

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
