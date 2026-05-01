import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../constants/Theme";

const CustomTextArea = (props) => {
  let { label, inputValue, setInputValue, placeholder, keyboardType } = props;
  return (
    <View>
      <Text style={styles.textHeiht}>{label}</Text>
      <TextInput
        style={styles.inputHeight}
        onChangeText={(text) => {
          setInputValue(text);
        }}
        value={inputValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="rgba(0,0,0,0.4)"
        multiline
        underlineColorAndroid={COLORS.transparent}
        backgroundColor={COLORS.bgTielsColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputHeight: {
    fontSize: 16,
    height: 140,
    padding: 20,

    paddingBottom: 20,
    paddingTop: 20,
    marginHorizontal: 20,
    color: COLORS.textColors,
    textAlign: "justify",

    textAlignVertical: "top",
    backgroundColor: COLORS.bgTielsColor,
    borderColor: COLORS.bgTielsColor,
    flexDirection: "row",
    borderWidth: 1,
    justifyContent: "flex-start",
    borderRadius: 14,
    ...FONTS.latoRegularFont,
  },

  textHeiht: {
    fontSize: 10,
    marginTop: -2,
    height: 14,
    ...FONTS.h4roboto,
    color: COLORS.lightGray3,
  },
});

export default CustomTextArea;
