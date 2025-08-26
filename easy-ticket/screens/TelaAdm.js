import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function TelaAdm() {
  const [nome, setNome] = useState("")
  const [matricula, setMatricula] = useState("")
  const [alunos, setAlunos] = useState([])
  useEffect(() => {
    carregarAlunos()
  }, [])
  const carregarAlunos = async () => {
    try {
      const json = await AsyncStorage.getItem("alunos");
      if (json != null) {
        setAlunos(JSON.parse(json))
      }
    } catch (e) {
      console.log("Erro ao carregar alunos", e)
    }
  }
  const salvarAluno = async () => {
    if (!nome || !matricula) {
      alert("Preencha todos os campos")
      return
    }
    const novoAluno = { nome, matricula }

    try {
      const listaAtualizada = [...alunos, novoAluno];
      await AsyncStorage.setItem("alunos", JSON.stringify(listaAtualizada));
      setAlunos(listaAtualizada);
      setNome("")
      setMatricula("")
    } catch (e) {
      console.log("Erro ao salvar aluno", e)
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>


      <TextInput
        style={styles.input}
        placeholder="Nome do aluno"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <TouchableOpacity style={styles.button} onPress={salvarAluno}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Alunos cadastrados:</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} - {item.matricula}
            </Text>
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
  button: {
    backgroundColor: "#2979ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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
