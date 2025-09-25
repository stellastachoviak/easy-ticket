import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";

import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";

const Tab = createBottomTabNavigator();

export default function HomeAluno({ route }) {
  const aluno = route.params.aluno; 

  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "Início",
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", height: 90 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Intervalo") iconName = "time-outline";
          else if (route.name === "Ticket") iconName = "ticket-outline";
          else if (route.name === "UsarTicket") iconName = "checkmark-done-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen
        name="Ticket"
        component={ReceberTicketScreen}
        initialParams={{ usuario: aluno }}
      />
      <Tab.Screen
        name="UsarTicket"
        component={UsarTicket}
        initialParams={{ usuario: aluno }}
      />
    </Tab.Navigator>
  );
}
