import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
// import Loader from "../../components/Loader";
import ItemToday from "./ItemToday";
import { useDispatch } from "react-redux";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import normalize from "react-native-normalize";
import { AppConfig } from "../AssessmentDetails/Utils";

const UpcomingAssessment = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchUpcomingList = async () => {
    try {
      setLoadingIndicator(true);
      const dataRes = await dispatch(getAssessorAssList("upcoming"));
      if (dataRes?.status === 200) {
        setData(dataRes.data);
      } else {
        console.warn("Failed to fetch upcoming list:", dataRes);
      }
    } catch (error) {
      console.error("Error fetching upcoming list:", error);
    } finally {
      setLoadingIndicator(false);
    }
  };

  fetchUpcomingList();
}, [dispatch]);
  

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
          <View style={styles.viewStyle}>
            <View style={{ alignItems: "center" }}>
              <Text style={[{ ...FONTS.h3 }, styles.text]}>
                {"Upcoming Assessment"}
              </Text>
            </View>
            <View style={styles.viewStyle}>
              {data?.length > 0 ? (
                <FlatList
                  data={data}
                  keyExtractor={(i, index) => String(index)}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item, index) => {
                    return (
                      <ItemToday
                        Batch_Id={item.item.Batch_Id}
                        Batch_name={item.item.Batch_name}
                        test_name={item.item.test_name}
                        startDate={item.item.startDate}
                        endDate={item.item.endDate}
                        duration={item.item.duration}
                        BatchType={item.item.BatchType}
                      />
                    );
                  }}
                />
              ) : (
                <NoData />
              )}
            </View>

            {/* <Loader text={AppConfig.PLEASE_WAIT} loading={loadingIndicator} /> */}
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
    marginTop: 15,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },

  viewStyle: {
    backgroundColor: COLORS.bgBlueColor,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "100%",
    marginTop: 10,
    paddingTop: 20,
    flexGrow: 1,
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
});

export default UpcomingAssessment;
