import React, { useState, useEffect,useCallback } from "react";
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../AuthContext"; // Importa AuthContext

export default function UsarTicket() {
  const { user: usuario } = useAuth(); // Pega o aluno logado
  const [modalVisible, setModalVisible] = useState(true);
  const [ticketUsado, setTicketUsado] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [ticketValido, setTicketValido] = useState(false);
  const [ticketAtual, setTicketAtual] = useState(null);

  const isFocused = useIsFocused();

  useFocusEffect(
  useCallback(() => {
    async function carregarTicket() {
      if (!usuario?.matricula) {
        setTicketValido(false);
        setTicketAtual(null);
        setTicketUsado(false);
        setModalVisible(false);
        return;
      }

      try {
        const json = await AsyncStorage.getItem("tickets");
        const tickets = json ? JSON.parse(json) : {};
        const hoje = new Date().toISOString().split("T")[0];
        const matricula = String(usuario.matricula);
        const ticket = tickets[matricula];

        if (ticket && ticket.data === hoje) {
          const valido = ticket.recebido && !ticket.usado;
          setTicketValido(valido);
          setTicketAtual(ticket);
          setTicketUsado(!!ticket.usado);
          setModalVisible(valido); 
        } else {
          setTicketValido(false);
          setTicketAtual(null);
          setTicketUsado(false);
          setModalVisible(false);
        }
      } catch (e) {
        console.log("Erro ao carregar tickets:", e);
        setTicketValido(false);
        setTicketAtual(null);
        setTicketUsado(false);
        setModalVisible(false);
      }
    }

    carregarTicket();
  }, [usuario])
);


  const handleConfirmarPresenca = () => {
    setModalVisible(false);
  };

  const handleUsarTicket = async () => {
    if (modalVisible) {
      Alert.alert("Confirme a presença do atendente antes de usar o ticket.");
      return;
    }
    if (!ticketValido || ticketUsado) {
      Alert.alert("Ticket já foi usado ou não encontrado.");
      return;
    }

    setTicketUsado(true);
    setFeedback("Ticket usado com sucesso!");

    try {
      const json = await AsyncStorage.getItem("tickets");
      const tickets = json ? JSON.parse(json) : {};
      const matricula = String(ticketAtual.matricula);

      if (tickets[matricula]) {
        tickets[matricula].usado = true;
        await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
      }

      const log = {
        data: new Date().toISOString(),
        ticketId: matricula,
        usuario: ticketAtual.usuario,
        acao: "Ticket usado",
      };

      const logsRaw = await AsyncStorage.getItem("ticket_logs");
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      logs.push(log);
      await AsyncStorage.setItem("ticket_logs", JSON.stringify(logs));

    } catch (e) {
      console.log("Erro ao usar ticket", e);
      setFeedback("Erro ao registrar o uso do ticket.");
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {"Somente o atendente pode receber o ticket.\nClique no X para confirmar que está na presença do atendente."}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleConfirmarPresenca}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Usar Ticket</Text>

      {ticketAtual && (
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginVertical: 2 }}>Matrícula: {ticketAtual.matricula}</Text>
          <Text style={{ fontSize: 16, marginVertical: 2 }}>Nome: {ticketAtual.usuario}</Text>
          <Text style={{ fontSize: 16, marginVertical: 2 }}>
            Status: {ticketUsado || ticketAtual.usado ? "Usado" : ticketAtual.recebido ? "Válido" : "Inválido"}
          </Text>
        </View>
      )}

      <Button
        title={ticketUsado ? "Ticket já usado" : "Usar Ticket"}
        onPress={handleUsarTicket}
        disabled={!ticketValido || ticketUsado}
      />

      {!ticketValido && !ticketUsado && (
        <Text style={{ color: "red", marginTop: 20 }}>
          Você não possui um ticket válido para usar.
        </Text>
      )}

      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  closeButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  feedback: { color: "green", marginTop: 20, fontSize: 16 },
});
