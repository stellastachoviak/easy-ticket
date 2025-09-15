import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function TelaAdm() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turma, setTurma] = useState("Desi-V1");
  const [alunos, setAlunos] = useState([]);

  useEffect(() => { carregarAlunos(); }, []);

  const carregarAlunos = async () => {
    try {
      const json = await AsyncStorage.getItem("alunos");
      if (json) setAlunos(JSON.parse(json));
    } catch (e) { console.log("Erro ao carregar alunos", e); }
  };

  const salvarAluno = async () => {
    if (!nome || !matricula) {
      alert("Preencha todos os campos");
      return;
    }
    const novoAluno = { nome, matricula, turma };
    try {
      const listaAtualizada = [...alunos, novoAluno];
      await AsyncStorage.setItem("alunos", JSON.stringify(listaAtualizada));
      setAlunos(listaAtualizada);
      setNome(""); setMatricula(""); setTurma("Desi-V1");
    } catch (e) { console.log("Erro ao salvar aluno", e); }
  };

  // ✅ Função para resetar tickets
const resetarAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem("tickets");
    await AsyncStorage.removeItem("ticket_logs");
    console.log("AsyncStorage limpo!");
    alert("AsyncStorage limpo!");
  } catch (e) {
    console.log("Erro ao limpar AsyncStorage", e);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>

      <TextInput style={styles.input} placeholder="Nome do aluno" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Matrícula" value={matricula} onChangeText={setMatricula} />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Turma:</Text>
        <Picker selectedValue={turma} style={styles.picker} onValueChange={setTurma}>
          <Picker.Item label="Desi-V1" value="Desi-V1" />
          <Picker.Item label="Desi-V2" value="Desi-V2" />
          <Picker.Item label="Desi-V3" value="Desi-V3" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarAluno}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      {/* Botão de reset de tickets */}
      <TouchableOpacity style={[styles.button, { backgroundColor: "red", marginBottom: 20 }]} onPress={resetarAsyncStorage}>
        <Text style={styles.buttonText}>Resetar Tickets</Text>
      </TouchableOpacity>

      {/* Botão para ver histórico de tickets */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4caf50" }]}
        onPress={() => navigation.navigate("HistoricoTickets")}
      >
        <Text style={styles.buttonText}>Ver Histórico de Tickets</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Alunos cadastrados:</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome} - {item.matricula} - {item.turma}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: { marginLeft: 10, marginTop: 5, fontWeight: "bold" },
  picker: { height: 50, width: "100%" },
  button: {
    backgroundColor: "#2979ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  item: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemText: { fontSize: 15 },
});
