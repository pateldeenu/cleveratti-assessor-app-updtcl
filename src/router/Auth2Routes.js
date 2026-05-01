import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MainLoginScreen from "../screen/CredentialsAuth/MainLoginScreen";
const Stack = createStackNavigator();

const Auth2Routes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainLoginScreen" component={MainLoginScreen} />
    </Stack.Navigator>
  );
};
export default Auth2Routes;
