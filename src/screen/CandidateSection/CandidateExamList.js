import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { COLORS, FONTS } from "../../constants/Theme";
import NoData from "../../components/Nodata";
import normalize from "react-native-normalize";
import { useDispatch } from "react-redux";
import { dateFormate } from "../../utils/Utills";
import { getCandidateExamList } from "../../redux/Actions/AllContentAction";
import BatchItem from "../Audit/BatchItem";
import { AppConfig } from "../AssessmentDetails/Utils";

const CandidateExamList = ({ navigation, route }) => {
  const screen_type = route.params?.screen_type;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  const retryTimeout = useRef(null);

  // =========================
  // INITIAL LOAD + NETWORK LISTENER
  // =========================
  useEffect(() => {

    fetchData();
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);

      // ✅ Auto reload when internet comes back
      if(connected) {
        console.log("Internet Back → Reloading...");
        fetchData();
      }

    });

    return () => {
      unsubscribe();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
    
  }, []);

  // =========================
  // API CALL (WITH AUTO RETRY)
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);

      let res = await dispatch(getCandidateExamList());

      if (res?.status === 200) {
        setData(res?.data || []);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.log("API Error:", error);

      // ✅ AUTO RETRY AFTER 5 SEC
      retryTimeout.current = setTimeout(() => {
        console.log("Retrying API...");
        fetchData();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PULL TO REFRESH
  // =========================
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      let res = await dispatch(getCandidateExamList());

      if (res?.status === 200) {
        setData(res?.data || []);
      }
    } catch (error) {
      console.log("Refresh Error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // LOAD MORE (OPTIONAL)
  // =========================
  const loadMore = () => {
    console.log("Reached bottom");
  };

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem = ({ item, index }) => (
    <BatchItem
      index={index}
      audit_status={false}
      name={item?.name}
      startDate={dateFormate(item?.start_date)}
      endDate={dateFormate(item?.end_date)}
      onPress={() =>
        navigation.navigate("CandidateScreenData", {
          assessment_id: item?._id,
          attempted: item?.result_count == 1,
          screen: screen_type,
        })
      }
    />
  );

  // =========================
  // UI
  // =========================
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.viewMargin}>
          <Text style={styles.batchTitle}>
            {AppConfig.BATCH_LIST}
          </Text>
        </View>

        {/* List */}
        <View style={styles.viewStyle}>
          
          {/* 🔴 Network OFF Message */}
          {!isConnected && (
            <Text style={{ textAlign: "center", color: "red", marginBottom: 10 }}>
              No Internet Connection...
            </Text>
          )}

          {loading && data.length === 0 ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}

              // Pull to refresh
              refreshing={refreshing}
              onRefresh={onRefresh}

              // Pagination
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}

              // Empty state
              ListEmptyComponent={() => (
                <NoData message="No Batch Available" />
              )}

              // Bottom loader
              ListFooterComponent={
                loading ? <ActivityIndicator /> : null
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CandidateExamList;

// =========================
// STYLES (UNCHANGED)
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBlueColor,
  },

  viewMargin: {
    marginTop: 10,
  },

  viewStyle: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 25,
  },

  batchTitle: {
    fontWeight: "600",
    fontSize: normalize(14),
    color: COLORS.black,
    ...FONTS.h2,
    textAlign: "center",
  },
});

