import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, View } from "react-native";

import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";

const Tab = createBottomTabNavigator();

export default function HomeAluno({ navigation, route }) {
  // Pega o aluno que veio do login
  const aluno = route.params.aluno;

  // Supondo que o ticket do usuário esteja disponível aqui
  const ticket = route?.params?.ticket || { id: "123", usuario: "Aluno", usado: false };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitle: "Início",
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#fff", height: 60 },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Intervalo") iconName = "time-outline";
            else if (route.name === "Ticket") iconName = "ticket-outline";
            else if (route.name === "UsarTicket") iconName = "checkmark-done-outline";
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Intervalo" component={TempoIntervalo} />
        <Tab.Screen
          name="Ticket"
          component={ReceberTicketScreen}
          initialParams={{ aluno }}
        />
        <Tab.Screen
          name="UsarTicket"
          component={UsarTicket}
          initialParams={{ ticket }}
        />
      </Tab.Navigator>
    </View>
  );
}
