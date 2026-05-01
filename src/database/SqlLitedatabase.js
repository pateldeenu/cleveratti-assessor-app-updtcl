import SimpleToast from "react-native-simple-toast";
import { openDatabase } from "react-native-sqlite-storage";
import { consoleLog } from "../utils/Utills";

export const db = openDatabase({ name: "UserDatabase.db" });

// create assessor Login  Table
export const createLoginTable = () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_login'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql("DROP TABLE IF EXISTS table_login", []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS table_login(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(40), user_password VARCHAR(40),  candidateId,  ParentName, token, roleType VARCHAR(40), mobile VARCHAR(40), name VARCHAR(40))",
            []
          );
        }
      }
    );
  });
};

// create assessor Question  Table
// export const createQuestTable = async () => {
//   db.transaction(function (txn) {
//     txn.executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='question_table'",
//       [],
//       function (tx, res) {
//         if (res.rows.length == 0) {
//           txn.executeSql("DROP TABLE IF EXISTS question_table", []);
//           txn.executeSql(
//             "CREATE TABLE IF NOT EXISTS question_table(id INTEGER PRIMARY KEY AUTOINCREMENT,q_id VARCHAR(50), quest, has_doc, has_img, has_video,has_time, batch_id VARCHAR(40),remarks VARCHAR(100),has_video_path, has_doc_path,evidence_type)",
//             []
//           );
//         }
//       }
//     );
//   });
// };

export const createQuestTable = async () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "CREATE TABLE IF NOT EXISTS question_table (id INTEGER PRIMARY KEY AUTOINCREMENT, q_id VARCHAR(50), quest, has_doc, has_img, has_video, has_time, batch_id VARCHAR(40), remarks VARCHAR(100), has_video_path, has_doc_path, evidence_type)",
      []
    );
  });
};

export const insertQuestionTable = (
  id,
  question,
  hasDoc,
  hasImage,
  hasVideo,
  hasTime,
  batch_id,
  remarks,
  has_video_path,
  has_doc_path,
  evidence_type
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO question_table(q_id, quest, has_doc, has_img, has_video,has_time, batch_id,remarks,has_video_path, has_doc_path,evidence_type) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        id,
        question,
        hasDoc,
        hasImage,
        hasVideo,
        hasTime,
        batch_id,
        remarks,
        has_video_path,
        has_doc_path,
        evidence_type
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "question database failed");
      }
    );
  });
};

export const updateQuestion_Remarks = (remarks, q_id, batch_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE question_table SET remarks=? where q_id=? and batch_id=?",
      [remarks, q_id, batch_id],
      (tx, results) => {
       // console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          // Alert.alert('Remarks Updated Successfully...')
        } else {
          // Alert.alert('Error');
        }
      }
    );
  });
};
export const updateCandidateListTable = (viva_count, cand_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE assess_candindateList_table SET viva_count=? where cand_id=?",
      [viva_count, cand_id],
      (tx, results) => {
       // console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          // Alert.alert('Remarks Updated Successfully...')
        } else {
          // Alert.alert('Error');
        }
      }
    );
  });
};

export const updateDemo = (demo_count, cand_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE assess_candindateList_table SET demo_count=? where cand_id=?",
      [demo_count, cand_id],
      (tx, results) => {
        //console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          // Alert.alert('Remarks Updated Successfully...')
        } else {
          // Alert.alert('Error');
        }
      }
    );
  });
};

// "UPDATE question_table SET has_video_path=? where q_id=? and batch_id=? and evidence_type=?",
export const updateQuestion_Video = (has_video_path,evidence_type,q_id, batch_id,) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE question_table SET has_video_path=? ,evidence_type=? where q_id=? and batch_id=?",
      [has_video_path,evidence_type, q_id, batch_id],
      (tx, results) => {
       // console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
        } else {
        }
      }
    );
  });
};

export const updateQuestion_Doc = (has_doc_path,evidence_type, q_id, batch_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE question_table SET has_doc_path=? ,evidence_type=? where q_id=? and batch_id=?",
      [has_doc_path,evidence_type, q_id, batch_id],
      (tx, results) => {
        //console.log("Results", results.rowsAffected); 
        if (results.rowsAffected > 0) {
        } else {
        }
      }
    );
  });
};

export const deleteQuestion = () => {
  db.transaction((tx) => {
    tx.executeSql("DROP TABLE IF EXISTS question_table", [], (tx, results) => {
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.");
        consoleLog("dleted question table", "sucess");
      } else {
      }
    });
  });
};

