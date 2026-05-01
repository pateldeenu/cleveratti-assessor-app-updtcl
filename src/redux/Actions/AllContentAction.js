import AppSingleton from "../../utils/AppSingelton/AppSingelton";
import { consoleLog, getData } from "../../utils/Utills";
import ApiUrl from "../../utils/UrlConfig";
export const UPLOAD_VIDEO_PROGRESS = 'UPLOAD_VIDEO_PROGRESS';
export const UPLOAD_VIDEO_SUCCESS = 'UPLOAD_VIDEO_SUCCESS';
export const UPLOAD_VIDEO_FAILURE = 'UPLOAD_VIDEO_FAILURE';
// actions.js
// import { UPLOAD_VIDEO_PROGRESS, UPLOAD_VIDEO_SUCCESS, UPLOAD_VIDEO_FAILURE } from '../../redux/Reducer/Reducers';
import axios from 'axios';

export const userLoginApiHit = (userName, password, token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.userLogin}`;
    //console.log("LOgin Url:--", finalUrl);
    let body = {
      username: userName,
      password: password,
      fcm_token: token
    };
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          //console.log("LOgin error:--", error);
          reject(error);
        },
      })
    );
  });
};

export const postSubmitQuestinApi =
  (examType, assessId, candidateId, dataJson) => (dispatch) => {
    return new Promise((resolve, reject) => {
      let finalUrl = `${ApiUrl.baseUrl}${examType == "viva"
          ? ApiUrl.vivaAnswer + assessId + "/" + candidateId
          : (examType == "demo" ? ApiUrl.demoAnswer + assessId + "/" + candidateId
            : ApiUrl.ojtAnswer + assessId + "/" + candidateId)
        }`;
      let body = dataJson;
      console.log("postSubmitQuestinApi Url:--", finalUrl);
      //consoleLog("body", body);
      dispatch(
        AppSingleton.getInstance().apiAction({
          url: finalUrl,
          method: "POST",
          data: body,
          onSuccess: (response) => {
            // console.log("final submit success response:--", response);
            resolve(response);
          },
          onFailure: (error) => {
            console.log("final submit error", error);
            reject(error);
          },
        })
      );
    });
  };

export const postauditAnswerApi = (dataJson) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.audiQues}`;
    let body = dataJson;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          //console.log("response:--", response);
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const candidateAnswerApi = (dataJson, assessmentId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.candidateAnswer + assessmentId}`;
    let body = dataJson;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const postAttendanceSubmitApi = (dataJson) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.assessor_attendance}`;
    let body = dataJson;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error:---dd", error);
          reject(error);
        },
      })
    );
  });
};

export const uploadInstructionImage = (dataJson) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.candidiateProfileUpdate}`;
    let body = dataJson;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const uploadVideoTagApi = async (text, type, batchid, candidateid, questionId, VideoFile, token,) => {
  let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.addTagVideo}`;
  let respo = await apiPostWithTokenAndImage(text, type, batchid, candidateid, questionId, VideoFile, finalUrl, token);
  return respo;
};

const apiPostWithTokenAndImage = async (text, type, batchid, candidateid, questionId, videoFile, finalUrl, token) => {
  let formData = new FormData();
  formData.append("video", {
    name: "13nsame.mp4",
    uri: videoFile,
    type: "video/mp4",
  });
  formData.append("text", text);
  formData.append("type", type);
  formData.append("batchId", batchid);
  formData.append("candidateId", candidateid);
  formData.append("questionId", questionId);
  //console.log("body :-- " ,formData);
  try {
    let response = await fetch(finalUrl, {
      method: "post",
      headers: {
        accept: "application/json",
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
    );
    return await response.json();
  } catch (error) {
    //console.log("error : " + error);
    return error;
  }
};
//demogroupwise
export const uploadVideoTagDemoGroupApi = async (text, type, batchid, groupId, videoNo, VideoFile, token,) => {
  let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.addTagVideo}`;
  // console.log("--:final url--",finalUrl);
  let respo = await apiPostWithDemoGroupTokenAndImage(text, type, batchid, groupId, videoNo, VideoFile, finalUrl, token);
  return respo;
};

const apiPostWithDemoGroupTokenAndImage = async (text, type, batchid, groupId, videoNo, videoFile, finalUrl, token) => {
  // Ensure local Android file paths have the file:// scheme
  const uri = videoFile?.startsWith("file://") ? videoFile : `file://${videoFile}`;

  let formData = new FormData();
  formData.append("video", {
    name: "video.mp4",
    uri: uri,
    type: "video/mp4",
  });
  formData.append("text", text);
  formData.append("type", type);
  formData.append("batchId", batchid);
  formData.append("groupId", groupId);
  formData.append("videoNo", videoNo);
  
  try {
    let response = await fetch(finalUrl, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type manually — fetch must auto-set it with the
        // multipart boundary, otherwise the server cannot parse the body.
        "Accept": "application/json",
        "x-access-token": token,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.log("error : " + error);
    return error;
  }
};


export const getCandidateExamQuestion = (assessId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.getQuestion + assessId}`;
    //consoleLog('upload image url',finalUrl )
    consoleLog('quest url', finalUrl)
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          //console.log("Error quest url:--", error);
          reject(error);
        },
      })
    );
  });
};
export const getCandidateVivaPracticlQuestion = (assessId) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.candVivaQues + assessId}`;
    //consoleLog('urll viva', finalUrl )
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getCheckStatusApi = (assessment_id, question_id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.checkStatusApi + assessment_id + "/" + question_id
      }`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};


export const getCandFeedBackQuestList = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.feedback}${id}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const postCandidateFeedbackApi = (id, dataJson) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.feedbackAnswer}${id}`;
    let body = dataJson;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          // console.log("response:--", response);
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getCandidateExamList = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.examList + ""}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getCandidateInstruction = (assessment_id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.examInstruction + assessment_id}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getAuditQuestion = (_id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.audiQues}/${_id}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getLiveStreamingPositionApi = (user, lat, long) => (dispatch) => {
  return new Promise((resolve, reject) => {
    //let finalUrl = `${ApiUrl.baseUrl}${`agora/rtc/${candId}/publisher/uid/0`}`;
    let finalUrl = `${ApiUrl.baseUrl}${`position`}`;
    console.log('final url live api ---', finalUrl)
    let body = {
      username: user,
      latitude: lat,
      longitude: long
    };
    // console.log("--Api body --", body)
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "PUT",
        data: body,
        onSuccess: (response) => {
          resolve(response);
          //console.log("success:-- ", response);
        },
        onFailure: (error) => {
          console.log("error ", error);
          reject(error);
        },
      })
    );
  });
};

