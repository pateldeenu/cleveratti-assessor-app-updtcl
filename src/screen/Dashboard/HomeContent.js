// import React, { useEffect, useState } from "react";
// import { View, FlatList, StyleSheet, Text, Alert } from "react-native";
// import ContentCard from "../../components/ContentCard";
// import { useDispatch, useSelector } from "react-redux";
// import { COLORS, FONTS } from "../../constants/Theme";
// import DynamicImage from "../../constants/DynamicImage";
// import { getAssessorTotalCountt } from "../../redux/Actions/AllContentAction";
// import {
//   createDashboardCountTable,
//   db,
//   insertDashBoardCountTable,
// } from "../../database/SqlLitedatabase";

// const HomeContent = ({ navigation }) => {

//   const dispatch = useDispatch();
//   const [dataDashaboardCount, setdataDashaboardCount] = useState([]);
//   const [loadingIndicator, setLoadingIndicator] = useState(false);
//   const [upcoming, setUpcoming] = useState("");
//   const [today, setToday] = useState("");
//   const [total, setTotal] = useState("");
//   const [complete, setComplete] = useState("");

//   const getData = async () => {
//     try {
//       setLoadingIndicator(true);

//       let dataRes = await dispatch(getAssessorTotalCountt());
//       if (dataRes.status == 200) {
//         setdataDashaboardCount(dataRes?.data);
//         let complete = dataRes?.data?.completed;
//         let today = dataRes?.data?.today;
//         let total = dataRes?.data?.batch;
//         let upcoming = dataRes?.data?.upcoming;

//         setComplete(complete);
//         setToday(today);
//         setTotal(total);
//         setUpcoming(upcoming);
//         setLoadingIndicator(false);
//         await createDashboardCountTable();

//         insertDashBoardCountTable(today, complete, upcoming, total);
//       }
//     } catch (error) {
//       alert(error);
//       setLoadingIndicator(false);
//     }
//     setLoadingIndicator(false);
//   };

//   useEffect(() => {
//   const load = async () => {
//     await fetchDashboardCount();
//   };
//   load();
// }, []);

//   useEffect(() => {
//     setComplete(dataDashaboardCount[0]?.complete);
//     setToday(dataDashaboardCount[0]?.today);
//     setTotal(dataDashaboardCount[0]?.total);
//     setUpcoming(dataDashaboardCount[0]?.upcoming);
//   }, [dataDashaboardCount]);

//   const fetchDashboardCount = async () => {
//     await createDashboardCountTable();

//     setLoadingIndicator(true);
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM table_dashboard_count",
//         [],
//         (tx, results) => {
//           var temp = [];
//           for (let i = 0; i < results.rows.length; ++i) {
//             temp.push(results.rows.item(i));
//           }
//           if (temp.length > 0) {
//             setdataDashaboardCount(temp);
//             setLoadingIndicator(false);
//           } else {
//             getData();
//           }
//         }
//       );
//     });
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         <View style={styles.viewC}>
//           <ContentCard
//             name={"Upcoming Assessment"}
//             count={upcoming}
//             leftIcon={DynamicImage.assIcon}
//             onPress={() => navigation.navigate("UpcomingAssessment")}
//           />
//           <ContentCard
//             name={"  Today's Assessments   "}
//             count={today}
//             leftIcon={DynamicImage.voiceIcon}
//             onPress={() => navigation.navigate("TodayAssessment")}
//           />
//         </View>

//         <View style={styles.viewC}>
//           <ContentCard
//             name={"Completed Assessments"}
//             count={complete}
//             leftIcon={DynamicImage.likeIcon}
//             onPress={() => navigation.navigate("CompleteAssessment")}
//           />
//           <ContentCard
//             name={"Total Batch   Assessments "}
//             count={total}
//             leftIcon={DynamicImage.rightCheck}
//             onPress={() => navigation.navigate("TotalBatch")}
//           />
//           {/* <Loader text={"Please wait..."} loading={loadingIndicator} /> */}
//         </View>
//       </View>
//     </>
//   );
// };
// export default HomeContent;

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 8,
//     overflow: "hidden",
//     margin: 10,
//   },

