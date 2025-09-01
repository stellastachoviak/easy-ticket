import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TempoIntervalo() {
  
  const HORA_INICIO = 15;
  const MINUTO_INICIO = 0;
  const HORA_FIM = 15;
  const MINUTO_FIM = 15;

  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();

      const inicio = new Date();
      inicio.setHours(HORA_INICIO, MINUTO_INICIO, 0, 0);

      const fim = new Date();
      fim.setHours(HORA_FIM, MINUTO_FIM, 0, 0);

      if (agora >= inicio && agora <= fim) {
        setIntervaloAtivo(true);
        const diffMs = fim - agora;
        setTempoRestante(formatarTempo(diffMs));
      } else if (agora < inicio) {
        setIntervaloAtivo(false);
        const diffMs = inicio - agora;
        setTempoRestante(formatarTempo(diffMs));
      } else {
        setIntervaloAtivo(false);
        setTempoRestante("Intervalo já acabou.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function formatarTempo(ms) {
    if (ms <= 0) return "00:00";
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
        {intervaloAtivo
          ? `Tempo restante: ${tempoRestante}`
          : tempoRestante === "Intervalo já acabou."
          ? tempoRestante
          : `Faltam: ${tempoRestante} para o intervalo`}
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