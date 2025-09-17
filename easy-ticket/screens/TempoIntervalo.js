import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTime } from "../TimeContext";

export default function TempoIntervalo() {
  const { intervaloAtivo, tempoRestante, mensagem, turmaAtual } = useTime();

  function formatarTempo(segundos) {
  if (segundos <= 0) return "00:00";

  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const sec = segundos % 60;

  if (horas > 0) {
    return `${horas}h ${minutos}min`;
  }

  if (minutos >= 1) {
    return `${minutos.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }

  return `00:${sec.toString().padStart(2, "0")}`;
}


  return (
    <View style={styles.container}>
      <View style={[styles.card, intervaloAtivo ? styles.cardAtivo : styles.cardInativo]}>
        <Text style={styles.title}>⏰ Intervalo - {turmaAtual || "?"}</Text>
        <Text style={[styles.status, intervaloAtivo ? styles.ativo : styles.inativo]}>
          {intervaloAtivo ? "ATIVO" : "INATIVO"}
        </Text>
        <Text style={styles.timer}>
  {mensagem
    ? `${mensagem}: ${formatarTempo(tempoRestante)}`
    : formatarTempo(tempoRestante)}
</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b2a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardAtivo: {
    backgroundColor: "#d1f7d6",
  },
  cardInativo: {
    backgroundColor: "#ffe5e5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  status: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ativo: {
    color: "#1a8917",
  },
  inativo: {
    color: "#b00020",
  },
  timer: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    width:290
  },
});
