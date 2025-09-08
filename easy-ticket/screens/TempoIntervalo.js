import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Ajuste aqui para simular horário manual
const usarHorarioManual = false; // coloque false para usar hora real
const manualHora = 15;
const manualMinuto = 0;
const manualSegundo = 0;

export default function TempoIntervalo() {
  const HORA_INICIO_BRT = 15;
  const MINUTO_INICIO_BRT = 0;
  const HORA_FIM_BRT = 15;
  const MINUTO_FIM_BRT = 15;

  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState("");

  useEffect(() => {
    function atualizarTempo() {
      let agoraUTC;

      if (usarHorarioManual) {
        agoraUTC = new Date();
        agoraUTC.setUTCHours(manualHora + 3);
        agoraUTC.setUTCMinutes(manualMinuto);
        agoraUTC.setUTCSeconds(manualSegundo);
      } else {
        agoraUTC = new Date();
      }

      const agoraBRT = new Date(agoraUTC.getTime() - 3 * 60 * 60 * 1000);
      const diaSemanaBRT = agoraBRT.getDay();

      if (diaSemanaBRT < 1 || diaSemanaBRT > 4) {
        setIntervaloAtivo(false);
        setTempoRestante("Hoje não tem intervalo.");
        return;
      }

      const inicioUTC = new Date(Date.UTC(
        agoraUTC.getUTCFullYear(),
        agoraUTC.getUTCMonth(),
        agoraUTC.getUTCDate(),
        HORA_INICIO_BRT + 3,
        MINUTO_INICIO_BRT,
        0,
        0
      ));

      const fimUTC = new Date(Date.UTC(
        agoraUTC.getUTCFullYear(),
        agoraUTC.getUTCMonth(),
        agoraUTC.getUTCDate(),
        HORA_FIM_BRT + 3,
        MINUTO_FIM_BRT,
        0,
        0
      ));

      if (agoraUTC < inicioUTC) {
        setIntervaloAtivo(false);
        setTempoRestante(
          `Faltam ${formatarTempo(inicioUTC.getTime() - agoraUTC.getTime())}`
        );
      } else if (agoraUTC >= inicioUTC && agoraUTC <= fimUTC) {
        setIntervaloAtivo(true);
        setTempoRestante(
          `Restam ${formatarTempo(fimUTC.getTime() - agoraUTC.getTime())}`
        );
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
    return `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, intervaloAtivo ? styles.cardAtivo : styles.cardInativo]}>
        <Text style={styles.title}>⏰ Intervalo</Text>
        <Text style={[styles.status, intervaloAtivo ? styles.ativo : styles.inativo]}>
          {intervaloAtivo ? "ATIVO" : "INATIVO"}
        </Text>
        <Text style={styles.timer}>{tempoRestante}</Text>
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
  },
});
