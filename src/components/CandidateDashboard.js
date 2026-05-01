import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CandidateDashBoardScr from "../screen/CandidateSection/CandidateDashBoardScr";
import SearchComponent from "./Search";
import { COLORS } from "../constants/Theme";
import MenuIcon from "./MenuIcon";
import CandidateExamList from "../screen/CandidateSection/CandidateExamList";
// import Example from "../screen/CredentialsAuth/Example";

const CandidateDashboard = () => {
  const navigation = useNavigation();

  const onChangeText = (SearchText) => {
    let userid = 1;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        hidden={false}
        backgroundColor={COLORS.bgBlueColor}
        barStyle="light-content"
      />

      {/* 🔴 Comment this if crash happens */}
      {/* <Example /> */}

      <View style={styles.viewMargin}>
        <SearchComponent
          containerStyle={{ flex: 1 }}
          onChangeText={(text) => onChangeText(text)}
        />

        <MenuIcon onPress={() => navigation.openDrawer()} />
      </View>

      {/* <CandidateExamList navigation={navigation} /> */}
      <CandidateDashBoardScr navigation={navigation}/>      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgBlueColor,
    flex: 1,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
});

export default CandidateDashboard;



// import React from "react";
// import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
// import SearchComponent from "./Search";
// import { COLORS, FONTS, SIZES } from "../constants/Theme";
// import MenuIcon from "./MenuIcon";
// import CandidateExamList from "../screen/CandidateSection/CandidateExamList";
// import Example from "../screen/CredentialsAuth/Example";

// const CandidateDashboard = (props) => {
//   let { navigation } = props;
//   const onChangeText = (SearchText) => {
//     let userid = 1;
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar hidden backgroundColor={COLORS.bgBlueColor} />
//       <Example />
//       <View style={styles.viewMargin}>
//         <SearchComponent
//           containerStyle={{ flex: 1 }}
//           onChangeText={(text) => onChangeText(text)}
//         />
//         <MenuIcon onPress={() => navigation.openDrawer()} />
//       </View>
//       <CandidateExamList navigation={navigation} />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.bgBlueColor,
//     flex: 1,
//   },

//   viewMargin: {
//     marginTop: 10,
//     flexDirection: "row",
//     backgroundColor: COLORS.bgBlueColor,
//   },
// });

// export default CandidateDashboard;
