



import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';


export default function App() {
  const camera = useRef(null);
  const [cameraPermission, setCameraPermission] = useState();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status);
    })();
  }, []);

  // const cameraDevice = useCameraDevice('back');

  const backDevice = useCameraDevice('back');
  const frontDevice = useCameraDevice('front');

  if (!backDevice || !frontDevice) return null;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.saveArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>React Native Camera Libraries</Text>
        </View>
      </SafeAreaView>

       <View style={styles.container}>
      {/* Back Camera Preview */}
      <Camera 
        style={styles.fullScreen} 
        device={backDevice} 
        isActive={true} 
      />
      
      {/* Front Camera Floating Preview */}
      <View style={styles.floatingPreview}>
        <Camera 
          style={styles.fill} 
          device={frontDevice} 
          isActive={true} 
        />
      </View>
    </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  saveArea: {
    backgroundColor: '#3D8361',
  },
  header: {
    height: 50,
    backgroundColor: '#3D8361',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },


    container: { flex: 1 },
  fullScreen: { ...StyleSheet.absoluteFillObject },
  floatingPreview: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden'
  },
  fill: { flex: 1 }
  
});




// import React, { useState, useEffect, useRef } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   TextInput,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import {
//   Camera,
//   useCameraDevices,
//   useFrameProcessor,
// } from 'react-native-vision-camera';
// import { useCameraDevice } from 'react-native-vision-camera';
// import RNFS from 'react-native-fs';
// import DropDownPicker from 'react-native-dropdown-picker';
// import Video from 'react-native-video';
// // import { Video } from 'react-native-video'; // WRONG

// export default function App() {
//   const camera = useRef(null);
//   const [cameraPermission, setCameraPermission] = useState();
//   const [open, setOpen] = useState(false);
//   const [currentExample, setCurrentExample] = useState('take-photo');
//   const [photoPath, setPhotoPath] = useState();
//   const [snapshotPath, setSnapshotPath] = useState();
//   const [videoPath, setVideoPath] = useState();
//   const [isRecording, setIsRecording] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       setCameraPermission(status);
//     })();
//   }, []);

//   const cameraDevice = useCameraDevice('back');

//   const handleTakePhoto = async () => {
//     try {
//       const photo = await camera.current.takePhoto({
//         flash: 'on',
//       });
//       setPhotoPath(photo.path);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const renderTakingPhoto = () => {
//     return (
//       <View>
//         <Camera
//           ref={camera}
//           style={[styles.camera, styles.photoAndVideoCamera]}
//           device={cameraDevice}
//           isActive
//           photo
//         />
//         <TouchableOpacity style={styles.btn} onPress={handleTakePhoto}>
//           <Text style={styles.btnText}>Take Photo</Text>
//         </TouchableOpacity>
//         {console.log("--:photoPath--", photoPath)}
//         {photoPath && (
//           <Image style={styles.image} source={{ uri: photoPath }} />
//         )}
//       </View>
//     );
//   };

//   const handleRecordVideo = async () => {
//     if (!camera.current || isRecording) return;

//     try {
//       setIsRecording(true);

//       await camera.current.startRecording({
//         flash: 'off',
//         onRecordingFinished: async video => {
//           try {
//             // 📁 Step 1: Define folder path
//             const folderPath = `${RNFS.ExternalDirectoryPath}/Practical`;

//             // 📁 Step 2: Create folder if not exists
//             const folderExists = await RNFS.exists(folderPath);

//             if (!folderExists) {
//               await RNFS.mkdir(folderPath);
//               console.log("Folder created:", folderPath);
//             }

//             // 🎥 Step 3: Define new file path inside folder
//             const newPath = `${folderPath}/video_${Date.now()}.mp4`;

//             // 📦 Step 4: Move file
//             await RNFS.moveFile(video.path, newPath);

//             // ✅ Step 5: Verify file
//             const exists = await RNFS.exists(newPath);
//             console.log("FILE EXISTS:", exists);

//             if (!exists) {
//               console.log("File not found after move!");
//               return;
//             }

//             console.log("NEW PATH:", newPath);
//             captureVideos(newPath)
//             setIsRecording(false);

//           } catch (e) {
//             console.log("MOVE ERROR:", e);
//             setIsRecording(false);
//           }
//         }
//         ,
//         onRecordingError: error => {
//           console.error("Recording error:", error);
//           setIsRecording(false);
//         },
//       });
//     } catch (e) {
//       console.log("Start error:", e);
//       setIsRecording(false);
//     }
//   };

