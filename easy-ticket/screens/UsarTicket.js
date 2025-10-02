import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function UsarTicket() {
  const usuario = useSelector(s => s.auth.user);
  const [modalVisible, setModalVisible] = useState(true);
  const [ticketUsado, setTicketUsado] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [ticketValido, setTicketValido] = useState(false);
  const [ticketAtual, setTicketAtual] = useState(null);

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
    <ImageBackground
      source={require('../assets/ticket.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Somente o atendente pode receber o ticket.{"\n"}Clique no X para confirmar que está na presença do atendente.
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
            <Text style={{ fontSize: 16, marginVertical: 2 }}>Matrícula: {ticketAtual?.matricula}</Text>
            <Text style={{ fontSize: 16, marginVertical: 2 }}>Nome: {ticketAtual?.usuario}</Text>
            <Text style={{ fontSize: 16, marginVertical: 2 }}>
              Status: {ticketUsado || ticketAtual.usado ? "Usado" : ticketAtual.recebido ? "Válido" : "Inválido"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!ticketValido || ticketUsado) && { opacity: 0.5 }
          ]}
          onPress={handleUsarTicket}
          disabled={!ticketValido || ticketUsado}
        >
          <Text style={styles.primaryButtonText}>
            {ticketUsado ? "Ticket já usado" : "Usar Ticket"}
          </Text>
        </TouchableOpacity>

        {!ticketValido && !ticketUsado && (
          <Text style={{ color: "#ff1100ff", marginTop: 30, textAlign: "center" }}>
            Você não possui um ticket válido para usar.
          </Text>
        )}

        {feedback !== "" ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 2, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 40, marginBottom: 30 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E18B5D" },
  modalContent: { backgroundColor: "#ffffffff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  primaryButton: {
    backgroundColor: "#614326ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 140,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
