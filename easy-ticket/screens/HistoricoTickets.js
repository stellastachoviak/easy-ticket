import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles/HistoricoTicketsStyles';

export default function HistoricoTickets() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function carregarLogs() {
      const logsRaw = await AsyncStorage.getItem("ticket_logs");
      setLogs(logsRaw ? JSON.parse(logsRaw).reverse() : []);
    }
    carregarLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Tickets Usados</Text>
      <FlatList
        data={logs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <Text style={styles.ticketText}>
              <Text style={{ fontWeight: "bold" }}>{item.usuario}</Text> ({item.turma}) usou o ticket em {new Date(item.data).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum ticket usado ainda.</Text>}
      />
    </View>
  );
}
