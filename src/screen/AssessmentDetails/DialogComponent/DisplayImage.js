import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import normalize from "react-native-normalize";
import SimpleToast from "react-native-simple-toast";
import { CustomeButtons } from "../../../components";
import { COLORS } from "../../../constants/Theme";
import { ConfigColor } from "../Utils";
import { deleteItem, } from "../../../database/SqlLitedatabase";
import { openDatabase } from "react-native-sqlite-storage";
import Modal from "react-native-modal";  // Use react-native-modal

const DisplayImage = ({
  dialogVisible,
  title,
  content,
  desc,
  imgpos,
  onPress,
  imgQuestionId,
  imgtableId,
  uri,
  buttonText = "OKAY",
}) => {
  const db = openDatabase({ name: "UserDatabase.db" });
  const onDeletePress = async () => {
    SimpleToast.show(
      "Image Deleted successfully."
    );
    await deleteItem(imgQuestionId, imgtableId);
    { onPress }
  }

  const deleteItem = (img_q_id, img_id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM image_table WHERE img_q_id = ? AND img_id = ?',
          [img_q_id, img_id],
          (tx, result) => {
            resolve(result);
            SimpleToast.show(
              "Image Deleted successfully."
            );
          },
          (error) => {
            reject(error);
            //console.log('delete error:--', error);
          }
        );
      });
    });
  };

  return (
    <View>
      <Modal
        isVisible={dialogVisible}
        backdropColor={"#000"}
        backdropOpacity={0.7}
        animationIn="zoomIn"
        animationOut="zoomOut"
        useNativeDriver
        style={styles.modalContainer}
      >

        <View
          style={{
            backgroundColor: COLORS.blue,
            paddingVertical: normalize(10),
          }}
        >
          <Text style={styles.title2}>{Number(imgpos) === 0 ? 'Photo' : Number(imgpos) === 2 ? 'Video' : 'Unknown'}</Text>
        </View>
        {/* Show image when imgpos === 0 */}
        {Number(imgpos) === 0 && uri ? (
          <Image
            source={{ uri: uri }}
            style={styles.images}
            resizeMode="cover"
          />
        ) : null}

        {/* Show image when imgpos === 2 */}
        {Number(imgpos) === 2 && uri ? (
           <Text style={styles.title3}>Do You want to delete?</Text>
        ) : null}

        {/* Show "Do you want to delete?" ONLY when imgpos === 2 and no image */}
        {Number(imgpos) === 2 && !uri && (
          <Text style={styles.title3}>Do You want to delete?</Text>
        )}

              <View style={styles.cont}>
              <TouchableOpacity style={styles.button} onPress={onDeletePress}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <CustomeButtons
                textColor={ConfigColor.white}
                label={"Close"}
                labelStyle={{ fontSize: 14 }}
                onPresss={onPress}
                buttonContainerStyle={[
                  styles.container,
                  { backgroundColor: COLORS.blue, alignSelf: "center" },
                ]}
              />
            </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainerStyle: {
    borderColor: "transparent",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  title2: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(20),
    fontWeight: "700",
    alignSelf: "center",
    color: "#fff",
  },

  title3: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(20),
    fontWeight: "700",
    margin: 10,
    marginTop: 10,
    alignSelf: "center",
    color: "#000",
  },

  buttonTextStyle: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "android" ? normalize(16) : normalize(14),
    fontWeight: "500",
    color: "#FFFF",
    height: 22,
  },

  container: {
    borderRadius: 10,
    height: normalize(45),
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    marginVertical: normalize(10),
    alignItems: "center",
    margin: 5,
    width: "45%",
  },
  cont: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  images: {
    width: "95%",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    height: normalize(400),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 20,
    margin: 10,
    borderWidth: 10,
    borderColor: COLORS.white,
  },
  dropDownView: { width: "60%", paddingTop: 10 },

  desc: {
    marginTop: 10,
    fontFamily: "Inter",
    fontSize: normalize(15),
    fontWeight: "400",
    color: "#3A3454",
    // opacity: 0.7,
  },

  button: {
    backgroundColor: '#009688',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
});

export default DisplayImage;
