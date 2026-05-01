import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import normalize from "react-native-normalize";
import ArrowRightIcon from "react-native-vector-icons/AntDesign";
import { COLORS, FONTS, SIZES } from "../constants/Theme";
const AuditItem = ({ leftIcon, onPress, name, count }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.viewStyle}>
        <View style={styles.rowDirection}>
          <Image
            source={leftIcon}
            style={{
              width: 50,
              height: 50,
              marginTop: 10,
              marginVertical: 20,
              marginLeft: 20,
            }}
          />
          <View
            style={{
              height: 50,
              width: 1,
              backgroundColor: "grey",
              alignSelf: "center",
              marginLeft: 20,
            }}
          />

          <Text
            style={[
              { ...FONTS.h3 },
              styles.btnText2,
              {
                alignSelf: "center",
                textAlign: "center",
                fontSize: 16,
                marginLeft: 20,
              },
            ]}
          >
            {name}
          </Text>
          {count && (
            <>
              <View
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 1000,
                  borderWidth: 1,
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  borderColor: COLORS.blue,
                  marginLeft: 20,
                  marginBottom: 5,
                }}
              >
                <Text
                  style={[
                    {
                      textAlign: "center",
                      fontSize: 16,
                      alignSelf: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: COLORS.black,
                      textAlign: "center",
                    },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </>
          )}
          <ArrowRightIcon
            name="right"
            size={SIZES.size22}
            color={COLORS.bluecolrHead}
            style={{
              marginVertical: 20,
              position: "absolute",
              right: 20,
              alignSelf: "center",
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default AuditItem;
const styles = StyleSheet.create({
  rowDirection: { flexDirection: "row", marginTop: 10 },
  viewStyle: {
    width: "90%",
    borderRadius: 15,
    marginHorizontal: 8,
    marginVertical: 10,
    alignSelf: "center",
    elevation: 4,

    justifyContent: "center",

    backgroundColor: COLORS.bgBlueColor,
  },

  btnText2: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    textAlign: "center",
  },
});
