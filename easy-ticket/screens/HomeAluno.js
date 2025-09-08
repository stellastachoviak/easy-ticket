import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TempoIntervalo from "./TempoIntervalo";
import ReceberTicketScreen from "./Ticket";
import { useTime } from '../TimeContext';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={ReceberTicketScreen} />
    </Tab.Navigator>
  );
}

export default function HomeAluno() {
  const { tempoRestante } = useTime();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Principal" component={Tabs} />
    </Drawer.Navigator>
  );
}
// Removendo possíveis duplicações de lógica de tempo