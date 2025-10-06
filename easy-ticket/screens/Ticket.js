import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,  
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { setTurmaAtual } from "../redux/timeSlice";
import styles from "../styles/Ticket";


export default function ReceberTicketScreen({ route }) {
  const alunoParam = route?.params?.aluno;
  const [aluno, setAluno] = useState(alunoParam || null);

  const dispatch = useDispatch();
  const {
    intervaloAtivo,
    mensagem,
    turmaAtual,
    loadingTurmas,
    ticketLiberado,
    tempoRestante,
  } = useSelector((s) => s.time);

  const [location, setLocation] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebidoHoje, setTicketRecebidoHoje] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [distanciaEscola, setDistanciaEscola] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);


  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200; // metros


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      if (status !== "granted")
        setLocationError("Permissão negada. Ative a localização.");
    })();
  }, []);


  useEffect(() => {
    if (!aluno) {
      (async () => {
        const raw = await AsyncStorage.getItem("usuarioLogado");
        if (raw) {
          const alunoObj = JSON.parse(raw);
          setAluno(alunoObj);
          if (alunoObj?.turma && !turmaAtual)
            dispatch(setTurmaAtual(alunoObj.turma));
        }
      })();
    } else {
      if (aluno?.turma && !turmaAtual) dispatch(setTurmaAtual(aluno.turma));
    }
  }, [aluno, turmaAtual, dispatch]);


  useEffect(() => {
    if (locationPermission !== "granted") return;

    let subscriber;
    let initialFix = false;

    const startWatchingLocation = async () => {
      try {
        setLoadingLocation(true);
        console.log("📡 Iniciando monitoramento de localização...");


        const firstLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (firstLoc?.coords) {
          const distancia = getDistance(
            {
              latitude: firstLoc.coords.latitude,
              longitude: firstLoc.coords.longitude,
            },
            ESCOLA_COORDS
          );
          console.log(
            "📍 Local inicial:",
            firstLoc.coords.latitude,
            firstLoc.coords.longitude,
            "| Escola:",
            ESCOLA_COORDS.latitude,
            ESCOLA_COORDS.longitude,
            "| Distância inicial:",
            distancia,
            "m"
          );

          setDistanciaEscola(distancia);
          setDentroEscola(distancia <= RAIO_ESCOLA);
          setLocationError("");
          initialFix = true;
        }


        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 2,
            timeInterval: 4000,
          },
          (loc) => {
            if (!loc?.coords) {
              setLocationError("Não foi possível obter coordenadas.");
              return;
            }

            const distancia = getDistance(
              {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              },
              ESCOLA_COORDS
            );

            console.log(
              "📍 Atualização:",
              loc.coords.latitude,
              loc.coords.longitude,
              "| Escola:",
              ESCOLA_COORDS.latitude,
              ESCOLA_COORDS.longitude,
              "| Distância:",
              distancia,
              "m"
            );

            setLocation(loc);
            setDistanciaEscola(distancia);
            setDentroEscola(distancia <= RAIO_ESCOLA);
            setLocationError("");
            if (!initialFix) {
              initialFix = true;
              setLoadingLocation(false);
            }
          }
        );
      } catch (error) {
        console.error("❌ Erro ao obter localização:", error);
        setLocationError("Erro ao obter localização. Verifique o GPS.");
      } finally {
        // Timeout para evitar travar no loading
        setTimeout(() => setLoadingLocation(false), 8000);
      }
    };

    startWatchingLocation();
    return () => subscriber?.remove();
  }, [locationPermission]);


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
  }, [ticketLiberado, turmaAtual, mensagem, aluno, loadingTurmas]);


  const receberTicket = async () => {
    if (!ticketLiberado || !dentroEscola) {
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


  if (loadingTurmas)
    return (
      <View style={styles.center}>
        <Text>Carregando turmas...</Text>
      </View>
    );

  if (loadingLocation)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#614326" />
        <Text style={{ marginTop: 10 }}>Calculando localização...</Text>
      </View>
    );


  return (
    <ImageBackground
      source={require("../assets/ticket.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Receber Ticket</Text>

        {locationError && <Text style={styles.alert}>{locationError}</Text>}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (() => {
              const disabled =
                !ticketLiberado ||
                !dentroEscola ||
                ticketRecebidoHoje ||
                locationPermission !== "granted";
              return disabled && { opacity: 0.5 };
            })(),
          ]}
          onPress={receberTicket}
          disabled={
            !ticketLiberado ||
            !dentroEscola ||
            ticketRecebidoHoje ||
            locationPermission !== "granted"
          }
        >
          <Text style={styles.primaryButtonText}>
            {ticketRecebidoHoje ? "Ticket já recebido" : "Receber Ticket"}
          </Text>
        </TouchableOpacity>


        {distanciaEscola !== null && (
          <Text style={{ marginTop: 10, color: "black" }}>
            Distância atual: {Math.round(distanciaEscola)} m
          </Text>
        )}

        {!dentroEscola && locationPermission === "granted" && (
          <Text style={styles.alert}>
            Você precisa estar dentro de {RAIO_ESCOLA} metros da escola.
          </Text>
        )}
        {dentroEscola && ticketLiberado && !intervaloAtivo ? (
          <Text style={styles.alert}>
            Janela antecipada: você já pode receber (faltam{" "}
            {Math.max(0, Math.floor(tempoRestante / 60))} min para o intervalo).
          </Text>
        ) : null}
        {dentroEscola && !ticketLiberado ? (
          <Text style={styles.alert}>{mensagem || "Aguarde a liberação."}</Text>
        ) : null}
        {ticketRecebidoHoje ? (
          <Text style={styles.sucesso}>
            Você já reivindicou seu ticket hoje.
          </Text>
        ) : null}
      </View>
    </ImageBackground>
  );
}

