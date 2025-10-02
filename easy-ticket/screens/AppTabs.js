import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { setTurmaAtual } from "../redux/timeSlice";
import { useNavigation } from '@react-navigation/native';

import HomeAluno from "./HomeAluno";
import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";

const Tab = createBottomTabNavigator();

function LogoutButton() {
  const dispatch = useDispatch();
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
              await dispatch(logoutUser());
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
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user?.turma) dispatch(setTurmaAtual(user.turma));
  }, [user?.turma, dispatch]);

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
