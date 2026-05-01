import * as types from "../type";

const initialState = {
  isLoading: false,
  saveBottomSearchText: "",
  searchResult: [],
  getProfileData: {},
  latLong: {},
  candAttemted: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case types.CAN_ATTEMPTED_DATA:
      return {
        ...state,
        candAttemted: action.payload,
      };

    case types.LAT_LONG:
      return {
        ...state,
        latLong: action.payload,
      };

    case types.GET_PROFILE:
      return {
        ...state,
        getProfileData: action.payload,
      };
    default:
      return state;
  }
};
