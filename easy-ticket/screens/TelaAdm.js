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
import { createDrawerNavigator } from "@react-navigation/drawer";
import HistoricoTickets from "./HistoricoTickets";
import StatusTicketsHoje from "./StatusTicketsHoje";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext";

const Drawer = createDrawerNavigator();

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => {
        Alert.alert("Deslogar", "Deseja realmente sair?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim", onPress: logout },
        ]);
      }}
    >
      <Text style={{ color: "#007AFF", fontWeight: "bold" }}>Sair</Text>
    </TouchableOpacity>
  );
}

function PrincipalAdm() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turma, setTurma] = useState("Desi-V1");
  const [alunos, setAlunos] = useState([]);

  const navigation = useNavigation();
  const turmasDisponiveis = ["Desi-V1", "Desi-V2", "Desi-V3"];

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const json = await AsyncStorage.getItem("alunos");
      if (json) setAlunos(JSON.parse(json));
    } catch (e) {
      console.log("Erro ao carregar alunos", e);
    }
  };

  const salvarAluno = async () => {
    if (!nome || !matricula || !turma) {
      Alert.alert("Erro", "Todos os campos devem estar preenchidos");
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
    setTurma(turmasDisponiveis[0]);
  };

  const excluirAluno = async (matricula) => {
    const novaLista = alunos.filter((a) => a.matricula !== matricula);
    setAlunos(novaLista);
    await AsyncStorage.setItem("alunos", JSON.stringify(novaLista));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administração</Text>

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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={turma}
          onValueChange={(itemValue) => setTurma(itemValue)}
          style={styles.picker}
        >
          {turmasDisponiveis.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
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

export default function TelaAdm() {
  return (
    <Drawer.Navigator
      initialRouteName="Administração"
      screenOptions={{
        headerRight: () => <LogoutButton />, // botão sair global
      }}
    >
      <Drawer.Screen name="Administração" component={PrincipalAdm} />
      <Drawer.Screen name="Status dos Tickets de Hoje" component={StatusTicketsHoje} />
      <Drawer.Screen name="Histórico de Tickets" component={HistoricoTickets} />
    </Drawer.Navigator>
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
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemText: { fontSize: 14, flex: 1 },
  buttonsRow: {
    flexDirection: "row",
    marginLeft: 10,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 5,
  },
  smallButtonText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
});
