import axios from "axios";
import * as types from "../../redux/type";
import AppSingleton from "../AppSingelton/AppSingelton";
import { isLoading } from "../../redux/Actions/BasicAction";

const appSingelton = AppSingleton.getInstance();

const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type !== types.API) return next(action);

  const { url, method, data, accessToken, onSuccess, onFailure, label } = action.payload;
  const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

  axios.defaults.headers.common["Content-Type"] = "application/json";

  if (appSingelton?.userToken) {
    axios.defaults.headers.common["x-access-token"] = appSingelton.userToken;
  }

  if (label) dispatch(isLoading(true));

  axios
    .request({
      url,
      method,
      [dataOrParams]: data,
    })
    .then((response) => {
      dispatch(isLoading(false));
      const successAction = onSuccess?.(response);
      if (successAction) dispatch(successAction);
    })
    .catch((error) => {
      dispatch(isLoading(false));
      const failureAction = onFailure?.(error);
      if (failureAction) dispatch(failureAction);
    });
};

export default apiMiddleware; // ✅ This line is CRITICAL