import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { FONTS } from "../constants/Theme";
import { useTheme } from "../utils/Appearance";
import BackArrowComponent from "./BackArrowComponent";

const MessageComponet = ({ descreption, onPress, title }) => {
  let { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.backgroundColors }]}
    >
      <View style={{ flex: 1, backgroundColor: colors.backgroundColors }}>
        <View style={styles.horiZontalView}>
          <BackArrowComponent onPress={onPress} />
          <Text
            style={[
              styles.textheading,
              {
                alignItems: "center",
                color: "#4284f3",
                fontSize: 24,
                fontWeight: "bold",
                textDecorationLine: "underline",
              },
            ]}
          >
            {title}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.textDesc,
              {
                ...FONTS.latoRegularFont,
                fontSize: 18,
                textAlign: "justify",
                lineHeight: 28,
                color: "#000",
              },
            ]}
          >
            {descreption}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  horiZontalView: { flexDirection: "row" },
  textheading: {
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
    marginLeft: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  textDesc: {
    textAlign: "justify",
    marginTop: 10,
    marginHorizontal: 20,
  },
});

export default MessageComponet;
