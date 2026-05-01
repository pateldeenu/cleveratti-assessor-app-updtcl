import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { COLORS, FONTS } from "../constants/Theme";
import { useTheme } from "../utils/Appearance";
import EyeIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomTextInputPassword = (props) => {
  let {
    label,
    inputValue,
    setInputValue,
    placeholder,
    keyboardType,
    maxLength,
    onPress,
    secureTextEntry,
    onpreseEyeIcon,
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

      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={[
            styles.input,
            {
              ...FONTS.h4Open,
            },
            styles.inputHeight,
          ]}
          onChangeText={(text) => {
            setInputValue(text);
          }}
          value={inputValue}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="rgba(0,0,0,0.4)"
          numberOfLines={1}
          underlineColorAndroid="transparent"
          backgroundColor="transparent"
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            right: 40,
            marginVertical: 20,
            alignSelf: "center",
          }}
          onPress={onpreseEyeIcon}
        >
          <EyeIcon
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            style={styles.iconView}
            size={20}
            color={COLORS.blue}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTextInputPassword;

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
    width: "90%",
    paddingLeft: 20,
    marginRight: 20,
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
  iconView: {
    justifyContent: "center",
    marginVertical: 0,
    alignItems: "center",
  },

  textHeiht: { fontSize: 10, marginTop: 10, height: 14 },
});
