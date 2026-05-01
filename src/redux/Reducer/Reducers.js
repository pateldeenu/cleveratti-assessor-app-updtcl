import { UPLOAD_VIDEO_PROGRESS, UPLOAD_VIDEO_SUCCESS, UPLOAD_VIDEO_FAILURE } from '../../redux/Actions/AllContentAction';

const initialState = {
  progress: 0,
  success: null,
  error: null,
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_VIDEO_PROGRESS:
      return {
        ...state,
        progress: action.payload,
        success: null,
        error: null,
      };
    case UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        progress: 100,
        success: action.payload,
        error: null,
      };
    case UPLOAD_VIDEO_FAILURE:
      return {
        ...state,
        progress: 0,
        success: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default videoReducer;