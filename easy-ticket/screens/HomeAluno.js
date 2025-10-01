import React from "react";
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { useAuth } from "../AuthContext"; // Importa o AuthContext

export default function HomeAluno() {
  const { user: aluno } = useAuth(); // Pega o usuário logado

  const toPlainString = (v) => {
    if (v === null || v === undefined) return "N/A";
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) return v.map(item => toPlainString(item)).join(", ");
    if (typeof v === "object") {

      if (v.nome) return toPlainString(v.nome);
      if (v.turma) return toPlainString(v.turma);
      if (v.id) return String(v.id);
      return "[obj]";
    }
    return "N/A";
  };

  if (!aluno) {
    return (
      <ImageBackground
        source={require('../assets/ticket.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#86614cff" />
          <Text style={styles.info}>Carregando...</Text>
        </View>
      </ImageBackground>
    );
  }

  const nome = toPlainString(aluno?.nome) || "Aluno";
  const matricula = toPlainString(aluno?.matricula);
  const turma = toPlainString(aluno?.turma);

  // Log de depuração
  console.log("[HomeAluno] render ->", {
    aluno,
    nome, nomeType: typeof nome,
    matricula, matriculaType: typeof matricula,
    turma, turmaType: typeof turma
  });

  return (
    <ImageBackground
      source={require('../assets/ticket.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo, {nome}!</Text>
        <Text style={styles.subtitle}>Sua matrícula: {matricula}</Text>
        <Text style={styles.subtitle}>Sua turma: {turma}</Text>
        <Text style={styles.info}>Use as abas abaixo para navegar.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333", 
  },
  subtitle: {
    fontSize: 18,
    color: "#7A8C8C",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#86614cff",
    marginTop: 20,
    textAlign: "center",
  },
});
