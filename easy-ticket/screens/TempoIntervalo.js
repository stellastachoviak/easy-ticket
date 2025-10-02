import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useTime } from "../TimeContext";

export default function TempoIntervalo() {
  const { intervaloAtivo, tempoRestante, mensagem, turmaAtual } = useTime();

  const acabou = tempoRestante <= 0;

  function formatarTempo(segundos) {
    if (segundos <= 0) return "";

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
    <ImageBackground
      source={require("../assets/ticket.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            intervaloAtivo ? styles.cardAtivo : styles.cardInativo,
          ]}
        >
          <Text style={styles.title}>⏰ Intervalo - {turmaAtual || "?"}</Text>
          <Text
            style={[
              styles.status,
              intervaloAtivo ? styles.ativo : styles.inativo,
            ]}
          >
            {intervaloAtivo ? "ATIVO" : "INATIVO"}
          </Text>
          <Text style={styles.timer}>
            {acabou
              ? "intervalo ja acabou"
              : mensagem
                ? `${mensagem}: ${formatarTempo(tempoRestante)}`
                : formatarTempo(tempoRestante)}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardAtivo: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  cardInativo: {
    borderWidth: 2,
    borderColor: "#dd8819ff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ativo: {
    color: "#4CAF50",
  },
  inativo: {
    color: "#F44336",
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E18B5D",
    marginTop: 8,
  },
});