//   contentLeftIcon: {
//     height: 20,
//     width: 20,
//   },
//   viewC: { flexDirection: "row", width: "90%", alignItems: "center" },
//   container: {
//     height: "90%",
//     marginTop: 15,

//     backgroundColor: COLORS.white,
//   },
// });


import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import ContentCard from "../../components/ContentCard";
import { COLORS } from "../../constants/Theme";
import DynamicImage from "../../constants/DynamicImage";
import { getAssessorTotalCountt } from "../../redux/Actions/AllContentAction";
import {
  createDashboardCountTable,
  db,
  insertDashBoardCountTable,
} from "../../database/SqlLitedatabase";

const HomeContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const [dataDashboardCount, setDataDashboardCount] = useState([]);
  const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({
    upcoming: 0,
    today: 0,
    total: 0,
    complete: 0,
  });

  /** 🔹 Fetch from API and save to DB */
  const getData = async () => {
    try {
      setLoading(true);

      const dataRes = await dispatch(getAssessorTotalCountt());
      if (dataRes?.status === 200) {
        const { completed, today, batch, upcoming } = dataRes.data;
        console.log("--:dataRes.data 11--",dataRes.data)

        setCounts({
          complete: completed ?? 0,
          today: today ?? 0,
          total: batch ?? 0,
          upcoming: upcoming ?? 0,
        });

        await createDashboardCountTable();
        insertDashBoardCountTable(today, completed, upcoming, batch);
        setDataDashboardCount(dataRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Something went wrong while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Fetch from DB */
  const fetchDashboardCount = async () => {
    try {
      await createDashboardCountTable();

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM table_dashboard_count",
          [],
          (tx, results) => {
            const temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }

            if (temp.length > 0) {
              setDataDashboardCount(temp);
              setCounts({
                complete: temp[0]?.complete ?? 0,
                today: temp[0]?.today ?? 0,
                total: temp[0]?.total ?? 0,
                upcoming: temp[0]?.upcoming ?? 0,
              });
            } else {
              getData(); // if no data in DB → fetch from API
            }
          }
        );
      });
    } catch (err) {
      console.error("DB Fetch Error:", err);
    }
  };

  /** 🔹 Effect: initial fetch */
  useEffect(() => {
    const load = async () => {
      await fetchDashboardCount();
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewC}>
        <ContentCard
          name="Upcoming Assessment"
          count={counts.upcoming}
          leftIcon={DynamicImage.assIcon}
          onPress={() => navigation.navigate("UpcomingAssessment")}
        />
        <ContentCard
          name="Today's Assessments"
          count={counts.today}
          leftIcon={DynamicImage.voiceIcon}
          onPress={() => navigation.navigate("TodayAssessment")}
        />
      </View>

      <View style={styles.viewC}>
        <ContentCard
          name="Completed Assessments"
          count={counts.complete}
          leftIcon={DynamicImage.likeIcon}
          onPress={() => navigation.navigate("CompleteAssessment")}
        />
        <ContentCard
          name="Total Batch Assessments"
          count={counts.total}
          leftIcon={DynamicImage.rightCheck}
          onPress={() => navigation.navigate("TotalBatch")}
        />
      </View>
      {/* You can enable Loader if you have one */}
      {/* <Loader text="Please wait..." loading={loading} /> */}
    </View>
  );
};

export default HomeContent;
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    margin: 10,
  },

  contentLeftIcon: {
    height: 20,
    width: 20,
  },
  viewC: { flexDirection: "row", width: "90%", alignItems: "center" },
  container: {
    height: "90%",
    marginTop: 15,

    backgroundColor: COLORS.white,
  },
});
