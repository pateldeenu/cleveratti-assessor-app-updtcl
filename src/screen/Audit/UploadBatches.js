import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

import { COLORS, FONTS } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import AuditItem from "../../components/AuditItem";
import { AppConfig } from "../AssessmentDetails/Utils";
import { useDispatch, useSelector } from "react-redux";
import { RNS3 } from "react-native-aws3";
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({ name: "UserDatabase.db" });
import {
  getRecordsAllDataOnTbLenght,
  getRecordsDStatusWiseDatafirst,
  getRecordsDStatusWiseDataLength,
  fetchImageTableAllData,
  fetchImageTableAllDataLength,
  updateImageTable,
  getRecordLength,
  getDataRecordsImgTPdf,
  getRecordsDStatusWiseData,
} from "../../database/SqlLitedatabase";
import NetInfo from '@react-native-community/netinfo';
import UUID from 'react-native-uuid';


const UploadBatches = ({ navigation }) => {

  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState("");


  useEffect(async () => {

    // let token = await getData("token");
    // setTokens(token);

    console.log("--Total length of table t:--")

    //UploadDataOnServer();

  }, []);


  //Upload data from db
  const UploadDataOnServer = async () => {

    const netInfoState = await NetInfo.fetch();

    fetchImageTableAllData()
      .then(records => {
        // console.log("--Unuploaded records on S3:--", records);
        //console.log("--Total length of table:--", records.length)
        //uploadToS3Test(records, table_size);

        records.forEach(async (item, index) => {

          getRecordsDStatusWiseDataLength(item.batch_id, item.img_q_id)
            .then(bt_qt_length => {
              //console.log("--Total length of table:--", table_size)
              //console.log("--bt_qt_length:--", bt_qt_length);
              const table_size = bt_qt_length;

              getRecordsDStatusWiseDatafirst(item.batch_id, item.img_q_id, "false")
                .then(batch_quest_data => {
                  // console.log("--Total length of table:--", table_size)
                  //console.log("--batch_quest_data:--", batch_quest_data);
                  uploadToS3Test(records, table_size);
                })
                .catch(error => {
                  console.error('Error:', error);
                });

              // uploadToS3Test(records, table_size);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        })

      })
      .catch(error => {
        console.error('Error:', error);
      });

  };

  const submitS3DataOnServer = async (batch_id, questionId) => {

    setIsLoading(true);

    //videos Evidence data
    const VideosPath = [];
    await getDataRecordsImgTPdf(batch_id, questionId, "true", '2')
      .then(uploadS3Videos => {
        // console.log("S3 Upload Videos Path final submit:--", uploadS3Videos);
        uploadS3Videos.forEach((item, index) => {
          //console.log('has_doc_path :--', item.server_image_path);
          VideosPath.push(item.server_image_path);
        });
      })
      .catch(error => {
        console.error('S3 Videos path Error:', error);
      });
    console.log('S3 Videos Paths :--', VideosPath)


    //Pdf Evidence data
    const pdfPaths = [];
    await getDataRecordsImgTPdf(batch_id, questionId, "true", '1')
      .then(uploadS3Pdf => {
        // console.log("S3 Upload Pdf Path final submit:--", uploadS3Pdf);
        uploadS3Pdf.forEach((item, index) => {
          //console.log('has_doc_path :--', item.server_image_path);
          pdfPaths.push(item.server_image_path);
        });
      })
      .catch(error => {
        console.error('S3 Pdf path Error:', error);
      });
    console.log('S3 Pdf Paths :--', pdfPaths)

    //Image Evidence data  
    const imagePaths = [];
    await getRecordsDStatusWiseData(batch_id, questionId, "true", '0')
      .then(uploadS3Path => {
        // console.log("S3 Upload Image Path final submit:--", uploadS3Path);
        uploadS3Path.forEach((item, index) => {
          //  console.log('item.server_image_pat :--',item.server_image_path);
          imagePaths.push(item.server_image_path);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    console.log('uploadS3Path_img_s3_path End :--', imagePaths);

    // let dataJson = {
    //   assessment: assessment_id,
    //   question: questionId,
    //   image: imagePaths,
    //   video: VideosPath,
    //   doc: pdfPaths,
    //   remark: remarksInput,
    //   final_submit: isFinalSubmit,
    // };

    //  console.log('dataJson :--', dataJson);

    // let dataFinal = {
    //   assessment: assessment_id,
    //   question: questionId,
    //   image: imagePaths,
    //   video: VideosPath,
    //   doc: pdfPaths,
    //   remark: remarksInput,
    //   final_submit: true,
    // };

    // console.log('dataFinal :--', dataFinal);
    //  setDataSubmitArr(dataFinal);

    // let dataRes = await dispatch(postauditAnswerApi(dataJson));
    // if (dataRes.status == 200) {
    //   setIsLoading(false);
    //   consoleLog("Test Deenu Audit Submit api--", dataRes.data);
    // } else {
    //   setIsLoading(false);
    // }
  };

  const uploadToS3Test = async (dataT, DbtTotalLength) => {

    dataT.forEach(async (item) => {
      setIsLoading(true);
      setLatitude(dataLatLong.latitude);
      setLongitude(dataLatLong.longitude);


      let date = new Date();
      const uniqueKey = UUID.v4();
      const pos = item.pos;

      const file = {
        uri: item.local_image_path,
        name:
          pos == 2
            ? date + uniqueKey + "-video.mp4"
            : pos == 1
              ? date + uniqueKey + "-doc.pdf"
              : date + uniqueKey + "-image.png",
        type: pos == 2 ? "video/mp4" : pos == 1 ? "application/pdf" : "image/png",
      };

      const options = {
        keyPrefix: AppConfig.MOBILES3,
        bucket: AppConfig.BUKET,
        region: AppConfig.REGION,
        accessKey: AppConfig.ACCESSKEY,
        secretKey: AppConfig.SECRET_KEY,
        successActionStatus: 201,
        metadata: {
          latitude: latitude + "", // Becomes x-amz-meta-latitude onec in S3
          longitude: longitude + "",
          photographer: AppConfig.PHOTO_GRAPHER,
        },
      };

      switch (pos) {
        case '0':
          RNS3.put(file, options)
            .then((response) => {
              if (response.status !== 201) {
                // console.log('Upload failed:', response.body);
                setIsLoading(false);
              } else {
                setIsLoading(false);
                console.log('Upload successful:', response.body.postResponse.location);
                updateImageTable(response.body.postResponse.location, 'false', item.img_q_id, item.batch_id, item.img_id);

                getRecordLength(item.img_q_id, "false")
                  .then(data => {
                    console.log('Record DbtTotalLength:', DbtTotalLength);
                    console.log('Record length:', data.length);
                    if (DbtTotalLength == data.length) {
                      submitS3DataOnServer(item.batch_id, item.img_q_id);
                    } else {
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });

              }
            })
            .catch((error) => {
              setIsLoading(false);
              console.log('Upload error:', error);
            });

          break;
        case '1':
          RNS3.put(file, options)
            .then((response) => {
              if (response.status !== 201) {
                // console.log('Upload failed:', response.body);
                setIsLoading(false);
              } else {

                setIsLoading(false);
                console.log('Upload successful:', response.body.postResponse.location);

                updateImageTable(response.body.postResponse.location, 'false', item.img_q_id, item.batch_id, item.img_id);

                getRecordLength(item.img_q_id, "false")
                  .then(data => {
                    console.log('Record DbtTotalLength:', DbtTotalLength);
                    console.log('Record length:', data.length);
                    if (DbtTotalLength == data.length) {
                      submitS3DataOnServer(item.batch_id, item.img_q_id);
                    } else {
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }

            })
            .catch((error) => {
              setIsLoading(false);
              console.log('Upload error:', error);
            });
          break;

        case '2':

          let timeStamp =
            timeDateFormate(new Date()) +
            ", " +
            currentAddress +
            ", Lat & Long - " +
            latitude +
            " & " +
            longitude;
          setIsLoading(true);
          //submitDatart (timeStamp,dataT,questionId, batch_id,item.img_q_id, item.batch_id, item.img_id,item.local_image_path, tokens);

          try {

            // console.log('TimeStamp:--', timeStamp);
            // console.log('path:---', item.local_image_path);
            // console.log('tokens:--', tokens);

            setIsVideoLoading(true);
            let dataRes = await uploadVideoTagApi(timeStamp, item.local_image_path, tokens);
            updateQuestion_Video(dataRes.url, '2', questionId, batch_id);
            setIsVideoLoading(false);
            setCanVideo([...canVideo, dataRes.url]);
            consoleLog("Videos items data:---", dataRes);

            console.log('QuestionId:--', item.img_q_id);
            console.log('batch_Id:---', item.batch_id);
            console.log('table_id:--', item.img_id);

            updateImageTable(dataRes.url, 'false', item.img_q_id, item.batch_id, item.img_id);

            getRecordLength(item.img_q_id, "false")
              .then(data => {
                console.log('Record DbtTotalLength:', DbtTotalLength);
                console.log('Record length:', data.length);
                if (DbtTotalLength == data.length) {
                  submitS3DataOnServer(item.batch_id, item.img_q_id);
                } else {
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });

          } catch (error) {
            consoleLog("videos Error:--", error);
            setIsVideoLoading(false);
            setIsVideoLoading(false);
          }
          break;
        default:
          console.log('--default:--');
          break;
      }

    });
  };


  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.mainV}>{AppConfig.DASHBOARD}</Text>
          </View>

          <View style={styles.viewStyle}>

            <AuditItem name={"Upload"}
              leftIcon={DynamicImage.uploadIcon}
              onPress={() => UploadDataOnServer()}
            />

          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  constainer: {
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  mainV: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: COLORS.black,
    ...FONTS.h2,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
  },

  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    paddingTop: 20,
    marginBottom: normalize(120),
    flexGrow: 1,
    height: "100%",

    borderTopLeftRadius: normalize(15),
    borderTopEndRadius: normalize(15),
  },
});

export default UploadBatches;
