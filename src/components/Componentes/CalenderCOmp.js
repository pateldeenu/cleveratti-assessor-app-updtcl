import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import CalenderIcon from "react-native-vector-icons/FontAwesome";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { dateFormate } from "../../utils/Utills";

const CalenderCOmp = ({ text, onChangeDate, givenDate, title }) => {
  const [date, setDate] = useState(new Date(givenDate));
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text
        style={{
          fontSize: 14,
          color: "grey",
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setOpen(true);
        }}
      >
        <View
          style={{
            fontSize: 14,
            height: 50,
            width: "75%",
            paddingHorizontal: 10,
            backgroundColor: "white",
            borderColor: COLORS.line2COlor,
            flexDirection: "row",
            borderWidth: 1,
            borderRadius: 14,
            paddingVertical: 14,
          }}
        >
          <DatePicker
            modal
            mode={"date"}
            open={open}
            date={date}
            onConfirm={(dateValue) => {
              setOpen(false);
              onChangeDate(dateValue);
              setDate(dateValue);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <Text
            style={{
              fontSize: 12,
              paddingRight: 10,
            }}
          >
            {dateFormate(date)}
          </Text>
          <View style={{}}>
            <CalenderIcon
              name="calendar"
              size={SIZES.size18}
              color={COLORS.blue}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CalenderCOmp;
