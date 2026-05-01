import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Dialog, {
  DialogFooter,
  DialogButton,
  ScaleAnimation,
} from "react-native-popup-dialog";
import normalize from "react-native-normalize";
import { COLORS } from "../../constants/Theme";

const { width, height } = Dimensions.get("window");

const CandidateDialogInfo = ({
  dialogVisible,
  onPress,
  item,
}) => {
  return (
    <Dialog
      overlayBackgroundColor={"#2A272F"}
      overlayOpacity={0.6}
      visible={dialogVisible}

      // ✅ Perfect centering
      containerStyle={styles.centerContainer}

      // ✅ Responsive width
      width={Math.min(width * 0.85, 400)}

      // ✅ Animation
      dialogAnimation={
        new ScaleAnimation({
          initialValue: 0,
          useNativeDriver: true,
        })
      }

      dialogStyle={styles.dialog}

      footer={
        <DialogFooter>
          <DialogButton text="OKAY" onPress={onPress} />
        </DialogFooter>
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {item?.tp || "Candidate Info"}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name :</Text>
          <Text style={styles.value}>{item?.name || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Student Id :</Text>
          <Text style={styles.value}>{item?.batch_id || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Parent Name :</Text>
          <Text style={styles.value}>{item?.parent || "-"}</Text>
        </View>
      </View>
    </Dialog>
  );
};

export default CandidateDialogInfo;

const styles = StyleSheet.create({
  // ✅ Ensures PERFECT vertical + horizontal centering
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  dialog: {
    backgroundColor: "#F4EFFC",
    borderRadius: 12,
    overflow: "hidden",
  },

  header: {
    backgroundColor: COLORS.blue,
    paddingVertical: normalize(12),
  },

  title: {
    fontSize: normalize(18),
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },

  content: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
  },

  row: {
    flexDirection: "row",
    marginTop: normalize(10),
    alignItems: "center",
  },

  label: {
    width: "45%",
    fontSize: normalize(15),
    fontWeight: "600",
    color: COLORS.textColors,
  },

  value: {
    width: "55%",
    fontSize: normalize(15),
    fontWeight: "600",
    color: COLORS.textColors,
  },
});




// import React, { useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Dialog, {
//   DialogFooter,
//   ScaleAnimation,
// } from "react-native-popup-dialog";
// import normalize from "react-native-normalize";
// import { CustomeButton } from "../../components";
// import { COLORS, FONTS, SIZES } from "../../constants/Theme";
// import { ConfigColor } from "../AssessmentDetails/Utils";

// const CandidateDialogInfo = ({
//   dialogVisible,
//   title,
//   content,
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
//         dialogStyle={{ backgroundColor: "#F4EFFC" }}
//         footer={
//           <DialogFooter style={styles.buttonContainerStyle}>
//             <View style={styles.btnV}>
//               <CustomeButton
//                 textColor={ConfigColor.white}
//                 label={"Okay"}
//                 labelStyle={{ fontSize: 14 }}
//                 onPress={onPress}
//                 buttonContainerStyle={[styles.container]}
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
//           <Text style={styles.title2}>{item?.tp}</Text>
//         </View>

//         <View style={[{ borderColor: COLORS.blue }]}>
//           <View style={[styles.mar10, styles.viewRow]}>
//             <Text
//               style={[styles.tIds, styles.tIds2, { color: COLORS.textColors }]}
//             >
//               {"Student Name :"}
//             </Text>
//             <Text style={[styles.tIds]}>{item?.name}</Text>
//           </View>
//           <View style={[styles.mar10, styles.viewRow]}>
//             <Text style={[styles.tIds, styles.tIds2]}>{"Student Id :"}</Text>
//             <Text style={[styles.tIds]}>{item?.batch_id}</Text>
//           </View>

//           <View style={[styles.mar10, styles.viewRow]}>
//             <Text style={[styles.tIds, styles.tIds2]}>{"Parent name :"}</Text>
//             <Text style={[styles.tIds]}>{item?.parent}</Text>
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
//   btnV: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "center",
//     width: "80%",
//     justifyContent: "center",
//   },
//   mar10: { marginTop: normalize(10) },

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
//     width: "45%",
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

// export default CandidateDialogInfo;
