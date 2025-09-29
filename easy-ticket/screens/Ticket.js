import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ImageBackground } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTime } from "../TimeContext";

export default function ReceberTicketScreen({ route }) {
  const alunoParam = route?.params?.aluno;
  const [aluno, setAluno] = useState(alunoParam || null);

  const { intervaloAtivo, mensagem, turmaAtual, setTurmaAtual, loadingTurmas } = useTime();
  const [location, setLocation] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebidoHoje, setTicketRecebidoHoje] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [distanciaEscola, setDistanciaEscola] = useState(null);

  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200; // metros

  // Solicita permissão de localização
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      if (status !== "granted") setLocationError("Permissão negada. Ative a localização.");
    })();
  }, []);

  useEffect(() => {
  if (!aluno) {
    (async () => {
      const raw = await AsyncStorage.getItem("usuarioLogado");
      if (raw) {
        const alunoObj = JSON.parse(raw);
        setAluno(alunoObj);
        if (alunoObj?.turma && !turmaAtual) setTurmaAtual(alunoObj.turma);
      }
    })();
  } else {
    if (aluno?.turma && !turmaAtual) setTurmaAtual(aluno.turma);
  }
}, [aluno, turmaAtual]);

  // Obtem localização contínua
  useEffect(() => {
    if (locationPermission !== "granted") return;

    let subscriber;
    const startWatchingLocation = async () => {
      subscriber = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1, timeInterval: 5000 },
        (loc) => {
          setLocation(loc);
          if (loc?.coords) {
            const distancia = getDistance(
              { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
              ESCOLA_COORDS
            );
            setDistanciaEscola(distancia);
            setDentroEscola(distancia <= RAIO_ESCOLA);
            setLocationError("");
          } else {
            setLocationError("Não foi possível obter coordenadas.");
            setDentroEscola(false);
          }
        }
      );
    };
    startWatchingLocation();
    return () => subscriber?.remove();
  }, [locationPermission]);

  // Carrega status do ticket
  useEffect(() => {
    if (!aluno?.matricula || !turmaAtual || loadingTurmas) return;

    const carregarStatusTicket = async () => {
      try {
        const json = await AsyncStorage.getItem("tickets");
        const tickets = json ? JSON.parse(json) : {};
        const hoje = new Date().toISOString().split("T")[0];
        const key = String(aluno.matricula);
        const info = tickets[key];
        setTicketRecebidoHoje(!!(info && info.data === hoje && info.recebido));
      } catch (e) {
        console.log("Erro ao carregar status do ticket", e);
      }
    };
    carregarStatusTicket();
  }, [intervaloAtivo, turmaAtual, mensagem, aluno, loadingTurmas]);

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

      tickets[String(aluno.matricula)] = {
        recebido: true,
        data: hoje,
        usado: false,
        usuario: aluno.nome || "",
        matricula: aluno.matricula,
        turma: turmaAtual || null,
        confirmado: false,
      };

      await AsyncStorage.setItem("tickets", JSON.stringify(tickets));
      setTicketRecebidoHoje(true);
      Alert.alert("Sucesso", "Você recebeu seu ticket!");
    } catch (e) {
      console.log("Erro ao salvar ticket", e);
      Alert.alert("Erro", "Não foi possível salvar o ticket.");
    }
  };

  if (loadingTurmas) return <Text>Carregando turmas...</Text>;

  return (
    <ImageBackground
      source={require('../assets/fundo.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Receber Ticket</Text>
        {locationError && <Text style={styles.alert}>{locationError}</Text>}
        <Text style={{ fontSize: 12, color: 'gray' }}>
          {`intervaloAtivo=${intervaloAtivo}, turmaAtual=${turmaAtual}, mensagem=${mensagem}, ticketRecebidoHoje=${ticketRecebidoHoje}`}
        </Text>
        <Text style={{ color: "#2e2d2dff", marginBottom: 8 }}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, fontFamily: "Playfair Display" },
  alert: { marginTop: 10, fontSize: 16, color: "red", textAlign: "center", fontFamily: "Playfair Display" },
  sucesso: { fontSize: 18, fontWeight: "bold", color: "green", marginTop: 10, fontFamily: "Playfair Display" },
});
