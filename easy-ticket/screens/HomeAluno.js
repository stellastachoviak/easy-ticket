import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import styles from '../styles/HomeAlunoStyles';
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E18B5D" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "Início",
        tabBarActiveTintColor: '#E18B5D',
        tabBarInactiveTintColor: '#B6B6A2',
        tabBarStyle: { backgroundColor: '#D8BBA5', height: 90, borderTopWidth: 0 },
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


