import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StatusTicketsHoje() {
  const [alunos, setAlunos] = useState([]);
  const [statusTickets, setStatusTickets] = useState({});

  useEffect(() => {
    async function carregarDados() {
      // Carrega alunos
      const alunosRaw = await AsyncStorage.getItem("alunos");
      const listaAlunos = alunosRaw ? JSON.parse(alunosRaw) : [];
      setAlunos(listaAlunos);

      // Carrega status dos tickets
      const ticketsRaw = await AsyncStorage.getItem("tickets");
      const tickets = ticketsRaw ? JSON.parse(ticketsRaw) : {};
      const hoje = new Date().toISOString().split("T")[0];

      // Monta status por matrícula
      const status = {};
      listaAlunos.forEach(aluno => {
        const info = tickets[aluno.matricula];
        status[aluno.matricula] = info && info.data === hoje && info.recebido;
      });
      setStatusTickets(status);
    }
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status dos Tickets de Hoje</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.info}>
              {item.nome} - {item.matricula} - {item.turma}
            </Text>
            <Text style={[styles.status, statusTickets[item.matricula] ? styles.pego : styles.naoPego]}>
              {statusTickets[item.matricula] ? "Pegou hoje" : "Não pegou"}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum aluno cadastrado.</Text>}
      />
    </View>
  );
}

