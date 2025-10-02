import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoricoTickets() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function carregarLogs() {
      // Prioriza chave correta; tenta chave antiga para compatibilidade
      const primary = await AsyncStorage.getItem("ticket_logs");
      const legacy = !primary ? await AsyncStorage.getItem("tickets_logs") : null;
      const raw = primary || legacy;
      setLogs(raw ? JSON.parse(raw).reverse() : []);
    }
    carregarLogs();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/ticket-triste.png")} // coloque a imagem dentro da pasta assets
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FlatList
          data={logs}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{item.usuario}</Text> ({item.turma || "—"}) usou o ticket em{" "}
                {new Date(item.data).toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum ticket usado ainda.
            </Text>
          }
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(240,255,255,0.85)", // camada translúcida pra não atrapalhar a leitura
    padding: 16,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: "#333",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#7A8C8C",
  },
});
