import React, { useState } from "react";
import { View, Text, FlatList, Button, Alert, Pressable} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatusTicketsHojeStyles";
export default function StatusTicketsHoje() {
  const [alunos, setAlunos] = useState([]);
  const [tickets, setTickets] = useState({});

  const showLegend = () => {
    Alert.alert(
      "Legenda",
      "Cinza: não pegou ticket\nAzul: pegou\nVerde: pegou e usou"
    );
  };

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
      // Remove chave padronizada e antiga (retrocompatibilidade)
      await AsyncStorage.multiRemove(["tickets", "ticket_logs", "tickets_logs"]);
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
  <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <Pressable
      onPress={handleReset}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#5a3b28' : '#6F4E37',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 50,
          alignItems: 'center',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Text
        style={{
          color: '#F3E5AB',
          fontSize: 16,
          fontFamily: 'Roboto_700Bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Resetar Tickets e Logs
      </Text>
    </Pressable>

    <Pressable
      onPress={showLegend}
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: pressed ? '#ddd' : '#f5f5f5',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 2,
        },
      ]}
      accessibilityLabel="Ajuda sobre legendas"
    >
      <Text style={{ fontSize: 20, color: '#6F4E37', fontWeight: '700' }}>?</Text>
    </Pressable>
  </View>

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
