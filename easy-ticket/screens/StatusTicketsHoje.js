import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
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

  const handleReset = async () => {
    try {
      await AsyncStorage.multiRemove(["tickets", "tickets_logs"]);
      setTickets({});
      Alert.alert("Sucesso", "Tickets e logs foram resetados.");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível resetar.");
    }
  };

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
    return <Ionicons name="ellipse" size={20} color="#B0B0B0" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status dos Tickets de Hoje</Text>
      <Button title="Resetar Tickets e Logs" onPress={handleReset} />
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
