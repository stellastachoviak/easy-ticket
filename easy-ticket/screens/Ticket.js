import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useTime } from "../TimeContext";

export default function Ticket() {
  const { tempoRestante, ticketLiberado } = useTime();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebido, setTicketRecebido] = useState(false);

  // Coordenadas da escola
  const ESCOLA_COORDS = {
    latitude: -27.64662,
    longitude: -48.67036,
  };
  const RAIO_ESCOLA = 100; // metros

  // Pega localização e verifica se está na escola
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada para acessar localização.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (currentLocation) {
        const distancia = calcularDistancia(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          ESCOLA_COORDS.latitude,
          ESCOLA_COORDS.longitude
        );
        setDentroEscola(distancia <= RAIO_ESCOLA);
      }
    })();
  }, []);

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // raio da Terra em metros
    const toRad = (grau) => (grau * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function receberTicket() {
    if (ticketRecebido) {
      Alert.alert("Atenção", "Você já recebeu seu ticket hoje!");
      return;
    }

    setTicketRecebido(true);
    Alert.alert("Sucesso", "Você recebeu seu ticket!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receber Ticket</Text>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {ticketRecebido ? (
        <Text style={styles.sucesso}>🎉 Ticket recebido com sucesso!</Text>
      ) : ticketLiberado ? (
        dentroEscola ? (
          <Button title="Receber Ticket" onPress={receberTicket} />
        ) : (
          <Text style={styles.alert}>
            Você precisa estar na escola para receber o ticket.
          </Text>
        )
      ) : (
        <Text style={styles.alert}>
          O ticket só será liberado quando o intervalo começar.
          {"\n"}Tempo restante: {formatarTempo(tempoRestante)}
        </Text>
      )}
    </View>
  );
}

function formatarTempo(segundos) {
  if (segundos <= 0) return "00:00";
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alert: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  sucesso: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
});
