import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTime } from "../TimeContext";

export default function TempoIntervalo() {
  const { intervaloAtivo, tempoRestante } = useTime();

  function formatarTempo(ms) {
    if (typeof ms !== "number" || ms <= 0) return "00:00";
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {intervaloAtivo ? "Intervalo ATIVO" : "Intervalo INATIVO"}
      </Text>
      <Text style={styles.timer}>
        {typeof tempoRestante === "number"
          ? formatarTempo(tempoRestante * 1000)
          : tempoRestante}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 5,
    color: "#007bff",
  },
  timer: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
