import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { CustomeButton } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants/Theme";

const InfoDialog = ({ dialogVisible, item, onPress }) => {
  return (
    <Modal
      isVisible={dialogVisible}
      backdropOpacity={0.6}
      onBackdropPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Information</Text>
        </View>

        <View style={styles.body}>
          <Row label="Name :" value={item?.name} />
          <Row label="Parent Name :" value={item?.parent} />
          <Row label="Candidate Id :" value={item?.candId} />
        </View>

        <CustomeButton
          textColor="#fff"
          label="Okay"
          labelStyle={{ fontSize: 12 }}
          onPress={onPress}
          buttonContainerStyle={[
            styles.containerfrst,
            { backgroundColor: COLORS.blue, alignSelf: "center" },
          ]}
        />
      </View>
    </Modal>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
  },
  header: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  body: {
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "700",
    width: "40%",
    color: COLORS.textColors,
  },
  value: {
    width: "60%",
    color: COLORS.textColors,
  },

  containerfrst: {
    height: 45,
    width: "80%",
    borderRadius: 14,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.blue,
    marginVertical: 15,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InfoDialog;
