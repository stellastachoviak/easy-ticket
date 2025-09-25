import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      <FlatList
        data={logs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>{item.usuario}</Text> ({item.turma}) usou o ticket em{" "}
              {new Date(item.data).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum ticket usado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  text: { fontSize: 15 },
});