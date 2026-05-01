import React from "react";
import { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  PermissionsAndroid, Platform
} from "react-native";
import normalize from "react-native-normalize";
import DynamicImage from "../../constants/DynamicImage";
import ImagePicker from "react-native-image-crop-picker";
import { FlatList } from "react-native-gesture-handler";
import DisplayImage from "../AssessmentDetails/DialogComponent/DisplayImage";
import SimpleToast from "react-native-simple-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RNS3 } from "react-native-aws3";
// import Geolocation from 'react-native-geolocation-service';
import DocumentPicker, { types } from "react-native-document-picker";
import dynamicStyles from "./styles";
import RNFS from 'react-native-fs';
import UUID from 'react-native-uuid';

import {
  dateFormate,
  getData,
  timeDateFormate,
  getDate,
} from "../../utils/Utills";
import ImageTimeStamp from "../CandidateSection/ImageTimeStamp";
import {
  getCheckStatusApi,
  postauditAnswerApi,
  uploadVideoTagApi,
} from "../../redux/Actions/AllContentAction";
import { CustomeButton } from "../../components";
import {
  createImageTable,
  updateImageTable,
  insertImageTable,
  updateQuestion_Doc,
  updateQuestion_Remarks,
  updateQuestion_Video,
} from "../../database/SqlLitedatabase";
import { openDatabase } from "react-native-sqlite-storage";
import CheckStatusmModal from "./CheckStatusmModal";
import FastImage from "react-native-fast-image";
import { COLORS } from "../../constants/Theme";
import { ConfigColor } from "../AssessmentDetails/Utils";
import NetInfo from '@react-native-community/netinfo';
import { AppConfig } from "../AssessmentDetails/Utils"; 
import { useIsFocused } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { useFocusEffect } from '@react-navigation/native';
import requestCameraAndAudioPermission from "../../components/permission";
import { getLocation } from "../../utils/helper";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ItemQuestion = ({
  index,
  ques,
  hasImage,
  hasVideo,
  hasTime,
  remarks,
  onPress,
  questionId,
  batch_id,
  assessment_id,
  setDataSubmitArr,
  isFinalSubmit,
  setIsFinalSubmit,
  hasDoc,
  hasVideoPath,
  hasDocPath,
  navigation,
  _id,
}) => {
  const [mesLength, setMesLength] = useState(0);
  const [remarksInput, setRemarksInput] = useState(remarks ? remarks : "");
  const [canImage, setCanImage] = useState([]);
  const [canVideo, setCanVideo] = useState([]);
  const [showImage, setShowImage] = useState("");
  const [imgQuestionId, setImgQuestionId] = useState("");
  const [imgtableId, setImgtableId] = useState("");
  const [imgpos, setImgpos] = useState("");
  const [imageRemaining, setImageRemaining] = useState(0);
  const [videoRemaining, setVideoRemaining] = useState(0);
  const [docRemaining, setDocRemaining] = useState(0);
  const [isPhotoViewerVisible, setIsPhotoViewerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [dateTime, setDt] = useState(new Date().toLocaleString());
  const [capturImage, setCapturImage] = useState("");
  const [orientation, setOrientation] = useState("");
  const [docStorage, setDocStorage] = useState([]);
  const [tokens, setTokens] = useState();
  const [on_off_linemode, setOnOff_lineMode] = useState();
  const [checkUploadedData, setCheckUploadedData] = useState([]);
  const [isVisibleCheckStatus, setIsVisibleCheckStatus] = useState(false);
  const db = openDatabase({ name: "UserDatabase.db" });
  const [data, setData] = useState([]);
  const [pdfCount, setPdfCount] = useState([]);
  const [videoCount, setVideoCount] = useState([]);
  const [isPhotoViewerVisibleScreenShot, setIsPhotoViewerVisibleScreenShot] = useState(false);
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);
  const [longitude, setLongitude] = useState("");
  const styles = dynamicStyles();
  const dispatch = useDispatch();
  const [DbtTotalLength, setDbtTotalLength] = useState('');
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())//use for only getting time
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const initData = async () => {
      if (isFocused) {
        await fetchImageTable();
        await getPdfCount();
        await getVideoCount();
        let token = await getData("token");
        console.log("------token-----", token);
        setTokens(token);
        let on_off_mode = await getData(AppConfig.OnOffMode);
        setOnOff_lineMode(on_off_mode === null ? 'true' : on_off_mode);
      }
    };
    initData();
  }, [isFocused]);


   // for location
    const fetchLocation = async () => {
      try {
        setLocationLoading(true);
        const { result } = await getLocation();
        const addressComponents = result?.address_components || [];
        console.log("addressComponents", addressComponents);
        const getComponent = type =>
          addressComponents.find(component => component.types.includes(type))
            ?.long_name || '';
        let fullLocation = `${getComponent('sublocality_level_2') &&
          getComponent('sublocality_level_2') + ','
          } ${getComponent('sublocality_level_3') &&
          getComponent('sublocality_level_3') + ','
          } ${getComponent('administrative_area_level_3') &&
          getComponent('administrative_area_level_3') + ','
          } ${getComponent('administrative_area_level_1') &&
          getComponent('administrative_area_level_1') + ','
          } ${getComponent('country') && getComponent('country') + ','
          } ${getComponent('postal_code')}`;
  
        setCurrentAddress(fullLocation.trim());
        setLatitude(result?.geometry?.location?.lat);
        setLongitude(result?.geometry?.location?.lng);
        setLocationLoading(false);
  
      } catch (error) {
        //console.log("Error fetching location", error);
        setLocationLoading(false);
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        let isActive = true; // in case component unmounts during async work
        const loadLocation = async () => {
          try {
            await fetchLocation();
          } catch (err) {
            console.log("Error in useFocusEffect fetchLocation:", err);
          }
        };
  
        if (isActive) {
          loadLocation();
        }
  
        return () => {
          isActive = false; // cleanup
        };
      }, []),
    );
  
    useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
  
        const loadPermission = async () => {
          await requestCameraAndAudioPermission();
        };
  
        if (isActive) {
          loadPermission();
        }
  
        return () => {
          isActive = false;
        };
      }, []),
    );


  // useEffect(() => {
  //   const updateLocation = async () => {
  //     setLatitude(dataLatLong.latitude);
  //     setLongitude(dataLatLong.longitude);
  //     // If you're using geocoding later, put it here too
  //   };
  //   updateLocation();
  // }, [capturImage]);


  //Upload data from db
  const cptImgLength = async () => {
    SimpleToast.show(`Please wait ....`);
    getRecordsAllDataOnTbLenghtImg(batch_id, questionId, '0')
      .then(allData_Ontable => {
        if (hasImage >= allData_Ontable + 1) {
          ImagePicker.openCamera({
            compressImageQuality: 0.2,
            // width: 700,
            // height: 700,
            useFrontCamera: true,
            includeExif: true,   // Add this if you want to read raw orientation from EXIF later
          })
            .then((image) => {
              const orientation = image.exif?.Orientation;
              let orientationText = 'Unknown';

              if (orientation == 6 || orientation == 8) {
                orientationText = 'Portrait';
              } else if (orientation == 1 || orientation == 3) {
                orientationText = 'Landscape';
              }
              setOrientation(orientationText)

              createImageTable();
              const filePath = image.path;
              const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti';// Specify the target directory 
              return moveImageToDirectory(filePath, targetDirectory);
            })
            .then(targetFilePath => {
              setCapturImage(targetFilePath);
              setIsPhotoViewerVisibleScreenShot(true);
            })
            .catch((error) => {
              console.log(error);
            });

        } else {
          SimpleToast.show(`Capture only ${hasImage} images`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const openCamera = async (id) => {
    console.log("--:call capture image---");
    cptImgLength();
  };

  //Save Image In Internal folder 
  const moveImageToDirectory = (filePath, targetDirectory) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const targetFilePath = `${targetDirectory}/${fileName}`;
    return RNFS.mkdir(targetDirectory)
      .then(() => RNFS.moveFile(filePath, targetFilePath))
      .then(() => targetFilePath);
  };

  //Save Image timeStamp wise In Internal folder 
  const moveImageToDirectoryS3Image = (filePath, baseDirectory) => {
    //create folder wise
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const batch_id_replace = batch_id.replace(/[\/_]/g, "_");// Replace both '/' and '_' with '_'
    const fileNametwo = `${batch_id_replace}_${getDate()}_${fileName}`;

    const batchFolderName = `Batch_${batch_id_replace}`;
    const targetDirectory = `${baseDirectory}/${batchFolderName}`;// Full target directory path
    const targetFilePath = `${targetDirectory}/${fileNametwo}`;

    insertImageTable(
      questionId,
      targetFilePath,
      '',
      batch_id,
      'false',
      '0'
    );

    fetchImageTable();
    getPdfCount();
    getVideoCount();
    return RNFS.mkdir(targetDirectory)
      .then(() => RNFS.moveFile(filePath, targetFilePath))
      .then(() => targetFilePath);
  };

  const openVideo = async () => {
    cptVideosLength();
  }

  //Upload data from db
  const cptVideosLength = async () => {
    SimpleToast.show(`Please wait ....`);
    getRecordsAllDataOnTbLenghtImg(batch_id, questionId, '2')
      .then(allData_Ontable => {
        if (hasVideo >= allData_Ontable + 1) {
          if (on_off_linemode === 'true') {  // ✅ Correct comparison
            const roomId = assessment_id + "_" + _id + "_" + questionId;
            navigation.navigate("Room", { questionId, batch_id, _id, assessment_id, roomId, latitude, longitude, currentAddress, dateTime })
          } else {
            navigation.navigate("VideoRecording", { questionId, batch_id, _id, assessment_id })
          }
        } else {
          SimpleToast.show(`Take only ${hasVideo} video`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onPressDoc = async () => {
    cptPdfLength();
  };

  //Upload dta from db
  const cptPdfLength = async () => {
    SimpleToast.show(`Please wait ....`);
    getRecordsAllDataOnTbLenghtImg(batch_id, questionId, '1')
      .then(async allData_Ontable => {

        if (hasDoc >= allData_Ontable + 1) {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: "fullScreen",
              type: [types.doc, types.docx, types.pdf],
            });

            insertImageTable(questionId, pickerResult?.uri, '', batch_id, 'false', '1');
            updateQuestion_Doc(pickerResult?.uri, "1", questionId, batch_id,)
            setDocStorage([...docStorage, pickerResult?.uri]);
            getPdfCount();

          } catch (e) {
            // console.log(e);
          }
        } else {
          SimpleToast.show(`Take only ${hasDoc} document`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onImageSave = async (uri) => {
    const filePath = uri;
    const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_S3/Audit'; // Specify the target directory
    moveImageToDirectoryS3Image(filePath, targetDirectory);
  };

  //for take timer open time dialog box
  const openTimerPicker = async () => {
    setOpen(true)
  };

  const getTime = async (dates) => {
    setOpen(false)
    setRemarksInput(dates.toLocaleTimeString())
    updateQuestion_Remarks(dates.toLocaleTimeString(), questionId, batch_id);
  };

  const fetchImageTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM image_table where batch_id = '${batch_id}' and img_q_id= '${questionId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            const row = results.rows.item(i);
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setData(temp);
          } else {
          }
        }
      );
    });
  };

  // Define a function to fetch getPdfCount
  const getPdfCount = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM image_table where batch_id = '${batch_id}' and img_q_id= '${questionId}' and pos= '${1}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            const row = results.rows.item(i);
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setPdfCount(temp);
          } else {
          }
        }
      );
    });
  };

  // Define a function to fetch getVideoCount
  const getVideoCount = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM image_table where batch_id = '${batch_id}' and img_q_id= '${questionId}' and pos= '${2}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            const row = results.rows.item(i);
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setVideoCount(temp);
          } else {
          }
        }
      );
    });
  };

  const getRecordLength = (batch_id, img_q_id, upload_status) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ?',
          [batch_id, img_q_id, upload_status],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  // Define a function to fetch the data
  const getRecordsDStatusWiseDatafirst = (batch_id, questionId, upload_status) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ?',
          [batch_id, questionId, upload_status],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  //Define a function to fetch the data
  const getRecordsDStatusWiseData = (batch_id, questionId, upload_status, pos) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ? AND pos = ?',
          [batch_id, questionId, upload_status, pos],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  // Define a function to fetch the pdf data
  const getDataRecordsImgTPdf = (batch_id, questionId, upload_status, pos) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ? AND pos = ?',
          [batch_id, questionId, upload_status, pos],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  // Define a function to fetch the data
  const getRecordsAllDataOnTbLenght = (batch_id, questionId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ?',
          [batch_id, questionId],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            setDbtTotalLength(data.length)
            resolve(data.length);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  // Define a function to fetch the length
  const getRecordLength_img = (img_q_id, batch_id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE img_q_id = ? AND batch_id = ?',
          [img_q_id, batch_id],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
            setData(data);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  // Define a function to fetch the data
  const getRecordsAllDataOnTbLenghtImg = (batch_id, questionId, pos) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND pos = ?',
          [batch_id, questionId, pos],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            setDbtTotalLength(data.length)
            resolve(data.length);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  const uploadToS3Test = async (dataT, DbtTotalLength) => {

    if (dataT.length === 0) {
      SimpleToast.show(`Capture correspondence evidence or evidence already uploaded.`);
      return;
    }

    dataT.forEach(async (item) => {
      setIsLoading(true);
      setLatitude(dataLatLong.latitude);
      setLongitude(dataLatLong.longitude);

      // let date = new Date();
      const uniqueKey = UUID.v4();
      const pos = item.pos;

      const file = {
        uri: item.local_image_path,
        name:
          pos == 2
            ? getDate() + uniqueKey + "-video.mp4"
            : pos == 1
              ? getDate() + uniqueKey + "-doc.pdf"
              : getDate() + uniqueKey + "-image.png",
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
                setIsLoading(false);
              } else {
                setIsLoading(false);
                updateImageTable(response.body.postResponse.location, 'true', item.img_q_id, item.batch_id, item.img_id);
                getRecordLength(item.batch_id, item.img_q_id, "true")
                  .then(data => {
                    if (DbtTotalLength == data.length) {
                      submitTeastApi();
                    } else {
                    }
                  })
                  .catch(error => {
                    // console.error('Error:', error);
                  });
              }
            })
            .catch((error) => {
              setIsLoading(false);
              // console.log('Upload error:', error);
            });

          break;
        case '1':
          RNS3.put(file, options)
            .then((response) => {
              if (response.status !== 201) {
                setIsLoading(false);
              } else {
                setIsLoading(false);
                // console.log('s3 url:', response.body.postResponse.location);
                updateImageTable(response.body.postResponse.location, 'true', item.img_q_id, item.batch_id, item.img_id);
                getRecordLength(item.batch_id, item.img_q_id, "true")
                  .then(data => {
                    if (DbtTotalLength == data.length) {
                      submitTeastApi();
                    } else {
                    }
                  })
                  .catch(error => {
                    // console.error('Error:', error);
                  });
              }
            })
            .catch((error) => {
              setIsLoading(false);
              // console.log('Upload error:', error);
            });
          break;
        case '2':
          if (on_off_linemode === 'true') {
            updateImageTable("", 'true', item.img_q_id, item.batch_id, item.img_id);
            updateQuestion_Video("", '2', questionId, batch_id);
            submitTeastApi();

          } else {

            let timeStamp =
              timeDateFormate(new Date()) +
              ", " +
              currentAddress +
              ", Lat & Long - " +
              latitude +
              " & " +
              longitude;

            setIsLoading(true);
            try {
              setIsVideoLoading(true);
              let dataRes = await uploadVideoTagApi(timeStamp, "audit", item.batch_id, "", item.img_q_id, item.local_image_path, tokens);
              // console.log('--Upload videos Url:--', dataRes);
              if (dataRes?.message == 'video edited successfully!') {
                updateQuestion_Video(dataRes.url, '2', questionId, batch_id);
                setIsVideoLoading(false);
                setCanVideo([...canVideo, dataRes.url]);
                updateImageTable(dataRes.url, 'true', item.img_q_id, item.batch_id, item.img_id);
                SimpleToast.show(
                  "Videos is Uploaded Successfully."
                );
                getRecordLength(item.batch_id, item.img_q_id, "true")
                  .then(data => {
                    if (DbtTotalLength == data.length) {
                      submitTeastApi();
                    } else {
                    }
                  })
                  .catch(error => {
                    // console.error('Error:', error);
                  });

              } else {
                SimpleToast.show(
                  "Videos is not Uploaded."
                );
              }
            } catch (error) {
              setIsVideoLoading(false);
              setIsVideoLoading(false);
            }
          }
          break;
        default:
          break;
      }
    });
  };

  //Upload data from db
  const UploadDataOnServer = async () => {
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected) {

      if (remarksInput.trim() === '') {
        SimpleToast.show(
          "Please Enter the Remarks."
        );
      } else {
        if (hasVideo > 0 || hasImage > 0 || hasDoc > 0 || (hasVideo && hasImage) > 0 || (hasVideo && hasDoc) > 0 || (hasImage && hasDoc) > 0
          || (hasVideo && hasImage && hasDoc) > 0) {
          await getRecordsAllDataOnTbLenght(batch_id, questionId)
            .then(allData_Ontable => {
              const table_size = allData_Ontable;
              getRecordsDStatusWiseDatafirst(batch_id, questionId, "false")
                .then(records => {
                  uploadToS3Test(records, table_size);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            })
            .catch(error => {
            });
        } else {
          submitTeastApi();
        }
      }

    } else {
      SimpleToast.show(
        "Check internet connection."
      );
    }
  };

  const submitTeastApi = async () => {
    setIsLoading(true);
    //videos Evidence data
    const VideosPath = [];
    await getDataRecordsImgTPdf(batch_id, questionId, "true", '2')
      .then(uploadS3Videos => {
        uploadS3Videos.forEach((item, index) => {
          VideosPath.push(item.server_image_path);
        });
      })
      .catch(error => {
        // console.error('S3 Videos path Error:', error);
      });

    //Pdf Evidence data
    const pdfPaths = [];
    await getDataRecordsImgTPdf(batch_id, questionId, "true", '1')
      .then(uploadS3Pdf => {
        uploadS3Pdf.forEach((item, index) => {
          pdfPaths.push(item.server_image_path);
        });
      })
      .catch(error => {
      });

    //Image Evidence data  
    const imagePaths = [];
    await getRecordsDStatusWiseData(batch_id, questionId, "true", '0')
      .then(uploadS3Path => {
        uploadS3Path.forEach((item, index) => {
          imagePaths.push(item.server_image_path);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });

    let dataJson;
    let dataFinal;

    if (on_off_linemode === 'true') {  // ✅ Correct comparison

      dataJson = {
        assessment: assessment_id,
        question: questionId,
        image: imagePaths,
        doc: pdfPaths,
        remark: remarksInput,
        final_submit: isFinalSubmit,
      };

      dataFinal = {
        assessment: assessment_id,
        question: questionId,
        image: imagePaths,
        doc: pdfPaths,
        remark: remarksInput,
        final_submit: true,
      };
    } else {

      dataJson = {
        assessment: assessment_id,
        question: questionId,
        image: imagePaths,
        video: VideosPath,
        doc: pdfPaths,
        remark: remarksInput,
        final_submit: isFinalSubmit,
      };

      dataFinal = {
        assessment: assessment_id,
        question: questionId,
        image: imagePaths,
        video: VideosPath,
        doc: pdfPaths,
        remark: remarksInput,
        final_submit: true,
      };
    }

    setDataSubmitArr(dataFinal);
    let dataRes = await dispatch(postauditAnswerApi(dataJson));
    if (dataRes.status == 200) {
      setIsLoading(false);
      // console.log("--:upload data dataRes.status--", dataRes.status);
      SimpleToast.show(
        "Uploaded Successfully."
      );
    } else {
      setIsLoading(false);
    }
  };

  const checkStatusApi = async () => {
    let dataRes = await dispatch(getCheckStatusApi(assessment_id, questionId));
    setIsVisibleCheckStatus(true);
    setCheckUploadedData(dataRes.data);
  };
  useEffect(() => {
    const processImageData = () => {
      const reversed = [...canImage].reverse();

      // only update if actually different
      if (JSON.stringify(reversed) !== JSON.stringify(canImage)) {
        setCanImage(reversed);
      }

      if (data.length > 0) {
        setImageRemaining(hasImage - data.length);
      } else {
        setImageRemaining(hasImage - canImage.length);
      }
    };

    processImageData();
  }, [canVideo, hasImage, docStorage]);

  useEffect(() => {
    const loadImageData = async () => {
      await fetchImageTable();
      await getRecordLength_img(questionId, batch_id);
    };
    loadImageData();
  }, [isPhotoViewerVisible]);

  const renderItem = ({ item }) => {
    // console.log("--:item pos--",item?.pos)
    if (item.pos == 0) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsPhotoViewerVisible(true);
              setShowImage(item.local_image_path);
              setImgQuestionId(item.img_q_id);
              setImgtableId(item.img_id);
              setImgpos(item.pos);
            }}
          >
            <FastImage
              resizeMode="cover"
              style={[styles.imageHeights]}
              source={{ uri: item?.local_image_path }}
            />
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator size={"small"} color={COLORS.orange} />
          )}
        </View>
      );
    } else if (item.pos == 2) {

      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsPhotoViewerVisible(true);
              setShowImage(item.local_image_path);
              setImgQuestionId(item.img_q_id);
              setImgtableId(item.img_id);
              setImgpos(item.pos);
            }}
          >
            <Image
              resizeMode="cover"
              style={[styles.videoeHeights]}
              source={DynamicImage.VideoIconShow}
            />
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator size={"small"} color={COLORS.orange} />
          )}
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={[styles.viewStyle]}>
      <View
        style={{
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.tIds]}>{index + 1 + ") "}</Text>
          <Text style={[styles.tIdsQues]}>{ques}</Text>

          {canImage.length > 0 || canVideo.length > 0 ? (
            <Image
              resizeMode="cover"
              style={[styles.imageHeight]}
              source={DynamicImage.checkSelcted}
            />
          ) : null}
        </View>
        <View style={[styles.largeInputContainer]}>
          <TextInput
            style={[styles.innerTextInput]}
            multiline={true}
            scrollEnabled={false}
            onChangeText={(text) => {
              setRemarksInput(text);
              setMesLength(text.length);
              updateQuestion_Remarks(text, questionId, batch_id);
            }}
            keyboardType="default"
            defaultValue={remarksInput}
            maxLength={200}
            // placeholder="Enter remarks here ..."
            placeholder={hasTime === 1 ? 'Enter time here ...' : 'Enter remarks here ...'}
          />
          {mesLength > 0 ? (
            <Text style={styles.lenMess}>({mesLength}/200)</Text>
          ) : null}
        </View>

        {hasTime > 0 && (
          <View>
            <TouchableOpacity
              onPress={() => {
                openTimerPicker();
              }}
            >
              <Image
                resizeMode="cover"
                style={[styles.cameraHeight]}
                source={DynamicImage.showtimer}
              />
            </TouchableOpacity>

            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={date => { getTime(date) }}
              onCancel={() => {
                setOpen(false)
              }}
            />

          </View>
        )}

        {hasDoc > 0 && (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              onPressDoc();
            }}
            activeOpacity={0.6} // adjust this value as needed
          >
            <Image
              resizeMode="cover"
              style={[styles.cameraHeight]}
              source={DynamicImage.pickPdf}
            />
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: "row", marginRight: 10 }}>

          {hasImage > 0 && (
            <View style={{ flexDirection: "row" }}>
              {hasImage == 1 ? (
                <Text style={[styles.remarks]}>
                  {hasImage + " Image required"}
                  {hasVideo && hasImage > 0 ? ", " : ""}
                </Text>
              ) : (
                <Text style={[styles.remarks]}>
                  {hasImage + " Images required"}
                  {hasVideo && hasImage > 0 ? ", " : ""}
                </Text>
              )}
            </View>
          )}

          {hasVideo > 0 && (
            <View style={{ flexDirection: "row" }}>
              {hasVideo == 1 ? (
                <Text
                  style={[
                    styles.remarks,
                    {
                      marginLeft: hasVideo && hasImage > 0 ? 0 : normalize(30),
                    },
                  ]}
                >
                  {/* {(+", ", videoRemaining + " videos Remaining")} */}
                  {(+" ", hasVideo + " video required ( capture 1 minute)")}
                </Text>

              ) : (

                <Text
                  style={[
                    styles.remarks,
                    {
                      marginLeft: hasVideo && hasImage > 0 ? 0 : normalize(30),
                    },
                  ]}
                >
                  {/* {(+", ", videoRemaining + " videos Remaining")} */}
                  {(+" ", hasVideo + " videos required ( capture 1 minute)")}
                </Text>

              )}

            </View>
          )}

          {hasDoc > 0 && (

            <View style={{ flexDirection: "row" }}>

              {hasDoc == 1 ? (
                <Text
                  style={[
                    styles.remarksmar,
                    {
                      marginLeft: hasVideo && hasImage > 0 ? 0 : normalize(30),
                    },
                  ]}
                >
                  {/* {", " + docRemaining + " Doc Remaining"} */}
                  {" " + hasDoc + " Doc required"}
                </Text>

              ) : (

                <Text
                  style={[
                    styles.remarksmar,
                    {
                      marginLeft: hasVideo && hasImage > 0 ? 0 : normalize(30),
                    },
                  ]}
                >
                  {/* {", " + docRemaining + " Doc Remaining"} */}
                  {" " + hasDoc + " Docs required"}
                </Text>

              )}

            </View>

          )}
        </View>

        <View style={styles.viewImage_img}>

          {data.length > 0 && (
            <Text style={[styles.remarks_img]}>
              {"Captured Evidence:- " + data.length}
            </Text>

          )}

          <FlatList
            data={data}
            style={{ marginBottom: 0, marginRight: 10 }}
            keyExtractor={(i, index) => String(index)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />

          {hasImage > 0 && (
            <View>

              {/* // <TouchableOpacity onPress={openCamera}> */}
              <TouchableOpacity
                //  style={{ padding: 10 }}
                onPress={openCamera}
                activeOpacity={0.6} // adjust this value as needed
              >
                <Image
                  resizeMode="cover"
                  style={[styles.cameraHeight]}
                  source={DynamicImage.cameraIcon1}
                />
              </TouchableOpacity>
            </View>
          )}

          {hasVideo > 0 && (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={openVideo}
              activeOpacity={0.6} // adjust this value as needed
            >
              <Image
                resizeMode="cover"
                style={[styles.cameraHeight, { tintColor: "#2096f3" }]}
                source={DynamicImage.VideoIcon}
              />
            </TouchableOpacity>
          )}

        </View>

      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        {hasDocPath || docStorage.length > 0 ? (
          <View>
            <Image
              resizeMode="cover"
              style={[styles.videoeHeights]}
              source={DynamicImage.showpdf}
            />
            <Text
              style={[styles.remarks,]}
            >{pdfCount.length}</Text>

            {isLoading && (
              <ActivityIndicator size={"small"} color={COLORS.orange} />
            )}
          </View>

        ) : null}

        {isVideoLoading ? (
          <>
            <ActivityIndicator size={"small"} color={COLORS.orange} />
            <Text style={[styles.remarks, { marginTop: 5, marginLeft: 10 }]}>
              {"Video processing..."}
            </Text>
          </>
        ) : null}
      </View>

      <View style={styles.s3v}>
        <CustomeButton
          textColor={ConfigColor.white}
          label={"Upload on Server"}
          // onPress={submitData}
          onPress={() => UploadDataOnServer()}
          buttonContainerStyle={styles.container}
        />
        <CustomeButton
          textColor={ConfigColor.white}
          label={"Check Status on Server"}
          onPress={checkStatusApi}
          buttonContainerStyle={[
            styles.container,
            { backgroundColor: COLORS.orange },
          ]}
        />
      </View>
      {/* ) : null} */}

      <DisplayImage
        uri={showImage}
        dialogVisible={isPhotoViewerVisible}
        imgQuestionId={imgQuestionId}
        imgtableId={imgtableId}
        imgpos={imgpos}
        onPress={() => {
          [setIsPhotoViewerVisible(false)]
        }}
      />

      <ImageTimeStamp
        uri={capturImage}
        currentAddress={currentAddress}
        latitude={latitude + ""}
        longitude={longitude + ""}
        orientationMode={orientation}
        dialogVisible={isPhotoViewerVisibleScreenShot}
        RightCheckonPress={(uri) => {
          setIsPhotoViewerVisibleScreenShot(false);
          // setCanImage(uri);
          setCanImage([...canImage, uri]);
          //saveImageToFolder(uri, "Cleveratti");
          onImageSave(uri, 1);
        }}
        onPress={() => {
          setIsPhotoViewerVisibleScreenShot(false);
        }}
      />
      <CheckStatusmModal
        quesNo={index + 1}
        checkUploadedData={checkUploadedData}
        video={checkUploadedData?.video}
        isVisibleCheckStatus={isVisibleCheckStatus}
        setIsVisibleCheckStatus={setIsVisibleCheckStatus}
      />
    </View>
  );
};
export default ItemQuestion;
