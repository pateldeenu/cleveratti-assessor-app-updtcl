import React, { useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/Theme";
import VectorIcon from "react-native-vector-icons/Feather";
import appText from "../utils/Localization/localization";
import CalenderIcon from "react-native-vector-icons/FontAwesome";
import { dateFormate } from "../utils/Utills";
import DatePicker from "react-native-date-picker";

const SearchDate = ({ containerStyle, onChangeText, givenDate }) => {
  const [userText, setUserText] = React.useState("");
  const [date, setDate] = useState(new Date(givenDate));
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    onChangeText(userText);
  }, [userText]);

  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <DatePicker
        modal
        mode={"date"}
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          setUserText(dateFormate(date));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <TextInput
        style={[
          styles.textBox,
          Platform.OS === "ios"
            ? { paddingTop: 0, paddingBottom: 2 }
            : {
                paddingTop: 3,
                paddingBottom: 0,
              },
        ]}
        placeholder={dateFormate(date)}
        value={userText}
        placeholderTextColor={COLORS.gray}
        onChangeText={(text) => {
          setUserText(text);
        }}
      />
      {userText ? (
        <TouchableOpacity
          onPress={() => setUserText("")}
          style={styles.searchIconContainer}
        >
          <VectorIcon
            name="x-circle"
            size={SIZES.iconSize}
            color={COLORS.blue}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => setOpen(true)}
        >
          <CalenderIcon
            name="calendar"
            size={SIZES.iconSize}
            color={COLORS.blue}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    height: 45,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginLeft: 15,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 0,
    borderWidth: 0.5,
    marginRight: 15,
    borderColor: COLORS.textGrayColor,
  },
  textBox: {
    flex: 1,
    fontWeight: "400",

    paddingLeft: 15,
    justifyContent: "center",
    paddingVertical: 0,
    color: COLORS.textColors,
    ...FONTS.latoRegularFont,
    paddingRight: 50,
  },
  searchIconContainer: {
    paddingHorizontal: 10,
    alignSelf: "center",
    alignItems: "flex-end",
    position: "absolute",
    right: 10,
    marginLeft: 8,
    paddingVertical: 0,
    marginBottom: 1,
  },
});

export default SearchDate;
