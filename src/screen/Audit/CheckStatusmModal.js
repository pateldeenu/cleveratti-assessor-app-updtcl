import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, View, Text, Image } from "react-native";
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import DynamicImage from "../../constants/DynamicImage";
import { COLORS } from "../../constants/Theme";
import FastImage from "react-native-fast-image";

const CheckStatusmModal = ({
  setIsVisibleCheckStatus,
  isVisibleCheckStatus,
  checkUploadedData,
  quesNo,
}) => {
  const [doc, setDoc] = useState([]);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    if (checkUploadedData && checkUploadedData?.doc) {
      setDoc(checkUploadedData?.doc);
    }
    if (checkUploadedData && checkUploadedData?.video) {
      setVideo(checkUploadedData?.video);
    }
  }, [checkUploadedData]);

  return (
    <Modal
      transparent={true}
      visible={isVisibleCheckStatus}
      onRequestClose={() => {
        setIsVisibleCheckStatus(false);
      }}
    >
      <View underlayColor={"rgba(0,0,0,0.4)"} style={[styles.modalBg]}>
        <View style={[styles.viewTrans]}>
          <Text style={styles.selectGender}>{"Check Uploaded Status"}</Text>
          <View style={styles.line} />

          <Text style={styles.remarks}>{`Ques : ${quesNo} \n \nRemarks:`}</Text>

          <View style={[styles.largeInputContainer]}>
            <Text style={[styles.innerTextInput]}>
              {checkUploadedData?.remark}
            </Text>
          </View>
          <FlatList
            data={checkUploadedData?.image}
            style={{ marginLeft: 10, marginVertical: 20, marginRight: 20 }}
            keyExtractor={(i, index) => String(index)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={(item, index) => {
              return (
                <>
                  <FastImage
                    resizeMode="cover"
                    style={[styles.imageHeights]}
                    source={{ uri: item?.item }}
                  />
                </>
              );
            }}
          />
          <View style={{ flexDirection: "row" }}>
            {doc.length > 0 ? (

              <View>
                <FlatList
                  data={checkUploadedData?.doc}
                  style={{ marginLeft: 10, marginVertical: 20, marginRight: 20 }}
                  keyExtractor={(i, index) => String(index)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item, index) => {
                    return (
                      <>
                        <FastImage
                          resizeMode="cover"
                          style={[styles.videoeHeights]}
                          source={DynamicImage.showpdf}
                        />
                      </>
                    );
                  }}
                />
              </View>
              // <Image
              //   resizeMode="cover"
              //   style={[styles.videoeHeights]}
              //   source={DynamicImage.showpdf}
              // />
            ) : null}
            {video.length > 0 ? (

              <View>

                <FlatList
                  data={checkUploadedData?.video}
                  style={{ marginVertical: 20, marginRight: 20 }}
                  keyExtractor={(i, index) => String(index)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item, index) => {
                    return (
                      <>
                        <FastImage
                          resizeMode="cover"
                          style={[styles.videoeHeights]}
                          source={DynamicImage.VideoIconShow}
                        />
                      </>
                    );
                  }}
                />
              </View>
            ) : null}
          </View>

          <View style={{ marginBottom: 20 }}>
            <CustomeButton
              textColor={"#fff"}
              label={"Okay"}
              onPress={() => setIsVisibleCheckStatus(false)}
              buttonContainerStyle={styles.container}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CheckStatusmModal;

const styles = StyleSheet.create({
  rowVi: {
    width: "95%",
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 10,
    justifyContent: "center",
  },
  viewTrans: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    // borderRadius: normalize(10),
    width: "80%",
    borderRadius: 15,
  },
  innerTextInput: {
    width: "100%",
    // height: "100%",
    fontFamily: "Lato-Regular",
    fontSize: 15,
    color: "#221D39",
    textAlignVertical: "top",
  },
  flatGen: {
    alignSelf: "center",
    marginHorizontal: normalize(40),
    marginTop: normalize(10),
    paddingBottom: 20,
  },
  line: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#BEBEBE",
  },
  selectGender: {
    color: "#000000",
    fontFamily: "Inter",
    fontSize: normalize(18),
    fontWeight: "700",
    textAlign: "center",
    marginVertical: normalize(15),
  },
  remarks: {
    color: "#000000",
    fontFamily: "Inter-Medium",
    fontSize: normalize(14),
    fontWeight: "700",
    marginVertical: normalize(15),
    marginLeft: 20,
  },
  selectView: {
    borderWidth: 0.5,
    flexDirection: "row",
    height: normalize(52),
    marginRight: 10,
    borderRadius: normalize(89),
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(42, 39, 47, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: 40,
    borderRadius: 20,
    marginHorizontal: 80,
    backgroundColor: COLORS.blue,
    marginBottom: 5,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  largeInputContainer: {
    width: "85%",
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginLeft: 20,
    alignSelf: "flex-start",
    paddingVertical: 10,
  },
  videoeHeights: {
    width: normalize(45),
    height: normalize(45),
    marginRight: 15,
    marginHorizontal: normalize(10),
    borderColor: COLORS.blue,
  },
  imageHeights: {
    width: normalize(60),
    height: normalize(60),
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: normalize(10),
    borderColor: COLORS.blue,
  },
});
