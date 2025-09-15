import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTime } from "../TimeContext";

export default function UsarTicket({ navigation }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [ticketUsado, setTicketUsado] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [ticketValido, setTicketValido] = useState(false);
  const [ticketAtual, setTicketAtual] = useState(null);

  const { turmaAtual } = useTime();

  useEffect(() => {
    async function carregarTicket() {
      try {
        const json = await AsyncStorage.getItem("tickets");
        const tickets = json ? JSON.parse(json) : {};
        const hoje = new Date().toISOString().split("T")[0];

        // Procura um ticket válido para hoje
        const ticketEncontrado = Object.values(tickets).find(
          (t) => t.recebido && !t.usado && t.data === hoje
        );

        if (ticketEncontrado) {
          setTicketValido(true);
          setTicketAtual(ticketEncontrado);
        } else {
          setTicketValido(false);
          setTicketAtual(null);
        }
      } catch (e) {
        console.log("Erro ao carregar tickets", e);
        setTicketValido(false);
      }
    }

    carregarTicket();
  }, []);

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
      const matricula = String(ticketAtual.matricula); // matrícula do ticket

      if (tickets[matricula]) {
        tickets[matricula].usado = true;
        await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
      }

      const log = {
        data: new Date().toISOString(),
        ticketId: matricula,
        turma: ticketAtual.turma || turmaAtual,
        usuario: ticketAtual.usuario,
        acao: "Ticket usado",
      };

      // Salva log local
      const logsRaw = await AsyncStorage.getItem("ticket_logs");
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      logs.push(log);
      await AsyncStorage.setItem("ticket_logs", JSON.stringify(logs));


      setTimeout(() => {
        navigation.goBack();
      }, 1500);
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

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
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
