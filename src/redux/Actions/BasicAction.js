import * as types from "../type";

export const isLoading = (isAuth) => {
  return {
    type: types.IS_LOADING,
    payload: isAuth,
  };
};

export const saveSearchTextFavorite = (text) => {
  return {
    type: types.SEARCH_TEXT_FAVORITE,
    payload: text,
  };
};

export const setLatLong = (data) => {
  return {
    type: types.LAT_LONG,
    payload: data,
  };
};

export const saveBottomSearchText = (text) => {
  return {
    type: types.BOTTOM_SEARCH_TEXT,
    payload: text,
  };
};

export const getProfileDetaState = (profile) => {
  return {
    type: types.GET_PROFILE,
    payload: profile,
  };
};

export const getCandAttemted = (data) => {
  return {
    type: types.CAN_ATTEMPTED_DATA,
    payload: data,
  };
};
export const searchData = (data) => {
  return {
    type: types.SEARCH_DATA,
    payload: data,
  };
};
export const saveUser = (data) => {
  return {
    type: types.SAVE_USER,
    payload: data,
  };
};
export const setScreenDimension = (data) => {
  return {
    type: types.SCREEN_HIEGHT,
    payload: data,
  };
};

export const logoutUser = () => {
  return {
    type: "USER_LOGOUT",
  };
};

export const saveCallbackUpdate = (value) => {
  return {
    type: types.UPDATE_CALLBACK,
    payload: value,
  };
};
