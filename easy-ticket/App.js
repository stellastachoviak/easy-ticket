import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import HomeAluno from "./screens/HomeAluno";
import TelaAdm from "./screens/TelaAdm";
import { TimeProvider } from "./TimeContext";
import HistoricoTickets from "./screens/HistoricoTickets";
import StatusTicketsHoje from "./screens/StatusTicketsHoje";
import UsarTicket from "./screens/UsarTicket";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TimeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} 
          />
          {/* Aqui o HomeAluno já vira só Tab, sem outro Stack dentro */}
          <Stack.Screen 
            name="HomeAluno" 
            component={HomeAluno} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="TelaAdm" 
            component={TelaAdm} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="UsarTicket" 
            component={UsarTicket} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="HistoricoTickets" 
            component={HistoricoTickets} 
          />
          <Stack.Screen 
            name="StatusTicketsHoje" 
            component={StatusTicketsHoje} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TimeProvider>
  );
}
