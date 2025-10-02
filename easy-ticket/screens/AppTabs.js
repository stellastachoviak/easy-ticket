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
      <Text style={{ color: "#F3E5AB", fontWeight: "bold" }}>Sair</Text>
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
      
      // 🔹 HEADER (barra superior)
      headerStyle: {
        backgroundColor: '#6F4E37', // marrom café
      },
      headerTintColor: '#fff', // textos brancos
      headerTitleStyle: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 20,
      },

      // 🔹 TAB BAR (barra inferior)
      tabBarStyle: {
        backgroundColor: '#F3E5AB', // bege claro
        borderTopWidth: 0,          // remove linha de cima
        elevation: 5,               // leve sombra
      },
      tabBarActiveTintColor: '#6F4E37', // ativo em marrom
      tabBarInactiveTintColor: '#333',  // inativo em cinza escuro
      tabBarLabelStyle: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 13,
      },

      // 🔹 ÍCONES
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
