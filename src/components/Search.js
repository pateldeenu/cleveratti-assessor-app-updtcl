import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants/Theme";
import VectorIcon from "react-native-vector-icons/Feather";
import appText from "../utils/Localization/localization";
const SearchComponent = ({ containerStyle, onChangeText }) => {
  const [userText, setUserText] = React.useState("");
  React.useEffect(() => {
    onChangeText(userText);
  }, [userText]);
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <View style={styles.searchIconContainer}>
        {!userText ? (
          <VectorIcon
            name="search"
            size={SIZES.searchIconsize}
            color={COLORS.blue}
          />
        ) : null}
      </View>
      <TextInput
        style={[
          styles.textBox,
          { ...FONTS.latoRegularFont, paddingRight: 50 },
          Platform.OS === "ios"
            ? { paddingTop: 0, paddingBottom: 2 }
            : {
                paddingTop: 3,
                paddingBottom: 0,
              },
        ]}
        placeholder={appText.search}
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
            size={SIZES.searchIconsize}
            color={COLORS.blue}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default SearchComponent;
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
    borderColor: "#828282",
  },
  textBox: {
    flex: 1,
    fontWeight: "400",
    paddingLeft: 15,
    justifyContent: "center",
    paddingVertical: 0,
    color: COLORS.textColors,
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
