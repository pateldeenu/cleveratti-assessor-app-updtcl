import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { COLORS, FONTS } from "../../constants/Theme";
import { SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import CompleteItem from "./CompleteItem";
import { dateFormate } from "../../utils/Utills";
import { useDispatch } from "react-redux";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import Loaders from "../../components/Loaders";
import normalize from "react-native-normalize";


const CompleteAssessment = ({ navigation }) => {
  const dispatch = useDispatch();

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  /**
   * ✅ API CALL FUNCTION (REUSABLE)
   */
  const fetchCompletedList = useCallback(async () => {
    try {
      if (!isConnected) return;

      setLoadingIndicator(true);

      const dataRes = await dispatch(getAssessorAssList("completed"));

      if (dataRes?.status === 200) {
        setData(dataRes?.data || []);
      } else {
        console.error("API Error:", dataRes);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoadingIndicator(false);
    }
  }, [dispatch, isConnected]);

  /**
   * ✅ NETWORK LISTENER (AUTO CALL WHEN ONLINE)
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected && state.isInternetReachable;

      setIsConnected(connected);

      if (!connected) {
        //Alert.alert("No Internet", "Please check your internet connection.");
      } else {
        // Auto API call when internet comes back
        fetchCompletedList();
      }
    });

    return () => unsubscribe();
  }, [fetchCompletedList]);

  /**
   * ✅ INITIAL LOAD
   */
  useEffect(() => {
    fetchCompletedList();
  }, [fetchCompletedList]);

  /**
   * 🔍 SEARCH HANDLER (kept same logic placeholder)
   */
  const onChangeText = (text) => {
    // You can implement filtering logic here if needed
  };

  /**
   * 📦 RENDER ITEM OPTIMIZED
   */
  const renderItem = useCallback(({ item, index }) => {
    return (
      <CompleteItem
        index={index}
        Batch_Id={item?.batch?.batch_id}
        Batch_name={item?.Batch_name}
        test_name={item?.name}
        startDate={dateFormate(item?.start_date)}
        endDate={dateFormate(item?.end_date)}
        duration={item?.strategy?.duration}
        BatchType={item?.BatchType}
        onPress={() => navigation.navigate("")}
      />
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          {/* TITLE */}
          <Text style={styles.title}>Completed Assessment</Text>
        </View>

        {/* CONTENT */}
        <View style={styles.viewStyle}>
          {!isConnected ? (
            <>
              <NoData message="No Internet Connection" />
            </>
          ) : data?.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${index}`}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <>
              <NoData />
            </>
          )}
        </View>

        {/* Optional Loader */}
        <Loaders text="Please wait..." loading={loadingIndicator} />
      </View>
    </SafeAreaView>
  );
};

export default CompleteAssessment;

/**
 * 🎨 STYLES (CLEANED)
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.bgBlueColor,
    marginTop: 15,
    marginBottom: 50,
  },
  viewMargin: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: COLORS.bgBlueColor,
  },
  viewStyle: {
    backgroundColor: COLORS.white,
    marginTop: 30,
    paddingTop: 5,
    flexGrow: 1,
    borderTopLeftRadius: normalize(15),
    borderTopEndRadius: normalize(15),
  },
  title: {
    ...FONTS.h3,
    textAlign: "center",
    color: "#4284f3",
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 20,
  },
});
