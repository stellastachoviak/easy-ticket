import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import HomeAluno from "./HomeAluno";
import TempoIntervalo from "./TempoIntervalo";
import Ticket from "./Ticket"; // se você já tiver essa tela

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Principal") {
            iconName = "home-outline";
          } else if (route.name === "Intervalo") {
            iconName = "time-outline";
          } else if (route.name === "Ticket") {
            iconName = "ticket-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Principal" component={HomeAluno} />
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={Ticket} />
    </Tab.Navigator>
  );
}
