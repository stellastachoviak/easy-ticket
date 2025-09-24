import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeAluno({ route }) {
  const aluno = route?.params?.aluno;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {aluno?.nome || "Aluno"}!</Text>
      <Text style={styles.subtitle}>Sua matrícula: {aluno?.matricula || "N/A"}</Text>
      <Text style={styles.subtitle}>Sua turma: {aluno?.turma || "N/A"}</Text>
      <Text style={styles.info}>Use as abas abaixo para navegar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "#f0f2f5",
     padding: 20,
   },
   title: {
     fontSize: 24,
     fontWeight: "bold",
     marginBottom: 10,
     color: "#333",
   },
   subtitle: {
     fontSize: 18,
     color: "#555",
     marginBottom: 5,
   },
   info: {
     fontSize: 16,
     color: "#777",
     marginTop: 20,
     textAlign: "center",
   },
 });
 
