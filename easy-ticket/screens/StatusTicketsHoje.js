import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatusTicketsHojeStyles";
export default function StatusTicketsHoje() {
  const [alunos, setAlunos] = useState([]);
  const [tickets, setTickets] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const carregarDados = async () => {
        try {
          const alunosJson = await AsyncStorage.getItem("alunos");
          setAlunos(alunosJson ? JSON.parse(alunosJson) : []);
          const ticketsJson = await AsyncStorage.getItem("tickets");
          setTickets(ticketsJson ? JSON.parse(ticketsJson) : {});
        } catch (e) {
          setAlunos([]);
          setTickets({});
        }
      };
      carregarDados();
    }, [])
  );
  const getStatusIcon = (aluno) => {
    const hoje = new Date().toISOString().split("T")[0];
    const ticket = tickets[String(aluno.matricula)];

    if (!ticket || ticket.data !== hoje) {
      return <Ionicons name="ellipse" size={20} color="gray" />;
    }
    if (ticket.usado) {
      return <Ionicons name="ellipse" size={20} color="green" />;
    }
    if (ticket.recebido) {
      return <Ionicons name="ellipse" size={20} color="blue" />;
    }
    return <Ionicons name="ellipse" size={20} color="gray" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status dos Tickets de Hoje</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} - {item.matricula} - {item.turma}
            </Text>
            {getStatusIcon(item)}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum aluno cadastrado.</Text>
        }
      />
    </View>
  );
}
