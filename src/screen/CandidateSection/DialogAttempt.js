// import React, { useState } from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import Dialog, {
//   DialogFooter,
//   ScaleAnimation,
// } from "react-native-popup-dialog";
// import normalize from "react-native-normalize";
// import { CustomeButton } from "../../components";
// import { COLORS, FONTS, SIZES } from "../../constants/Theme";
// import { ConfigColor } from "../AssessmentDetails/Utils";

// const DialogAttempt = ({
//   dialogVisible,
//   total,
//   content,
//   attemptedQues,
//   desc,
//   onPress,
//   item,
//   buttonText = "OKAY",
// }) => {
//   return (
//     <View>
//       <Dialog
//         overlayBackgroundColor={"#2A272F"}
//         overlayOpacity={0.6}
//         overlayPointerEvents={"none"}
//         width={"80%"}
//         visible={dialogVisible}
//         dialogAnimation={
//           new ScaleAnimation({
//             initialValue: 0, // optional
//             useNativeDriver: true, // optional
//           })
//         }
//         dialogStyle={{ backgroundColor: ConfigColor.white }}
//         footer={
//           <DialogFooter style={styles.buttonContainerStyle}>
//             <View style={styles.viewM}>
//               <CustomeButton
//                 textColor={"#fff"}
//                 label={"Okay"}
//                 labelStyle={{ fontSize: 14 }}
//                 onPress={onPress}
//                 buttonContainerStyle={[
//                   styles.container,
//                   { backgroundColor: COLORS.blue, alignSelf: "center" },
//                 ]}
//               />
//             </View>
//           </DialogFooter>
//         }
//       >
//         <View
//           style={{
//             backgroundColor: COLORS.blue,
//             paddingVertical: normalize(10),
//           }}
//         >
//           <Text style={styles.title2}>{"Alert!"}</Text>
//         </View>

//         <View style={[{ borderColor: COLORS.blue }]}>
//           <View style={[{ marginTop: normalize(20) }, styles.viewRow]}>
//             <Text
//               style={[styles.tIds, styles.tIds2, { color: COLORS.textColors }]}
//             >
//               {"Total Question"}
//             </Text>
//             <Text style={[styles.tIds]}>{total}</Text>
//           </View>
//           <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
//             <Text style={[styles.tIds, styles.tIds2]}>
//               {"Attempted Question"}
//             </Text>
//             <Text style={[styles.tIds, { color: "green" }]}>
//               {attemptedQues}
//             </Text>
//           </View>
//           <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
//             <Text style={[styles.tIds, styles.tIds2]}>
//               {"Not Attempted Question"}
//             </Text>
//             <Text style={[styles.tIds, { color: "red" }]}>
//               {total - attemptedQues}
//             </Text>
//           </View>
//         </View>
//       </Dialog>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   buttonContainerStyle: {
//     borderColor: "transparent",
//     alignSelf: "center",
//     marginTop: 20,
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   title2: {
//     fontFamily: "Lato-Bold",
//     fontSize: normalize(20),
//     fontWeight: "700",
//     alignSelf: "center",

//     color: "#fff",
//   },

//   container: {
//     borderRadius: 10,
//     height: normalize(45),
//     backgroundColor: COLORS.blue,
//     justifyContent: "center",
//     marginVertical: normalize(10),
//     alignItems: "center",
//     width: "80%",
//   },

//   tIds2: {
//     marginLeft: normalize(20),
//     width: "60%",
//   },
//   viewM: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "center",
//     width: "80%",
//     justifyContent: "center",
//   },
//   tIds: {
//     fontWeight: "700",
//     fontSize: normalize(17),
//     color: COLORS.textColors,
//     fontFamily: "Lato-Bold",
//     width: "60%",
//     paddingVertical: 5,
//   },
//   viewRow: {
//     backgroundColor: "#F5FCFF",
//     flexDirection: "row",
//   },

//   container: {
//     height: 45,
//     width: "100%",
//     borderRadius: 14,
//     marginHorizontal: SIZES.padding,
//     backgroundColor: COLORS.blue,
//     marginVertical: 20,
//     paddingHorizontal: 60,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   desc: {
//     marginTop: 10,
//     fontFamily: "Inter",
//     fontSize: normalize(15),
//     fontWeight: "400",
//     color: "#3A3454",
//     // opacity: 0.7,
//   },
// });

// export default DialogAttempt;


import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Modal from "react-native-modal"; // ✅ using react-native-modal
import normalize from "react-native-normalize";
import { CustomeButton } from "../../components";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { ConfigColor } from "../AssessmentDetails/Utils";

const DialogAttempt = ({
  dialogVisible,
  total,
  attemptedQues,
  onPress,
}) => {
  return (
    <Modal
      isVisible={dialogVisible}
      backdropOpacity={0.6}
      backdropColor={"#2A272F"}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver
      style={styles.modal}
      onBackdropPress={onPress} // close if user taps outside
    >
      <View style={styles.dialogContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title2}>{"Alert!"}</Text>
        </View>

        {/* Content */}
        <View style={styles.contentWrapper}>
          <View style={[{ marginTop: normalize(20) }, styles.viewRow]}>
            <Text
              style={[styles.tIds, styles.tIds2, { color: COLORS.textColors }]}
            >
              {"Total Question"}
            </Text>
            <Text style={[styles.tIds]}>{total}</Text>
          </View>

          <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
            <Text style={[styles.tIds, styles.tIds2]}>
              {"Attempted Question"}
            </Text>
            <Text style={[styles.tIds, { color: "green" }]}>{attemptedQues}</Text>
          </View>

          <View style={[{ marginTop: normalize(10) }, styles.viewRow]}>
            <Text style={[styles.tIds, styles.tIds2]}>
              {"Not Attempted Question"}
            </Text>
            <Text style={[styles.tIds, { color: "red" }]}>
              {total - attemptedQues}
            </Text>
          </View>
        </View>

        {/* Footer with button */}
        <View style={styles.footer}>
          <CustomeButton
            textColor={"#fff"}
            label={"Okay"}
            labelStyle={{ fontSize: 14 }}
            onPress={onPress}
            buttonContainerStyle={[
              styles.okayButton,
              { backgroundColor: COLORS.blue, alignSelf: "center" },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0, // removes default margin from react-native-modal
  },
  dialogContainer: {
    width: "80%",
    backgroundColor: ConfigColor.white,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: COLORS.blue,
    paddingVertical: normalize(10),
  },
  title2: {
    fontFamily: "Lato-Bold",
    fontSize: normalize(20),
    fontWeight: "700",
    alignSelf: "center",
    color: "#fff",
  },
  contentWrapper: {
    paddingHorizontal: normalize(10),
    paddingBottom: normalize(10),
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    paddingVertical: 15,
  },
  okayButton: {
    height: 45,
    width: "80%",
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  tIds2: {
    marginLeft: normalize(20),
    width: "60%",
  },
  tIds: {
    fontWeight: "700",
    fontSize: normalize(17),
    color: COLORS.textColors,
    fontFamily: "Lato-Bold",
    width: "60%",
    paddingVertical: 5,
  },
  viewRow: {
    backgroundColor: "#F5FCFF",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DialogAttempt;
