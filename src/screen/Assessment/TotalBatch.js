import React, { useEffect, useState,useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/Theme";
import { SearchComponent } from "../../components";
import MenuIcon from "../../components/MenuIcon";
import NoData from "../../components/Nodata";
import { useDispatch } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { getAssessorAssList } from "../../redux/Actions/AllContentAction";
import { AppConfig } from "../AssessmentDetails/Utils";
import TotalBatchItem from "../../components/Componentes/TotalBatchItem";
import Loaders from "../../components/Loaders";
import normalize from "react-native-normalize";

const TotalBatch = ({ navigation }) => {
  const dispatch = useDispatch();
  // const [loadingIndicator, setLoadingIndicator] = useState(false);
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchAttendanceList = async () => {
  //     try {
  //       setLoadingIndicator(true);
  //       const dataRes = await dispatch(getAssessorAssList("all"));
  //       if (dataRes?.status === 200) {
  //         setData(dataRes.data);
  //       } else {
  //         console.error("Failed to fetch attendance list:", dataRes);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching attendance list:", error);
  //     } finally {
  //       setLoadingIndicator(false);
  //     }
  //   };

  //   fetchAttendanceList();
  // }, [dispatch]);
  // const onChangeText = (SearchText) => {
  //   let userid = 1;
  // };




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

      const dataRes = await dispatch(getAssessorAssList("all"));

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
      <TotalBatchItem
        id={index + 1}
        item={item?.name}
        value={item?.batch?.batch_id}
      />
    );
  }, [navigation]);


  return (
    <>
     <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.viewMargin}>
          <MenuIcon onPress={() => navigation.goBack()} back="back" />
          {/* TITLE */}
          <Text style={styles.title}>{AppConfig.TOTAL_BATCH}</Text>
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
    </>
  );
};

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

export default TotalBatch;
