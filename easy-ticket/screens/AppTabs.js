
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";
import HomeAluno from "./HomeAluno"; // Importar o HomeAluno refatorado

const Tab = createBottomTabNavigator();

export default function AppTabs({ route }) {
  const aluno = route?.params?.aluno; // O aluno virá via props do AuthContext ou params

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#007bff",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 100 },
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Principal") iconName = "home-outline";
        else if (route.name === "Intervalo") iconName = "time-outline";
        else if (route.name === "Ticket") iconName = "ticket-outline";
        else if (route.name === "UsarTicket") iconName = "checkmark-done-outline";
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    >
      <Tab.Screen name="Principal" component={HomeAluno} initialParams={{ aluno }} />
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={ReceberTicketScreen} initialParams={{ aluno }} />
      <Tab.Screen name="UsarTicket" component={UsarTicket} initialParams={{ aluno }} />
    </Tab.Navigator>
  );
}
