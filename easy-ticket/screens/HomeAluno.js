import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useAuth } from "../AuthContext"; // Importa o AuthContext

export default function HomeAluno() {
  const { user: aluno } = useAuth(); // Pega o usuário logado

  return (
    <ImageBackground
      source={require('../assets/fundo.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}> {/* Sem opacidade extra, igual ao intervalo */}
        <Text style={styles.title}>Bem-vindo, {aluno?.nome || "Aluno"}!</Text>
        <Text style={styles.subtitle}>Sua matrícula: {aluno?.matricula || "N/A"}</Text>
        <Text style={styles.subtitle}>Sua turma: {aluno?.turma || "N/A"}</Text>
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
    fontFamily: "Playfair Display",
  },
  subtitle: {
    fontSize: 18,
    color: "#7A8C8C",
    marginBottom: 5,
    fontFamily: "Playfair Display",
  },
  info: {
    fontSize: 16,
    color: "#86614cff",
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Playfair Display",
  },
});