export const insertLoginTable = (
  userName,
  password,
  candidateId,
  ParentName,
  roleType,
  name,
  token,
  mobile
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO table_login(user_name, user_password, candidateId,  ParentName,  token, roleType, mobile, name) VALUES (?,?,?,?,?,?,?,?)",
      [
        userName,
        password,
        candidateId,
        ParentName,
        token,
        roleType,
        mobile,
        name,
      ],
      (tx, results) => {
        consoleLog("darabase", results.rowsAffected);
        if (results.rowsAffected > 0) {
          consoleLog("error", "Login database successfuly");
        } else consoleLog("error", "Login database failed");
      }
    );
  });
};

// create  Assessor Dshboard count  Table
// export const createDashboardCountTable = () => {
//   db.transaction(function (txn) {
//     txn.executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='table_dashboard_count'",
//       [],
//       function (tx, res) {
//         if (res.rows.length == 0) {
//           txn.executeSql("DROP TABLE IF EXISTS table_dashboard_count", []);
//           txn.executeSql(
//             "CREATE TABLE IF NOT EXISTS table_dashboard_count(user_id INTEGER PRIMARY KEY AUTOINCREMENT, today VARCHAR(40), complete VARCHAR(40), upcoming VARCHAR(40), total VARCHAR(40))",
//             []
//           );
//         }
//       }
//     );
//   });
// };


// Create Assessor Dashboard Count Table
export const createDashboardCountTable = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `SELECT name 
         FROM sqlite_master 
        WHERE type='table' AND name='table_dashboard_count'`,
      [],
      (tx, res) => {
        if (res.rows.length === 0) {
          // Drop old table if exists
          txn.executeSql("DROP TABLE IF EXISTS table_dashboard_count");

          // Create new table
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS table_dashboard_count (
                user_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                today     TEXT,
                complete  TEXT,
                upcoming  TEXT,
                total     TEXT
             )`
          );
        }
      },
      (error) => {
        console.error("Error checking table_dashboard_count:", error);
      }
    );
  });
};

//
export const insertDashBoardCountTable = (today, complete, upcoming, total) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO table_dashboard_count(today, complete, upcoming, total) VALUES (?,?,?,?)",
      [today, complete, upcoming, total],
      (tx, results) => {
        consoleLog("darabase", results.rowsAffected);
        if (results.rowsAffected > 0) {
          consoleLog("error", "dashaboard database count  successfully");
        } else consoleLog("error", "Login database failed");
      }
    );
  });
};

// create assessor Question  Table
export const createAssessQuestionTable = async () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='assess_question_table'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql("DROP TABLE IF EXISTS assess_question_table", []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS assess_question_table(id INTEGER PRIMARY KEY AUTOINCREMENT,q_id VARCHAR(50),assessment_id, batchId,  quest, max_mark, isSelected, remarks, selected_mark, canPhotoPath, canIdPath, canPhotoWithIdPath,videoUri, examType,answer,time, latitude, longitude, location,vdrecord)",
            []
          );
        }
      }
    );
  });
};

export const insertAssessQuestionTableTable = (
  q_id,
  assessment_id,
  batchId,
  quest,
  max_mark,
  isSelected,
  remarks,
  selected_mark,
  canPhotoPath,
  canIdPath,
  canPhotoWithIdPath,
  videoUri,
  examType,
  answer,
  time,
  latitude,
  longitude,
  location,
  vdrecord
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO assess_question_table(q_id,assessment_id, batchId, quest, max_mark, isSelected, remarks, selected_mark, canPhotoPath, canIdPath, canPhotoWithIdPath,videoUri, examType,answer,time, latitude, longitude, location,vdrecord) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        q_id,
        assessment_id,
        batchId,
        quest,
        max_mark,
        isSelected,
        remarks,
        selected_mark,
        canPhotoPath,
        canIdPath,
        canPhotoWithIdPath,
        videoUri,
        examType,
        answer,
        time,
        latitude,
        longitude,
        location,
        vdrecord
      ],
      (tx, results) => {
        consoleLog("darabase", results.rowsAffected);
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "Login database failed");
      }
    );
  });
};

//deletebatchs
export const deleteVivaDemoQuestion = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM assess_question_table", (tx, results) => {
      // console.log("Results", results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log("Deleted data sucessfully.")
      } else {
      }
    });
  });
};

// create Candidate BatchList Table
export const createCandidateBatchTable = async () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='candidate_batchList_table'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql("DROP TABLE IF EXISTS candidate_batchList_table", []);
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS candidate_batchList_table(id INTEGER PRIMARY KEY AUTOINCREMENT,batch_id VARCHAR(50),audit_status, strategy_id VARCHAR(50), strategy_duration,name VARCHAR(40), start_date VARCHAR(40), end_date VARCHAR(40),result_count)",
            []
          );
        }
      }
    );
  });
};

//inset candidate batchList in table
export const insertCandidateBatchListTable = (
  batch_id,
  audit_status,
  strategy_id,
  strategy_duration,
  name,
  start_date,
  end_date,
  result_count
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO candidate_batchList_table(batch_id,  audit_status, strategy_id, strategy_duration, name, start_date, end_date,result_count) VALUES (?,?,?,?,?,?,?,?)",
      [
        batch_id,
        audit_status,
        strategy_id,
        strategy_duration,
        name,
        start_date,
        end_date,
        result_count,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "batchList table database failed");
      }
    );
  });
};

//deleteUser
export const deleteCandiadateBatchListTable = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM candidate_batchList_table ", (tx, results) => {
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.", 0);
      } else {
      }
    });
  });
};
//deleteUser
export const deleteAssessQuesTable = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM assess_question_table ", (tx, results) => {
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.");
      } else {
      }
    });
  });
};

//deleteUser
export const deleteUser = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM table_login ", (tx, results) => {
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.");
      } else {
      }
    });
  });
};

// create batches Table
// export const createBatchesTable = () => {
//   db.transaction(function (txn) {
//     txn.executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='batch_table'",
//       [],
//       function (tx, res) {
//         if (res.rows.length == 0) {
//           txn.executeSql("DROP TABLE IF EXISTS batch_table", []);
//           txn.executeSql(
//             "CREATE TABLE IF NOT EXISTS batch_table(id INTEGER PRIMARY KEY AUTOINCREMENT,assessment_id, batch_id, start_date,end_date,status,_id)",
//             []
//           );
//           consoleLog("Created", "batch_table is created Successfully.");
//         }
//       }
//     );
//   });
// };

export const createBatchesTable = () => {
  db.transaction(function (txn) {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS batch_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id,
        batch_id,
        start_date,
        end_date,
        status,
        _id
      )`,
      [],
      () => {
        console.log("batch_table is ready.");
      },
      (error) => {
        console.error("Error creating batch_table:", error);
      }
    );
  });
};



