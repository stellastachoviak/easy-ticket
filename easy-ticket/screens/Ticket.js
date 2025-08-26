import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function ReceberTicketScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dentroEscola, setDentroEscola] = useState(false);
  const [podeReceber, setPodeReceber] = useState(false);
  const [ticketRecebido, setTicketRecebido] = useState(false);


const ESCOLA_COORDS = {
  latitude: -27.64662,
  longitude: -48.67036,
};


  const RAIO_ESCOLA = 100; 

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

    
    verificarHorario();
  }, []);

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
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

  function verificarHorario() {
    const agora = new Date();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    
    const intervaloHora = 10;
    const intervaloMinuto = 0;

    const minutosAgora = hora * 60 + minuto;
    const minutosIntervalo = intervaloHora * 60 + intervaloMinuto;

    
    if (minutosAgora >= minutosIntervalo - 5 && minutosAgora <= minutosIntervalo) {
      setPodeReceber(true);
    } else {
      setPodeReceber(false);
    }
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
      ) : podeReceber ? (
        dentroEscola ? (
          <Button title="Receber Ticket" onPress={receberTicket} />
        ) : (
          <Text style={styles.alert}>
            Você precisa estar na escola para receber o ticket.
          </Text>
        )
      ) : (
        <Text style={styles.alert}>
          O botão só aparece 5 minutos antes do intervalo.
        </Text>
      )}
    </View>
  );
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
