import * as types from "../../redux/type";
/**
 * this class is used to set the app singleton class
 */

class AppSingleton {
  static appInstance = null;
  userToken = "";
  userId = "";
  fcmToken = "";
  /**
   * @returns {AppSingleton}
   */

  static getInstance() {
    if (AppSingleton.appInstance == null) {
      AppSingleton.appInstance = new AppSingleton();
    }

    return AppSingleton.appInstance;
  }

  setUserToken(token) {
    this.userToken = token;
  }

  apiAction = ({
    url = "",
    method = "GET",
    data = null,
    accessToken = null,
    onSuccess = () => {},
    onFailure = () => {},
  }) => {
    return {
      type: types.API,
      payload: {
        url,
        method,
        data,
        accessToken,
        onSuccess,
        onFailure,
      },
    };
  };
}

export default AppSingleton;