// export const getLiveStreamingApi = (candId, type) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     // let finalUrl = `${ApiUrl.baseUrl}${`agora/rtc/${candId}/publisher/uid/0`}`;
//     let finalUrl = `${ApiUrl.baseUrl}${`agora/rtc/${candId}/${type}/uid/0`}`;
//      console.log('final url live api ---', finalUrl)
//     dispatch(
//       AppSingleton.getInstance().apiAction({
//         url: finalUrl,
//         method: "POST",
//         onSuccess: (response) => {
//           resolve(response);
//         },
//         onFailure: (error) => {
//           console.log("error agora", error);
//           reject(error);
//         },
//       })
//     );
//   });
// };

export const getLiveStreamingApi = (candId, type) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}agora/rtc/${candId}/${type}/uid/0`;
    console.log("final url live api ---", finalUrl);
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: {
          channel: candId,   // 👈 check if backend requires channel
          role: type,        // 👈 optional, if backend requires role
        },
        onSuccess: (response) => {
          console.log("Agora token response:", response);
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error agora", error);
          reject(error);
        },
      })
    );
  });
};

export const getAssessorAssList = (api) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.assessorAssessmentList + api}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
          // console.log("call:--");
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getAttendanceApi =
  (batchId, startDate, endDate, status) => (dispatch) => {
    return new Promise((resolve, reject) => {
      let finalUrl = `${ApiUrl.baseUrl}${status !== "track"
          ? ApiUrl.assessor_attendance + "/" + batchId
          : ApiUrl.assessor_attendance +
          "?start_date=" +
          startDate +
          "&end_date=" +
          endDate
        }`;
      // consoleLog("url", finalUrl);
      dispatch(
        AppSingleton.getInstance().apiAction({
          url: finalUrl,
          method: "GET",
          onSuccess: (response) => {
            resolve(response);
          },
          onFailure: (error) => {
            console.log("error", error);
            reject(error);
          },
        })
      );
    });
  };

export const getAssessorBatchCandidateList = (api) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.assessorBatchCandidateList + api
      }`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

//demo groupby videos status
export const getdemoGroupVideosStatus = (batch_id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.getAssessorDemogroupSt + batch_id}`;
    console.log("--finalUrl getdemoGroupVideosStatus:--", finalUrl)
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const getAssessorVivaList =
  (examType, assessId, candidateId) => (dispatch) => {
    return new Promise((resolve, reject) => {
      let finalUrl = `${ApiUrl.baseUrl}${examType == "viva" ? ApiUrl.getAssViva + assessId + "/" + candidateId : (examType == "demo" ? ApiUrl.getAssDemo + assessId + "/" + candidateId : ApiUrl.getAssOjt + assessId + "/" + candidateId)
        }`;
      //  consoleLog("finalUrl", finalUrl);
      dispatch(
        AppSingleton.getInstance().apiAction({
          url: finalUrl,
          method: "GET",
          onSuccess: (response) => {
            resolve(response);
          },
          onFailure: (error) => {
            // console.log("Api error", error);
            reject(error);
          },
        })
      );

    });
  };

export const getAssessorTotalCountt = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.assessorTotalCountList}`;
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "GET",
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};

export const postAttendaceApi = (candidate, attendance) => (dispatch) => {
  return new Promise((resolve, reject) => {
    let finalUrl = `${ApiUrl.baseUrl}${ApiUrl.postAttendace}`;

    let body = {
      candidate: candidate,
      attendance: attendance,
    };
    dispatch(
      AppSingleton.getInstance().apiAction({
        url: finalUrl,
        method: "POST",
        data: body,
        onSuccess: (response) => {
          resolve(response);
        },
        onFailure: (error) => {
          console.log("error", error);
          reject(error);
        },
      })
    );
  });
};