//   const handleStopVideo = async () => {
//     if (!camera.current || !isRecording) return;

//     try {
//       await camera.current.stopRecording();
//     } catch (e) {
//       console.log("Stop error:", e);
//     }
//   };


//   const captureVideos = (video_uri) => {
//     const targetDirectory = 'file://' + RNFS.PicturesDirectoryPath + '/Claveratti_Vision/AssessmentVideos'; // Specify the target directory 
//     moveImageToDirectoryWithoutCompress(video_uri, targetDirectory);
//   };

//   //Save Image timeStamp wise In Internal folder 
//   const moveImageToDirectoryWithoutCompress = (filePath, targetDirectory) => {
//     const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
//     const targetFilePath = `${targetDirectory}/${fileName}`;
//     return RNFS.mkdir(targetDirectory)
//       .then(() => {
//         return RNFS.moveFile(filePath, targetFilePath)
//           .then(() => {
//             (targetFilePath);
//             setTimeout(() => {
//               // console.log('Delayed action executed after 2000 milliseconds');
//               setVideoPath(targetFilePath);
//               console.log('--:Delayed action executed after 2000 milliseconds:targetFilePath:--', targetFilePath);
//             }, 500);
//           })
//           .catch(error => {

//           });
//       })
//       .then(() => {
//         // console.log('Video saved successfully.');
//       })
//       .catch(error => {
//       });
//   };

//   const renderRecordingVideo = () => {
//     return (
//       <View>
//         <Camera
//           ref={camera}
//           style={[styles.camera, styles.photoAndVideoCamera]}
//           device={cameraDevice}
//           isActive
//           video
//         />
//         <View style={styles.btnGroup}>
//           <TouchableOpacity
//             style={styles.btn}
//             onPress={handleRecordVideo}
//             disabled={isRecording}
//           >
//             <Text style={styles.btnText}>Record Video</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{ ...styles.btn }}
//             onPress={handleStopVideo}
//             disabled={!isRecording}
//           >
//             <Text style={styles.btnText}>Stop Video</Text>
//           </TouchableOpacity>
//         </View>
//         {/* {videoPath && (
//           <Video source={{ uri: videoPath }} style={styles.video} />
//         )} */}

//         {videoPath ? (
//           <Video
//             source={{ uri: videoPath }}
//             style={styles.video}
//             controls
//             resizeMode="cover"
//             onError={(e) => console.log("VIDEO ERROR:", e)}
//           />
//         ) : null}

//       </View>
//     );
//   };

//   const handleTakeSnapshot = async () => {
//     try {
//       const snapshot = await camera.current.takeSnapshot({
//         quality: 85,
//         skipMetadata: true,
//       });
//       setSnapshotPath(snapshot.path);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const renderTakingSnapshot = () => {
//     return (
//       <View>
//         <Camera
//           ref={camera}
//           style={[styles.camera, styles.photoAndVideoCamera]}
//           device={cameraDevice}
//           isActive
//           photo
//         />
//         <TouchableOpacity style={styles.btn} onPress={handleTakeSnapshot}>
//           <Text style={styles.btnText}>Take Snapshot</Text>
//         </TouchableOpacity>
//         {snapshotPath && (
//           <Image style={styles.image} source={{ uri: snapshotPath }} />
//         )}
//       </View>
//     );
//   };

//   const renderContent = () => {
//     if (!cameraDevice) {
//       return <ActivityIndicator size="large" color="#1C6758" />;
//     }
//     if (cameraPermission !== 'granted') {
//       return <Text>Camera permission not granted</Text>;
//     }

//     switch (currentExample) {
//       case 'take-photo':
//         return renderTakingPhoto();
//       case 'record-video':
//         return renderRecordingVideo();
//       case 'take-snapshot':
//         return renderTakingSnapshot();
//       default:
//         return null;
//     }
//   };

//   const handleChangePicketSelect = value => {
//     setPhotoPath(null);
//     setSnapshotPath(null);
//     setVideoPath(null);
//     setCurrentExample(value);
//   };

//   return (
//     <View style={styles.screen}>
//       <SafeAreaView style={styles.saveArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerText}>React Native Camera Libraries</Text>
//         </View>
//       </SafeAreaView>

//       <View style={styles.caption}>
//         <Text style={styles.captionText}>
//           Welcome To React-Native-Vision-Camera Tutorial
//         </Text>
//       </View>

