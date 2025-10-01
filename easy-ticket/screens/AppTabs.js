import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useAuth } from "../AuthContext";
import { useTime } from "../TimeContext";
import { useNavigation } from '@react-navigation/native';

import HomeAluno from "./HomeAluno";
import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";

const Tab = createBottomTabNavigator();

function LogoutButton() {
  const { logout } = useAuth();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => {
        Alert.alert("Deslogar", "Deseja realmente sair?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sim",
            onPress: async () => {
              await logout();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            },
          },
        ]);
      }}
    >
      <Text style={{ color: "#d19d61e3", fontWeight: "bold" }}>Sair</Text>
    </TouchableOpacity>
  );
}

export default function AppTabs() {
  const { user } = useAuth();
  const { setTurmaAtual } = useTime();

  React.useEffect(() => {
    if (user?.turma) setTurmaAtual(user.turma); // garante que a turma esteja sempre atualizada
  }, [user?.turma, setTurmaAtual]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => <LogoutButton />,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
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
      <Tab.Screen name="Principal" component={HomeAluno} />
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={ReceberTicketScreen} />
      <Tab.Screen name="UsarTicket" component={UsarTicket} />
    </Tab.Navigator>
  );
}