// "UPDATE batch table status wise SET has_video_path=? where q_id=? and batch_id=? and evidence_type=?",
export const updateBatch_StatusWise = (status,batch_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE batch_table SET status=? where batch_id=?",
      [status, batch_id],
      (tx, results) => {
       // console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
        } else {
        }
      }
    );
  });
};

export const insertBatchesTable = (
  assessment_id,
  batch_id,
  start_date,
  end_date,
  status,
  _id
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO batch_table(assessment_id, batch_id, start_date, end_date,status,_id) VALUES (?,?,?,?,?,?)",
      [assessment_id, batch_id, start_date, end_date, status,_id],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "batch_table database failed");
      }
    );
  });
};

//getAll Batches Data
export  const getBatchTableData = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM batch_table",
          [],
          (tx, results) => {
            const len = results.rows.length;
            const data = [];
            for (let i = 0; i < len; i++) {
              data.push(results.rows.item(i));
            }
            
            if (data.length > 0) {
             // setData(temp);
              resolve(data);
            } else {
              getApi();
            }
          },
          error => {
            reject(error);
          }
        );
      });
    });
};

//deletebatchs
export const deletebatch = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM batch_table ", (tx, results) => {
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.");
      } else {
      }
    });
  });
};

//create auditor ImageTable
// export const createImageTable = () => {
//   db.transaction(function (txn) {
//     txn.executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='image_table'",
//       [],
//       function (tx, res) {
//         if (res.rows.length == 0) {
//           txn.executeSql("DROP TABLE IF EXISTS question_table", []);
//           txn.executeSql(
//             "CREATE TABLE IF NOT EXISTS image_table(img_id INTEGER PRIMARY KEY AUTOINCREMENT,img_q_id VARCHAR(50),local_image_path,server_image_path, batch_id,upload_status,pos)",
//             []
//           );
//         }
//       }
//     );
//   });
// };

export const createImageTable = () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "CREATE TABLE IF NOT EXISTS image_table (" +
        "img_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "img_q_id VARCHAR(50), " +
        "local_image_path, " +
        "server_image_path, " +
        "batch_id, " +
        "upload_status, " +
        "pos" +
      ")",
      []
    );
  });
};

