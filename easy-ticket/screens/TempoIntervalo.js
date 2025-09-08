import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Ajuste aqui para simular horário manual
const usarHorarioManual = false; // coloque false para usar hora real
const manualHora = 15;
const manualMinuto = 0;
const manualSegundo = 0;

export default function TempoIntervalo() {
  // Horário do intervalo em BRT
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
        // 🔹 Força horário manual em UTC
        agoraUTC = new Date();
        agoraUTC.setUTCHours(manualHora + 3); // converte BRT -> UTC
        agoraUTC.setUTCMinutes(manualMinuto);
        agoraUTC.setUTCSeconds(manualSegundo);
      } else {
        agoraUTC = new Date();
      }

      // Converte para BRT (UTC-3) para verificar o dia da semana
      const agoraBRT = new Date(agoraUTC.getTime() - 3 * 60 * 60 * 1000);
      const diaSemanaBRT = agoraBRT.getDay(); // 0=Dom, 1=Seg, ..., 4=Qui, 5=Sex, 6=Sab

      // Verifica se hoje é segunda a quinta
      if (diaSemanaBRT < 1 || diaSemanaBRT > 4) {
        setIntervaloAtivo(false);
        setTempoRestante("Hoje não tem intervalo.");
        return;
      }

      // Define início e fim do intervalo em UTC
      const inicioUTC = new Date(Date.UTC(
        agoraUTC.getUTCFullYear(),
        agoraUTC.getUTCMonth(),
        agoraUTC.getUTCDate(),
        HORA_INICIO_BRT + 3, // 15h BRT = 18h UTC
        MINUTO_INICIO_BRT,
        0,
        0
      ));

      const fimUTC = new Date(Date.UTC(
        agoraUTC.getUTCFullYear(),
        agoraUTC.getUTCMonth(),
        agoraUTC.getUTCDate(),
        HORA_FIM_BRT + 3, // 15:15 BRT = 18:15 UTC
        MINUTO_FIM_BRT,
        0,
        0
      ));

      // Logs em BRT
      const pad = (n) => n.toString().padStart(2, "0");
      const agoraBRT_Hora = (agoraUTC.getUTCHours() - 3 + 24) % 24;
      console.log(
        "Agora (BRT):",
        `${pad(agoraBRT_Hora)}:${pad(agoraUTC.getUTCMinutes())}:${pad(agoraUTC.getUTCSeconds())}`
      );

      // Antes, durante ou depois do intervalo
      if (agoraUTC < inicioUTC) {
        setIntervaloAtivo(false);
        setTempoRestante(
          `Faltam: ${formatarTempo(inicioUTC.getTime() - agoraUTC.getTime())} para o intervalo`
        );
      } else if (agoraUTC >= inicioUTC && agoraUTC <= fimUTC) {
        setIntervaloAtivo(true);
        setTempoRestante(
          `Tempo restante: ${formatarTempo(fimUTC.getTime() - agoraUTC.getTime())}`
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
