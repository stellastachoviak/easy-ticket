import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function EditarAluno({ route }) {
  const { aluno } = route.params; // Aluno que veio da tela PrincipalAdm
  const [nome, setNome] = useState(aluno.nome);
  const [matricula, setMatricula] = useState(aluno.matricula);
  const [turma, setTurma] = useState(aluno.turma);
  const [alunos, setAlunos] = useState([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    carregarAlunos();
    carregarTurmas();
  }, []);

  const carregarAlunos = async () => {
    try {
      const json = await AsyncStorage.getItem("alunos");
      if (json) setAlunos(JSON.parse(json));
    } catch (e) {
      console.log("Erro ao carregar alunos", e);
    }
  };

  const carregarTurmas = async () => {
    try {
      const json = await AsyncStorage.getItem("turmas");
      if (json) setTurmasDisponiveis(JSON.parse(json));
    } catch (e) {
      console.log("Erro ao carregar turmas", e);
    }
  };

  const validarNome = (nome) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(nome);
  const validarMatricula = (matricula) => /^\d+$/.test(matricula);

  const salvarAlteracoes = async () => {
    if (!nome || !matricula || !turma) {
      Alert.alert("Erro", "Todos os campos devem estar preenchidos");
      return;
    }

    if (!validarMatricula(matricula)) {
      Alert.alert("Erro", "Matrícula deve ter somente números");
      return;
    }

    if (!validarNome(nome)) {
      Alert.alert("Erro", "Nome deve ter somente letras");
      return;
    }

    // Verificar se a matrícula já existe em outro aluno
    const matriculaExistente = alunos.some(
      (a) => a.matricula === matricula && a.matricula !== aluno.matricula
    );
    if (matriculaExistente) {
      Alert.alert("Erro", "Já existe outro aluno com essa matrícula!");
      return;
    }

    const novaLista = alunos.map((a) =>
      a.matricula === aluno.matricula
        ? { ...a, nome: nome, matricula: matricula, turma: turma }
        : a
    );

    setAlunos(novaLista);
    await AsyncStorage.setItem("alunos", JSON.stringify(novaLista));
    Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />

      <Picker
        selectedValue={turma}
        onValueChange={(itemValue) => setTurma(itemValue)}
        style={styles.picker}
      >
        {turmasDisponiveis.map((t) => (
          <Picker.Item key={t.nome} label={`${t.nome} (${t.inicio} às ${t.fim})`} value={t.nome} />
        ))}
      </Picker>

      <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
        <Text style={styles.buttonText}>
          Voltar para Tela do Admin
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: { width: "100%", height: 50, marginBottom: 20 },
  button: {
    backgroundColor: "#2979ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
