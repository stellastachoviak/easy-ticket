import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTime } from "../TimeContext";

export default function ReceberTicketScreen({ route }) {
  const alunoParam = route?.params?.usuario;
  const [aluno, setAluno] = useState(alunoParam || null);

  const { intervaloAtivo, mensagem, turmaAtual, setTurmaAtual } = useTime();
  const [location, setLocation] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebidoHoje, setTicketRecebidoHoje] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [distanciaEscola, setDistanciaEscola] = useState(null);

  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200; // metros

  // Solicita permissão de localização ao abrir a tela
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);
        if (status !== "granted") {
          setLocationError("Permissão de localização negada. Ative a localização para receber o ticket.");
        } else {
          setLocationError("");
        }
        console.log("Permissão de localização:", status);
      } catch (e) {
        console.error("Erro ao solicitar permissão de localização:", e);
        setLocationError("Erro ao solicitar permissão de localização.");
      }
    })();
  }, []);

  // Carrega dados do aluno
  useEffect(() => {
    if (!aluno) {
      (async () => {
        try {
          const raw = await AsyncStorage.getItem("usuarioLogado");
          if (raw) {
            const alunoObj = JSON.parse(raw);
            setAluno(alunoObj);
            if (alunoObj?.turma) setTurmaAtual(alunoObj.turma);
          }
        } catch (e) {
          console.log("Erro ao ler usuarioLogado:", e);
        }
      })();
    } else {
      if (aluno?.turma) setTurmaAtual(aluno.turma);
    }
  }, [aluno]);

  // Obtem localização contínua usando watchPositionAsync
  useEffect(() => {
    let subscriber;

    const startWatchingLocation = async () => {
      if (locationPermission !== "granted") return;

      try {
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // atualiza a cada metro
            timeInterval: 5000,  // ou a cada 5s
          },
          (loc) => {
            setLocation(loc);

            if (loc?.coords?.latitude && loc?.coords?.longitude) {
              const distancia = getDistance(
                { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
                ESCOLA_COORDS
              );
              setDistanciaEscola(distancia);
              setDentroEscola(distancia <= RAIO_ESCOLA);
              setLocationError("");
              console.log(
                `Localização atual: (${loc.coords.latitude}, ${loc.coords.longitude}), Distância até escola: ${distancia}m`
              );
            } else {
              setLocationError("Não foi possível obter as coordenadas do dispositivo.");
              setDentroEscola(false);
              setDistanciaEscola(null);
              console.log("Coords inválidas em watchPositionAsync:", loc);
            }
          }
        );
      } catch (err) {
        setLocationError("Erro ao tentar obter localização: " + err.message);
        setDentroEscola(false);
        setDistanciaEscola(null);
        console.error("Erro watchPositionAsync:", err);
      }
    };

    startWatchingLocation();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, [locationPermission]);

  // Carrega status do ticket
  useEffect(() => {
    if (!aluno?.matricula) return;

    const carregarStatusTicket = async () => {
      try {
        const json = await AsyncStorage.getItem("tickets");
        const tickets = json ? JSON.parse(json) : {};
        const hoje = new Date().toISOString().split("T")[0];
        const key = String(aluno.matricula);
        const info = tickets[key];
        const recebeuHoje = !!(info && info.data === hoje && info.recebido);
        setTicketRecebidoHoje(recebeuHoje);
      } catch (e) {
        console.log("Erro ao carregar status do ticket", e);
      }
    };

    carregarStatusTicket();
  }, [intervaloAtivo, turmaAtual, mensagem, aluno]);

  const receberTicket = async () => {
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
      Alert.alert("Sucesso", "Você recebeu seu ticket!");
    } catch (e) {
      console.log("Erro ao salvar ticket", e);
      Alert.alert("Erro", "Não foi possível salvar o ticket.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receber Ticket</Text>
      {locationPermission !== "granted" && (
        <Text style={styles.alert}>{locationError || "Permissão de localização não concedida."}</Text>
      )}
      {locationError && locationPermission === "granted" && (
        <Text style={styles.alert}>{locationError}</Text>
      )}
      <Text style={{ fontSize: 12, color: 'gray' }}>
        {`intervaloAtivo=${intervaloAtivo ? 'true' : 'false'}, turmaAtual=${turmaAtual}, mensagem=${mensagem}, recebeuHoje=${ticketRecebidoHoje}`}
      </Text>
      <Text style={{ color: "#333", marginBottom: 8 }}>
        {distanciaEscola !== null
          ? `Distância até a escola: ${distanciaEscola} metros (raio permitido: ${RAIO_ESCOLA})`
          : "Distância até a escola: (localização não obtida)"}
      </Text>
      <Button
        title={ticketRecebidoHoje ? "Ticket já recebido" : "Receber Ticket"}
        onPress={receberTicket}
        disabled={!intervaloAtivo || !dentroEscola || ticketRecebidoHoje || locationPermission !== "granted"}
      />
      {!dentroEscola && locationPermission === "granted" && (
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
