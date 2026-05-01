// // initial state for login
// import * as types from "../type";
// const INITIAL_STATE = {
//   updateCallback: -1,
// };

// export default (state, action) => {
//   if (typeof state === "undefined") {
//     return INITIAL_STATE;
//   }
//   switch (action.type) {
//     case types.UPDATE_CALLBACK:
//       return {
//         ...state,
//         updateCallback: action.payload,
//       };
//     default:
//       return state;
//   }
// };

import * as types from "../type";

const INITIAL_STATE = {
  updateCallback: -1,
};

const callbackReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CALLBACK:
      return {
        ...state,
        updateCallback: action.payload,
      };
    default:
      return state;
  }
};

export default callbackReducer;