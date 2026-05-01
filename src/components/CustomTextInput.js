import React from "react";
import { View, Text, TextInput, StyleSheet, ColorPropType } from "react-native";
import { COLORS, FONTS } from "../constants/Theme";
import { useTheme } from "../utils/Appearance";

const CustomTextInput = (props) => {
  let {
    label,
    inputValue,
    setInputValue,
    placeholder,
    secureTextEntry,
    keyboardType,
    maxLength,
    style,
  } = props;
  const { colors } = useTheme();
  return (
    <View>
      <Text
        style={[
          {
            ...FONTS.h4roboto,
            color: colors.toIconInActiveColor,
          },
          styles.textHeiht,
        ]}
      >
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            ...FONTS.latoRegularFont,
          },
          styles.inputHeight,
          style,
        ]}
        onChangeText={(text) => {
          setInputValue(text);
        }}
        value={inputValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="rgba(0,0,0,0.4)"
        numberOfLines={1}
        keyboardDismissMode="none"
        autoCapitalize={"none"}
        underlineColorAndroid={COLORS.transparent}
        backgroundColor={COLORS.transparent}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  horizontallLineInput: {
    height: 1,
    width: "100%",
    backgroundColor: COLORS.line2COlor,
  },

  inputHeight: {
    fontSize: 16,
    marginBottom: -5,
    height: 45,
    paddingLeft: 10,
    marginHorizontal: 20,
    color: COLORS.textColors,
  },
  input: {
    backgroundColor: "white",
    height: 39,
    borderColor: COLORS.line2COlor,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
  },
  textHeiht: { fontSize: 10, marginTop: 10, height: 14 },
});
