import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
// import HomeAluno from "./screens/HomeAluno";
// import TelaAdm from "./screens/TelaAdm";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="HomeAluno" component={HomeAluno} /> */}
        {/* <Stack.Screen name="TelaAdm" component={TelaAdm} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
