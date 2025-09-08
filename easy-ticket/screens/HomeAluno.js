import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";

const Tab = createBottomTabNavigator();

export default function HomeAluno() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "Início",
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Intervalo") {
            iconName = "time-outline";
          } else if (route.name === "Ticket") {
            iconName = "ticket-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={ReceberTicketScreen} />
    </Tab.Navigator>
  );
}
