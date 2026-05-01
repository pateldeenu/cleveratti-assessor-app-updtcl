// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Platform,
// } from "react-native";

// import { COLORS, FONTS, SIZES } from "../constants/Theme";
// import CameraIcon from "react-native-vector-icons/Feather";
// import ImageIcon from "react-native-vector-icons/Feather";
// import { CustomeButton } from ".";
// import appText from "../utils/Localization/localization";

// const CameraModal = ({ cancel, modalVisible, openGallery, openCamera }) => {
//   const visiblaModalCom = () => {
//     return (
//       <View>
//         <View style={styles.centerVIEW}>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//               modalVisible;
//             }}
//           >
//             <View style={styles.modalView}>
//               <Text style={styles.fontFAMILY}>{appText.chooseProfile}</Text>
//               <View style={styles.center}>
//                 <View style={styles.camera}>
//                   <View
//                     style={[
//                       // Platform.OS == "ios"
//                       // styles.circleStyleIOS,
//                       // :
//                       styles.circleStyleGrey,
//                     ]}
//                   >
//                     <TouchableOpacity
//                       onPress={() => {
//                         openCamera();
//                       }}
//                     >
//                       <CameraIcon
//                         size={SIZES.iconSize}
//                         color={COLORS.orange}
//                         name="camera"
//                       />
//                     </TouchableOpacity>
//                   </View>

//                   <View
//                     style={[
//                       styles.circleStyleGrey,
//                       {
//                         borderColor: COLORS.white,
//                       },
//                     ]}
//                   >
//                     <TouchableOpacity
//                       onPress={() => {
//                         openGallery();
//                       }}
//                     >
//                       <ImageIcon
//                         size={SIZES.iconSize}
//                         color={COLORS.orange}
//                         name="image"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//                 <CustomeButton
//                   textColor={COLORS.white}
//                   label={appText.cancel}
//                   onPress={() => {
//                     cancel();
//                   }}
//                   buttonContainerStyle={styles.btnView}
//                 />
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </View>
//     );
//   };

//   return <View>{visiblaModalCom()}</View>;
// };

// export default CameraModal;
// const styles = StyleSheet.create({
//   horizontallLine: {
//     height: 1,
//     width: "100%",
//     marginTop: 5,
//     backgroundColor: COLORS.lineColor,
//   },
//   fontFAMILY: {
//     fontFamily: FONTS.latoRegularFontOnly.fontFamily,
//     color: COLORS.darkGary,
//     textAlign: "center",
//     fontWeight: "400",
//     fontSize: 18,
//     marginTop: 20,
//   },

//   btnView: {
//     height: 50,
//     width: "70%",
//     borderRadius: 14,
//     backgroundColor: COLORS.orange,
//     alignSelf: "center",
//     marginTop: 30,
//   },
//   centerVIEW: {
//     justifyContent: "center",
//     alignSelf: "center",
//     alignItems: "center",
//   },
//   camera: {
//     marginTop: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//   },

//   horizontal: {
//     marginHorizontal: 20,
//   },

//   circleStyleIOS: {
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.53,
//     shadowRadius: 13.97,

//     elevation: 10,
//   },

//   modalView: {
//     marginLeft: 20,
//     marginRight: 20,
//     marginTop: 200,
//     marginBottom: 200,
//     backgroundColor: "white",
//     borderRadius: 20,
//     height: 210,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   center: { justifyContent: "center" },
//   btn: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonContainer: {
//     width: "85%",
//     marginTop: 30,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   arrangeView: {
//     height: 50,
//     borderRadius: 50,
//     marginLeft: 36,
//     marginRight: 36,
//     marginTop: 20,
//   },

//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   textButtonStyle: {
//     backgroundColor: COLORS.orange,
//     height: 45,
//     color: COLORS.white,
//     width: "90%",
//     borderRadius: 50,
//     textAlign: "center",
//     marginLeft: 36,
//     marginRight: 36,
//     marginBottom: 30,
//     paddingVertical: 13,
//   },

//   circleStyleGrey: {
//     height: 55,
//     backgroundColor: COLORS.white,
//     width: 55,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 4,
//     marginLeft: 10,
//     borderRadius: 1000,
//     borderWidth: 2,
//     borderColor: COLORS.white,
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.97,
//   },
// });
