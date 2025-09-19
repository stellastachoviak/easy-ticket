import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import TelaAdm from "./screens/TelaAdm";
import { TimeProvider } from "./TimeContext";
import HistoricoTickets from "./screens/HistoricoTickets";
import StatusTicketsHoje from "./screens/StatusTicketsHoje";
import AppTabs from "./screens/AppTabs"
import { AuthProvider, useAuth } from "./AuthContext"

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  return (
        <Stack.Navigator initialRouteName=
        {user ? 
        (user.type === 'admin' ? 'TelaAdm' : 'AppTabs') : 'Login'}>          
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AppTabs" 
            component={AppTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="TelaAdm" 
            component={TelaAdm} 
            options={{ headerShown: false }} 
          />
          {/* <Stack.Screen 
            name="UsarTicket" 
            component={UsarTicket} 
            options={{ headerShown: false }} 
          /> */}
          <Stack.Screen 
            name="HistoricoTickets" 
            component={HistoricoTickets} 
          />
          <Stack.Screen 
            name="StatusTicketsHoje" 
            component={StatusTicketsHoje} 
          />
        </Stack.Navigator>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <TimeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TimeProvider>
    </AuthProvider>
   );
 }
