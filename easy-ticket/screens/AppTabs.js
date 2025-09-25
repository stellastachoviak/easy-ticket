import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext"; 
import { useTime } from "../TimeContext";

import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import UsarTicket from "./UsarTicket";
import HomeAluno from "./HomeAluno";

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
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]);
      }}
    >
      <Text style={{ color: "#007AFF", fontWeight: "bold" }}>Sair</Text>
    </TouchableOpacity>
  );
}

export default function AppTabs({ route }) {
  const { user } = useAuth();
  const aluno = route?.params?.aluno || user;
  const { setTurmaAtual } = useTime();

  React.useEffect(() => {
    if (aluno?.turma) {
      setTurmaAtual(aluno.turma);
    }
  }, [aluno?.turma, setTurmaAtual]);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerRight: () => <LogoutButton />,
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
