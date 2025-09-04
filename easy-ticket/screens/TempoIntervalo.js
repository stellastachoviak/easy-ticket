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
    function atualizarTempo() {
      const agora = new Date();

      
      const diaSemana = agora.getUTCDay(); 
      if (diaSemana < 1 || diaSemana > 4) {
        setIntervaloAtivo(false);
        setTempoRestante("Hoje não tem intervalo.");
        return;
      }

      
      const agoraUtc = new Date(
        agora.getUTCFullYear(),
        agora.getUTCMonth(),
        agora.getUTCDate(),
        agora.getUTCHours(),
        agora.getUTCMinutes(),
        agora.getUTCSeconds()
      );

      const inicio = new Date(
        agoraUtc.getUTCFullYear(),
        agoraUtc.getUTCMonth(),
        agoraUtc.getUTCDate(),
        HORA_INICIO + 3, 
        MINUTO_INICIO,
        0
      );

      const fim = new Date(
        agoraUtc.getUTCFullYear(),
        agoraUtc.getUTCMonth(),
        agoraUtc.getUTCDate(),
        HORA_FIM + 3, 
        MINUTO_FIM,
        0
      );

      console.log("Agora:", agoraUtc.toLocaleString());
      console.log("Início:", inicio.toLocaleString());
      console.log("Fim:", fim.toLocaleString());

      if (agoraUtc < inicio) {
        setIntervaloAtivo(false);
        setTempoRestante(`Faltam: ${formatarTempo(inicio.getTime() - agoraUtc.getTime())} para o intervalo`);
      } else if (agoraUtc >= inicio && agoraUtc <= fim) {
        setIntervaloAtivo(true);
        setTempoRestante(`Tempo restante: ${formatarTempo(fim.getTime() - agoraUtc.getTime())}`);
      } else {
        setIntervaloAtivo(false);
        setTempoRestante("Intervalo já acabou.");
      }
    }

    atualizarTempo();
    const timer = setInterval(atualizarTempo, 1000);

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
      <Text style={styles.timer}>{tempoRestante}</Text>
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
