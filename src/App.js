import React, { useEffect, useState } from "react";
import SplashScreen from "./screen/SplashScreen/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppStack from "./router/AppRoutes";
import AuthStack from "./router/AuthRoutes";
import CandidateAppRoutes from "./router/CandiadateNavigtionRoute";
import Auth2Routes from "./router/Auth2Routes";
import FlashMessage from "react-native-flash-message";
import NotificationComponent from "./components/Componentes/NotificationComponent";
import { navigationRef } from "./router/Rootnavigation";
import NetInfo from "@react-native-community/netinfo";
import { LogBox } from "react-native";
import { AppConfig } from "./screen/AssessmentDetails/Utils";
import { setData } from "./utils/Utills";
import { Provider } from 'react-redux';
import store from './redux/store'; // ✅ relative to App.js
const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    NetInfo.fetch().then(() => setLoading(false));
    setData(AppConfig.OnOffMode, JSON.stringify(true));
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="splashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splashScreen" component={SplashScreen} />
          <Stack.Screen name="appStack" component={AppStack} />
          <Stack.Screen name="authStack" component={AuthStack} />
          <Stack.Screen name="auth2Stack" component={Auth2Routes} />
          <Stack.Screen name="CandidateAppRoutes" component={CandidateAppRoutes} />
        </Stack.Navigator>
      </NavigationContainer>
      
      <FlashMessage
        position="top"
        MessageComponent={NotificationComponent}
        duration={5000}
      />
    </Provider>
  );
};

export default App;