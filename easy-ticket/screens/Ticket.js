import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { useTime } from '../TimeContext';

export default function ReceberTicketScreen() {
  const { ticketLiberado, usarHorarioManual } = useTime();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [ticketRecebido, setTicketRecebido] = useState(false);
  const [podeReceber, setPodeReceber] = useState(false);

  const ESCOLA_COORDS = { latitude: -27.6183, longitude: -48.6628 };
  const RAIO_ESCOLA = 200;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada para acessar localização.");
        return;
      }

      try {
        // pede posição atual (alta precisão)
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation(currentLocation);

        if (currentLocation?.coords) {
          const distancia = calcularDistancia(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            ESCOLA_COORDS.latitude,
            ESCOLA_COORDS.longitude
          );
          console.log("distância (m):", distancia);
          setDentroEscola(distancia <= RAIO_ESCOLA);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Não foi possível obter a localização.");
      }
    })();
  }, []);

  useEffect(() => {
    if (usarHorarioManual) {
      setPodeReceber(ticketLiberado);
    } else {
      const agora = new Date();
      const hora = agora.getHours();
      const minuto = agora.getMinutes();
      setPodeReceber((hora === 14 && minuto >= 55) || (hora === 15 && minuto < 15));
    }
  }, [ticketLiberado, usarHorarioManual]);

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    // getDistance retorna distância em metros (integer)
    return getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
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
        <Text style={styles.sucesso}>Ticket disponível!</Text>
      ) : podeReceber && dentroEscola ? (
        <Button title="Receber Ticket" onPress={receberTicket} />
      ) : (
        <Text style={styles.alert}>
          {dentroEscola
            ? "O ticket ainda não está liberado."
            : `Você precisa estar dentro de ${RAIO_ESCOLA} metros da escola para receber o ticket.`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  alert: { marginTop: 10, fontSize: 16, color: "red", textAlign: "center" },
  error: { color: "red", marginBottom: 10 },
  sucesso: { fontSize: 18, fontWeight: "bold", color: "green" },
});
