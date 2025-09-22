import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import styles from '../styles/TelaAdmStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HistoricoTickets from "./HistoricoTickets";
import StatusTicketsHoje from "./StatusTicketsHoje";
import { Picker } from "@react-native-picker/picker";
import { useTime } from "../TimeContext";

const Drawer = createDrawerNavigator();

function PrincipalAdm() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turma, setTurma] = useState("Desi-V1");
  const [alunos, setAlunos] = useState([]);

  const { turmaAtual } = useTime();
  const turmasDisponiveis = Object.keys(
    {
      "Desi-V1": true,
      "Desi-V2": true,
      "Desi-V3": true,
      ...useTime().horarios
    }
  );

  useEffect(() => { carregarAlunos(); }, []);

  const carregarAlunos = async () => {
    try {
      const json = await AsyncStorage.getItem("alunos");
      if (json) setAlunos(JSON.parse(json));
    } catch (e) { console.log("Erro ao carregar alunos", e); }
  };

  const salvarAluno = async () => {
    if (!nome || !matricula || !turma) return;
    const novoAluno = { nome, matricula, turma };
    const novaLista = [...alunos, novoAluno];
    setAlunos(novaLista);
    await AsyncStorage.setItem("alunos", JSON.stringify(novaLista));
    setNome("");
  };

  const resetarAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("alunos");
      setAlunos([]);
    } catch (e) {
      console.log("Erro ao resetar alunos", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Alunos</Text>
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
        keyboardType="numeric"
      />
      <Picker
        selectedValue={turma}
        style={styles.input}
        onValueChange={(itemValue) => setTurma(itemValue)}
      >
        {turmasDisponiveis.map((turma) => (
          <Picker.Item key={turma} label={turma} value={turma} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={salvarAluno}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "red", marginBottom: 20 }]} onPress={resetarAsyncStorage}>
        <Text style={styles.buttonText}>Resetar Tickets</Text>
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

export default function TelaAdm() {
  return (
    <Drawer.Navigator initialRouteName="Administração">
      <Drawer.Screen name="Administração" component={PrincipalAdm} />
      <Drawer.Screen name="Status dos Tickets de Hoje" component={StatusTicketsHoje} />
      <Drawer.Screen name="Histórico de Tickets" component={HistoricoTickets} />
    </Drawer.Navigator>
  );
}