//insert image in image_table
export const insertImageTable = (
  img_q_id,
  local_image_path,
  server_image_path,
  batch_id,
  upload_status,
  pos
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO image_table(img_q_id, local_image_path, server_image_path, batch_id,upload_status,pos) VALUES (?,?,?,?,?,?)",
      [img_q_id, local_image_path, server_image_path, batch_id,upload_status,pos],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "batch_table database failed");
      }
    );
  });
};

// Define a function to fetch the data
export const fetchImageTableAllData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

// Define a function to fetch the data
export const fetchImageTableAllDataLength = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data.length);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};


// Define a function to fetch the data
export const getRecordsAllDataOnTbLenght = (batch_id, questionId) => {
  // console.log('batch_id:', batch_id);
  // console.log('questionId:', questionId);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ?',
        [batch_id, questionId],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          setDbtTotalLength(data.length)
          resolve(data.length);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

// Define a function to fetch the data
export const getRecordsDStatusWiseDataLength = (batch_id, questionId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ?',
        [batch_id, questionId],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data.length);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

// Define a function to fetch the data
export const getRecordsDStatusWiseDatafirst = (batch_id, questionId, upload_status) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ?',
        [batch_id, questionId, upload_status],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

 // Define a function to fetch the data
 export const getRecordsAllDataOnTb = (batch_id, questionId) => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ?',
        [batch_id, questionId],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data.length);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const  updateImageTable =  (server_image_path,upload_status, img_q_id, batch_id,img_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE image_table SET server_image_path=? ,upload_status=? where img_q_id=? and batch_id=? and img_id=?",
      [server_image_path,upload_status, img_q_id, batch_id,img_id],
      (tx, results) => {
       // console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
        } else {
        }
      }
    );
  });
};

export const getRecordsDStatusWiseData = (batch_id, questionId, upload_status, pos) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ? AND pos = ?',
        [batch_id, questionId, upload_status, pos],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

 // Define a function to fetch the pdf data
 export const getDataRecordsImgTPdf = (batch_id, questionId, upload_status, pos) => {  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE batch_id = ? AND img_q_id = ? AND upload_status = ? AND pos = ?',
        [batch_id, questionId, upload_status, pos],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

// Define a function to fetch the length
export const getRecordLength = (img_q_id, upload_status) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM image_table WHERE img_q_id = ? AND upload_status = ?',
        [img_q_id, upload_status],
        (tx, results) => {
          const len = results.rows.length;
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const updateQuestion_image = (
  server_image_path,
  img_q_id,
  batch_id,
  img_id
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE image_table SET server_image_path=? WHERE img_q_id=? AND batch_id=? AND img_id=?",
      [server_image_path, img_q_id, batch_id, img_id],
      (tx, results) => {
        //console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          // Alert.alert('Remarks Updated Successfully...')
        } else {
          // Alert.alert('Error');
        }
      }
    );
  });
};

//deletebatchs
export const deleteImagetable = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM image_table ", (tx, results) => {
      // console.log("Results", results.rowsAffected);
      if (results.rowsAffected > 0) {
        SimpleToast.show("Deleted data sucessfully.");
      } else {
      }
    });
  });
};

export const fetchImageTable = (setDataBatchDb) => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM batch_table", [], (tx, results) => {
      var temp = [];
      for (let i = 0; i < results.rows.length; ++i) {
        temp.push(results.rows.item(i));
      }
      setDataBatchDb(temp);
    });
  });
};

//create Assessment BatchTable
// export const createAssess_batchTable = () => {
//   db.transaction(function (txn) {
//     txn.executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='assess_batch_table'",
//       [],
//       function (tx, res) {
//         if (res.rows.length == 0) {
//           txn.executeSql("DROP TABLE IF EXISTS assess_batch_table", []);
//           txn.executeSql(
//             "CREATE TABLE IF NOT EXISTS assess_batch_table(ass_btchid INTEGER PRIMARY KEY AUTOINCREMENT, assessment_id,btch_id,batch_id VARCHAR(50),test_name,start_date,end_date, duration,batch_type,ass_batch_at_status,dm,candidateKyc)",
//             []
//           );
//         }
//       }
//     );
//   });
// };

