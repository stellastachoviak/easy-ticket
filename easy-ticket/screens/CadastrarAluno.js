import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "../styles/CadastrarAluno"
function PrincipalAdm() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turma, setTurma] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    carregarAlunos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarTurmas();
    }, [])
  );

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
      if (json) {
        const lista = JSON.parse(json);
        setTurmasDisponiveis(lista);
        if (lista.length > 0 && !lista.some(t => t.nome === turma)) {
          setTurma(lista[0].nome);
        }
      } else {
        setTurmasDisponiveis([]);
        setTurma("");
      }
    } catch (e) {
      console.log("Erro ao carregar turmas", e);
    }
  };

  const salvarAluno = async () => {

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // letras + acentos
    const regexMatricula = /^[0-9]+$/; // apenas números

    if (!nome || !matricula || !turma) {
      Alert.alert("Erro", "Todos os campos devem estar preenchidos");
      return;
    }

    if (!regexNome.test(nome)) {
      Alert.alert("Erro", "O nome deve conter apenas letras e espaços");
      return;
    }

    if (!regexMatricula.test(matricula)) {
      Alert.alert("Erro", "A matrícula deve conter apenas números");
      return;
    }

    if (alunos.some((a) => a.matricula === matricula)) {
      Alert.alert("Erro", "Já existe um aluno com essa matrícula");
      return;
    }

    const novoAluno = { nome, matricula, turma };
    const novaLista = [...alunos, novoAluno];
    setAlunos(novaLista);
    await AsyncStorage.setItem("alunos", JSON.stringify(novaLista));

    setNome("");
    setMatricula("");
    setTurma(turmasDisponiveis[0]?.nome || "");
  };

  const excluirAluno = async (matricula) => {
    const novaLista = alunos.filter((a) => a.matricula !== matricula);
    setAlunos(novaLista);
    await AsyncStorage.setItem("alunos", JSON.stringify(novaLista));
  };

  return (
    <View style={styles.container}>

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
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={turma}
          onValueChange={(itemValue) => setTurma(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          dropdownIconColor="#2979ff"
        >
          {turmasDisponiveis.map((t) => (
            <Picker.Item key={t.nome} label={`${t.nome} (${t.inicio} às ${t.fim})`} value={t.nome} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarAluno}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Alunos cadastrados:</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} - {item.matricula} - {item.turma}
            </Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#4caf50" }]}
                onPress={() => navigation.navigate("EditarAluno", { aluno: item })}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#f44336" }]}
                onPress={() => excluirAluno(item.matricula)}
              >
                <Text style={styles.smallButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default PrincipalAdm;
