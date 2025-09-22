import React from "react";
import { View, Text, ImageBackground } from "react-native";
import styles from '../styles/TempoIntervaloStyles';
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
    <ImageBackground
      source={require('../assets/coffe_imgg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
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
    </ImageBackground>
  );
}
