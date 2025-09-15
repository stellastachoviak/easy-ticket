import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTime } from "../TimeContext";

export default function ReceberTicketScreen({ route }) {
  const alunoParam = route?.params?.aluno;
  const [aluno, setAluno] = useState(alunoParam || null);

  const { intervaloAtivo, mensagem, turmaAtual } = useTime();
  const [location, setLocation] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebidoHoje, setTicketRecebidoHoje] = useState(false);

  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200;

  useEffect(() => {
    (async () => {
      if (!alunoParam) {
        try {
          const raw = await AsyncStorage.getItem("usuarioLogado");
          if (raw) setAluno(JSON.parse(raw));
        } catch (e) {
          console.log("Erro ao ler usuarioLogado:", e);
        }
      }
    })();
  }, []);

  useEffect(() => {
    // recarrega status (e funciona quando aluno muda)
    carregarStatusTicket();
    verificarLocalizacao();
    console.log('intervaloAtivo:', intervaloAtivo);
    console.log('mensagem:', mensagem);
    console.log('turmaAtual:', turmaAtual);
    console.log('aluno:', aluno);
  }, [intervaloAtivo, turmaAtual, mensagem, aluno]);

  async function carregarStatusTicket() {
    if (!aluno?.matricula) {
      setTicketRecebidoHoje(false);
      return;
    }
    try {
      const json = await AsyncStorage.getItem("tickets");
      const tickets = json ? JSON.parse(json) : {};
      const hoje = new Date().toISOString().split("T")[0];
      const key = String(aluno.matricula);
      const info = tickets[key];
      const recebeuHoje = !!(info && info.data === hoje && info.recebido);
      setTicketRecebidoHoje(recebeuHoje);
      console.log("carregarStatusTicket -> tickets:", tickets);
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
      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
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
    if (!aluno?.matricula) {
      Alert.alert("Erro", "Aluno não identificado.");
      return;
    }

    try {
      const json = await AsyncStorage.getItem("tickets");
      const tickets = json ? JSON.parse(json) : {};
      const hoje = new Date().toISOString().split("T")[0];
      const matriculaKey = String(aluno.matricula);

      // gravar ticket padronizado
      tickets[matriculaKey] = {
        recebido: true,
        data: hoje,
        usado: false,
        usuario: aluno.nome || "",
        matricula: aluno.matricula,
        turma: turmaAtual || null,
        confirmado: false
      };

      await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
      setTicketRecebidoHoje(true);
      console.log("receberTicket -> tickets after write:", tickets);
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
        {`intervaloAtivo=${intervaloAtivo ? 'true' : 'false'}, turmaAtual=${turmaAtual}, mensagem=${mensagem}, recebeuHoje=${ticketRecebidoHoje}`}
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
