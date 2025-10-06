import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoricoTickets() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function carregarLogs() {
      const primary = await AsyncStorage.getItem("ticket_logs");
      const legacy = !primary ? await AsyncStorage.getItem("tickets_logs") : null;
      const raw = primary || legacy;
      const logsArr = raw ? JSON.parse(raw) : [];
      // tentar enriquecer cada log com a turma e matrícula, buscando em "tickets" quando possível
      try {
        const ticketsJson = await AsyncStorage.getItem("tickets");
        const tickets = ticketsJson ? JSON.parse(ticketsJson) : {};
        const enriched = logsArr.map(l => {
          const id = String(l.ticketId ?? l.matricula ?? "");
          const ticketFromStore = id && tickets[id] ? tickets[id] : null;
          const matriculaField = l.matricula ?? l.ticketId ?? (ticketFromStore ? String(ticketFromStore.matricula ?? "") : "");
          const turmaFromTickets = ticketFromStore ? ticketFromStore.turma : null;
          return {
            ...l,
            turma: l.turma ?? turmaFromTickets ?? null,
            matricula: matriculaField || null
          };
        });
        setLogs(enriched.reverse());
      } catch (e) {
        // fallback simples se algo falhar
        // garantir que cada log tenha alguma matrícula para exibição
        const fallback = logsArr.map(l => ({
          ...l,
          matricula: String(l.matricula ?? l.ticketId ?? "")
        }));
        setLogs(fallback.reverse());
      }
    }
    carregarLogs();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/ticket-triste.png")}
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
                <Text style={{ fontWeight: "bold" }}>matricula: {item.matricula || item.usuario || "—"}</Text> turma: {item.turma || "—"}, usou o ticket em{" "}
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
    backgroundColor: "rgba(240,255,255,0.85)",
    padding: 16,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: "#000000ff",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#7A8C8C",
  },
});
