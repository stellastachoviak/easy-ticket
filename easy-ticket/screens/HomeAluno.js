import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TempoIntervalo from "./TempoIntervalo";
import Ticket from "./Ticket";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Intervalo" component={TempoIntervalo} />
      <Tab.Screen name="Ticket" component={Ticket} />
    </Tab.Navigator>
  );
}

export default function HomeAluno() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Principal" component={Tabs} />
    </Drawer.Navigator>
  );
}