//       <View style={styles.dropdownPickerWrapper}>
//         <DropDownPicker
//           open={open}
//           value={currentExample}
//           items={[
//             { label: 'Take Photo', value: 'take-photo' },
//             { label: 'Record Video', value: 'record-video' },
//             { label: 'Take Snapshot', value: 'take-snapshot' },
//           ]}
//           setOpen={setOpen}
//           setValue={handleChangePicketSelect}
//         />
//       </View>

//       {renderContent()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#EEF2E6',
//   },
//   saveArea: {
//     backgroundColor: '#3D8361',
//   },
//   header: {
//     height: 50,
//     backgroundColor: '#3D8361',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerText: {
//     color: '#ffffff',
//     fontSize: 20,
//   },
//   caption: {
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   captionText: {
//     color: '#100F0F',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     height: 460,
//     width: '92%',
//     alignSelf: 'center',
//   },
//   photoAndVideoCamera: {
//     height: 360,
//   },
//   barcodeText: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     textAlign: 'center',
//     color: '#100F0F',
//     fontSize: 24,
//   },
//   pickerSelect: {
//     paddingVertical: 12,
//   },
//   image: {
//     marginHorizontal: 16,
//     paddingTop: 8,
//     width: 80,
//     height: 80,
//   },
//   dropdownPickerWrapper: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     zIndex: 9,
//   },
//   btnGroup: {
//     margin: 16,
//     flexDirection: 'row',
//   },
//   btn: {
//     backgroundColor: '#63995f',
//     margin: 13,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderRadius: 8,
//   },
//   btnText: {
//     color: '#ffffff',
//     fontSize: 20,
//     textAlign: 'center',
//   },
//   video: {
//     marginHorizontal: 16,
//     height: 100,
//     width: 80,
//     position: 'absolute',
//     right: 0,
//     bottom: -80,
//   },
// });



// import React, {useRef, useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import DualCameraView from '../../components/DualCameraView';
// import RNFS from 'react-native-fs';

// export default function CameraScreen() {
//   const cameraRef = useRef(null);
//   const [recording, setRecording] = useState(false);
//   const [hasPermissions, setHasPermissions] = useState(false);
//   const [permissionsResolved, setPermissionsResolved] = useState(false);

//   // =========================
//   // 🔐 PERMISSIONS
//   // =========================
//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS !== 'android') {
//       setHasPermissions(true);
//       setPermissionsResolved(true);
//       return;
//     }

//     try {
//       const permissions = [
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//       ];
//       if (Platform.Version < 29) {
//         permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//       }

//       const granted = await PermissionsAndroid.requestMultiple(permissions);
//       const allGranted = permissions.every(
//         permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED,
//       );

//       setHasPermissions(allGranted);
//       setPermissionsResolved(true);

//       if (!allGranted) {
//         Alert.alert('Permission required', 'Please allow camera and microphone permissions.');
//       }
//     } catch (err) {
//       setHasPermissions(false);
//       setPermissionsResolved(true);
//       console.warn(err);
//     }
//   };

//   // =========================
//   // 🎥 START RECORDING
//   // =========================
//   const startRecording = async () => {
//     if (!cameraRef.current) return;

//     await RNFS.mkdir(RNFS.ExternalDirectoryPath);
//     const path = `${RNFS.ExternalDirectoryPath}/dualcam_${Date.now()}.mp4`;
//     console.log("--:path--",path)
//     cameraRef.current.startRecording(path);

//     setRecording(true);
//     // Alert.alert('Recording Started', path);
//   };

//   // =========================
//   // ⏹ STOP RECORDING
//   // =========================
//   const stopRecording = () => {
//     if (!cameraRef.current) return;
//     cameraRef.current.stopRecording();

//     setRecording(false);
//     // Alert.alert('Recording Saved');
//   };

//   // =========================
//   // UI
//   // =========================
//   return (
//     <View style={styles.container}>
//       {hasPermissions ? (
//         <DualCameraView ref={cameraRef} style={styles.camera} />
//       ) : (
//         <View style={styles.permissionState}>
//           <Text style={styles.permissionText}>
//             {permissionsResolved
//               ? 'Camera permission is required before preview can start.'
//               : 'Requesting camera permission...'}
//           </Text>
//         </View>
//       )}

//       <View style={styles.controls}>
//         {!recording ? (
//           <Button title="Start Recording" onPress={startRecording} disabled={!hasPermissions} />
//         ) : (
//           <Button title="Stop Recording" onPress={stopRecording} />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     flex: 1,
//   },
//   permissionState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
//   permissionText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//   },
// });
