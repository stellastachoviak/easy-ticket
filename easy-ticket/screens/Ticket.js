import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTime } from "../TimeContext";

export default function ReceberTicketScreen({ route }) {
  const { aluno } = route.params; 
  const { intervaloAtivo, mensagem, turmaAtual } = useTime();
  const [location, setLocation] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebidoHoje, setTicketRecebidoHoje] = useState(false);

  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200;

  useEffect(() => {
    carregarStatusTicket();
    verificarLocalizacao();
    // LOGS PARA DIAGNÓSTICO
    console.log('intervaloAtivo:', intervaloAtivo);
    console.log('mensagem:', mensagem);
    console.log('turmaAtual:', turmaAtual);
    console.log('aluno:', aluno);
  }, [intervaloAtivo, turmaAtual, mensagem]);

  async function carregarStatusTicket() {
    try {
      const json = await AsyncStorage.getItem("tickets");
      const tickets = json ? JSON.parse(json) : {};
      const hoje = new Date().toISOString().split("T")[0];

      if (tickets[aluno.matricula]?.data === hoje && tickets[aluno.matricula]?.recebido) {
        setTicketRecebidoHoje(true);
      } else {
        setTicketRecebidoHoje(false);
      }
    } catch (e) {
      console.log("Erro ao carregar status do ticket", e);
    }
  }

  async function verificarLocalizacao() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erro", "Permissão de localização negada.");
      return;
    }

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(currentLocation);

      if (currentLocation?.coords) {
        const distancia = getDistance(
          { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
          { latitude: ESCOLA_COORDS.latitude, longitude: ESCOLA_COORDS.longitude }
        );
        setDentroEscola(distancia <= RAIO_ESCOLA);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível obter localização.");
    }
  }

async function receberTicket() {
  if (!intervaloAtivo || !dentroEscola) {
    Alert.alert("Atenção", "Você não pode reivindicar o ticket agora.");
    return;
  }

  if (ticketRecebidoHoje) {
    Alert.alert("Atenção", "Você já reivindicou seu ticket hoje!");
    return;
  }

  try {
    const json = await AsyncStorage.getItem("tickets");
    const tickets = json ? JSON.parse(json) : {};
    const hoje = new Date().toISOString().split("T")[0];
    const matriculaKey = String(aluno.matricula); 
    tickets[matriculaKey] = { recebido: true, data: hoje, usado: false };

    await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
    setTicketRecebidoHoje(true);
    Alert.alert("Sucesso", "Você recebeu seu ticket!");
  } catch (e) {
    console.log("Erro ao salvar ticket", e);
    Alert.alert("Erro", "Não foi possível salvar o ticket.");
  }
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receber Ticket</Text>
      <Text style={{fontSize:12, color:'gray'}}>
        {` intervaloAtivo=${intervaloAtivo ? 'true' : 'false'}, turmaAtual=${turmaAtual}, mensagem=${mensagem},usado=${ticketRecebidoHoje}`}
      </Text>
      <Button
        title={ticketRecebidoHoje ? "Ticket já recebido" : "Receber Ticket"}
        onPress={receberTicket}
        disabled={!intervaloAtivo || !dentroEscola || ticketRecebidoHoje}
      />

      {!dentroEscola && (
        <Text style={styles.alert}>
          {`Você precisa estar dentro de ${RAIO_ESCOLA} metros da escola para receber o ticket.`}
        </Text>
      )}

      {dentroEscola && !intervaloAtivo && (
        <Text style={styles.alert}>{mensagem || "O ticket ainda não está liberado."}</Text>
      )}

      {ticketRecebidoHoje && (
        <Text style={styles.sucesso}>Você já reivindicou seu ticket hoje.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  alert: { marginTop: 10, fontSize: 16, color: "red", textAlign: "center" },
  sucesso: { fontSize: 18, fontWeight: "bold", color: "green", marginTop: 10 },
});
