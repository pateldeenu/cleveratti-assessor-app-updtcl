import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants/Theme";
import MenuIcon from "../../components/MenuIcon";
import normalize from "react-native-normalize";
import Loader from "../../components/Loader";
import { SearchComponent } from "../../components";
import appText from "../../utils/Localization/localization";
import { AppConfig } from "../AssessmentDetails/Utils";
import TotalBatchItem from "../../components/Componentes/TotalBatchItem";

const UploadExam = ({ navigation }) => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const [data, setData] = useState([]);

  const onChangeText = (SearchText) => {
    let userid = 1;
  };
  return (
    <>
      <SafeAreaView style={styles.constainer}>
        <View style={styles.constainer}>
          <View style={styles.viewMargin}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />

            <SearchComponent
              containerStyle={{ flex: 1, marginRight: 30 }}
              onChangeText={(text) => onChangeText(text)}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={[{ ...FONTS.h3 }, styles.text]}>
              {AppConfig.UPLOAD_ASSESSMENT}
            </Text>
          </View>

          {data?.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(i, index) => String(index)}
              showsVerticalScrollIndicator={false}
              renderItem={(item, index) => {
                return (
                  <TotalBatchItem
                    id={item.index + 1}
                    item={item?.item?.name}
                    value={item?.item?.batch?.batch_id}
                  />
                );
              }}
            />
          ) : (
            <Text style={styles.textStyle}>{appText.noDataFound}</Text>
          )}

          <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} />
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
  mainLogo: {
    opacity: 0.2,
    marginTop: 90,
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#4284f3",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: normalize(22),
  },

  textStyle: {
    fontWeight: "400",
    fontSize: 24,
    textAlign: "center",
    color: "#000",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40%",
  },
});

export default UploadExam;