export const createAssess_batchTable = () => {
  db.transaction(function (txn) {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS assess_batch_table (
        ass_btchid INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id,
        btch_id,
        batch_id VARCHAR(50),
        test_name,
        start_date,
        end_date,
        duration,
        batch_type,
        ass_batch_at_status,
        dm,
        candidateKyc
      )`,
      [],
      () => {
        console.log("assess_batch_table is ready.");
      },
      (error) => {
        console.error("Error creating assess_batch_table:", error);
      }
    );
  });
};



//insert items data to assessment batch table
export const insertAssbatchTable = (
  assessment_id,
  btch_id,
  batch_id,
  test_name,
  start_date,
  end_date,
  duration,
  batch_type,
  ass_batch_at_status,
  dm,
  candidateKyc
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO assess_batch_table(assessment_id,btch_id,batch_id, test_name, start_date, end_date,duration,batch_type,ass_batch_at_status,dm,candidateKyc) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        assessment_id,
        btch_id,
        batch_id,
        test_name,
        start_date,
        end_date,
        duration,
        batch_type,
        ass_batch_at_status,
        dm,
        candidateKyc
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "bassess_batch_table database failed");
      }
    );
  });
};

// create Assessor batch candidate list.
export const createAssess_batchCandidateList = () => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='assess_candindateList_table'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql(
            "DROP TABLE IF EXISTS assess_candindateList_table",
            []
          );
          txn.executeSql(
            "CREATE TABLE IF NOT EXISTS assess_candindateList_table(id INTEGER PRIMARY KEY AUTOINCREMENT,_id,batch_id VARCHAR(50),name,viva_count,demo_count, cand_id,parent_name,is_Demo, is_Viva,attendance,ojt_count,isOjt)",
            []
          );
        }
      }
    );
  });
};

//insert items data to assessment candidate List data table
export const insertAssesCandidateListTable = (
  _id,
  batch_id,
  name,
  viva_count,
  demo_count,
  cand_id,
  parent_name,
  is_Demo,
  is_Viva,
  attendance,
  ojt_count,
  isOjt,
) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO assess_candindateList_table(_id,batch_id,name,viva_count,demo_count, cand_id,parent_name,is_Demo,is_Viva,attendance,ojt_count,isOjt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        _id,
        batch_id,
        name,
        viva_count,
        demo_count,
        cand_id,
        parent_name,
        is_Demo,
        is_Viva,
        attendance,
        ojt_count,
        isOjt,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
        } else consoleLog("error", "assess_candindateList_table database failed");
      }
    );
  });
};

// ✅ Insert with Promise support
// export const insertAssesCandidateListTable = (
//   _id,
//   batch_id,
//   name,
//   viva_count,
//   demo_count,
//   cand_id,
//   parent_name,
//   is_Demo,
//   is_Viva,
//   attendance,
//   ojt_count,
//   isOjt,
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `INSERT INTO assess_candindateList_table (
//           _id, batch_id, name, viva_count, demo_count,
//           cand_id, parent_name, is_Demo, is_Viva,
//           attendance, ojt_count, isOjt
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           _id,
//           batch_id,
//           name,
//           viva_count,
//           demo_count,
//           cand_id,
//           parent_name,
//           is_Demo,
//           is_Viva,
//           attendance,
//           ojt_count,
//           isOjt,
//         ],
//         (tx, results) => {
//           if (results.rowsAffected > 0) {
//             resolve(true);
//           } else {
//             console.log("❌ Insert failed");
//             reject("Insert failed");
//           }
//         },
//         (tx, error) => {
//           console.error("❌ DB error:", error);
//           reject(error);
//           return true; // ✅ REQUIRED to catch error properly
//         }
//       );
//     });
//   });
// };

export const dropass_cd_table = () => {
  db.transaction(tx => {
    // Replace 'YourTableName' with the actual name of the table you want to drop
    tx.executeSql('DROP TABLE IF EXISTS assess_candindateList_table;', [], (_, result) => {
      //console.log('assess_candindateList_table Table dropped successfully');
    },
    (_, error) => {
      console.error('Error dropping table:', error);
    });
  });
};

//deletebatchs
export const deleteAssmtCandidateList = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM assess_candindateList_table", (tx, results) => {
      // console.log("Results", results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log("Deleted data sucessfully.")
      } else {
      }
    });
  });
};

//deletebatchs
export const deleteAssmtBatch = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM assess_batch_table ", (tx, results) => {
      // console.log("Results", results.rowsAffected);
      if (results.rowsAffected > 0) {
      } else {
      }
    });
  });
};

export const dropTable = () => {
  db.transaction(tx => {
    // Replace 'YourTableName' with the actual name of the table you want to drop
    tx.executeSql('DROP TABLE IF EXISTS assess_batch_table;', [], (_, result) => {
      console.log('assess_batch_table Table dropped successfully');
    },
    (_, error) => {
      console.error('Error dropping table:', error);
    });
  });
};

export const deleteDashBoardCount = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM table_dashboard_count ", (tx, results) => {
      // console.log("Results", results.rowsAffected);
      if (results.rowsAffected > 0) {
      } else {
      }
    });
  });
};
