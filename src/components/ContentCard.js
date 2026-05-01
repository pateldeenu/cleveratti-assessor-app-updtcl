import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native";
import normalize from "react-native-normalize";
import ArrowLeftIcon from "react-native-vector-icons/AntDesign";

import { COLORS, FONTS, SIZES } from "../constants/Theme";

const ContentCard = ({ leftIcon, onPress, name, count }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewStyle}>
        <View style={styles.rowDirection}>
          <Image
            source={leftIcon}
            style={{
              width: 50,
              height: 50,
              marginTop: 10,
              marginLeft: 20,
              borderRadius: 1000,
            }}
          />
          <Text
            style={[
              styles.btnText2,
              {
                marginLeft: 20,
                marginTop: 20,
                fontSize: 20,
                lineHeight: 24,
                color: COLORS.blue,
                ...FONTS.h3,
              },
            ]}
          >
            {count}
          </Text>
        </View>
        <Text
          style={[
            { ...FONTS.h3 },
            styles.btnText2,
            { marginTop: 20, textAlign: "center", fontSize: 18 },
          ]}
        >
          {name}
        </Text>

        <View
          style={{
            height: 40,
            backgroundColor: COLORS.blue,
            width: "100%",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            marginTop: 30,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 18,
                marginHorizontal: 30,
                marginVertical: 5,
              }}
            >
              {"View"}
            </Text>

            <View
              style={{
                position: "absolute",
                right: 10,
                alignSelf: "center",
              }}
            >
              <ArrowLeftIcon name={"right"} size={22} color={COLORS.white} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ContentCard;
const styles = StyleSheet.create({
  rowDirection: { flexDirection: "row", marginTop: normalize(40) },
  viewStyle: {
    width: normalize(170),
    height: normalize(170),
    borderRadius: 15,
    marginHorizontal: normalize(10),
    marginVertical: normalize(30),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.bgBlueColor,
  },
  card: {
    flex: 1,
  },
  btnText2: {
    fontWeight: "700",
    fontSize: normalize(16),
    color: COLORS.black,
    marginTop: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});
