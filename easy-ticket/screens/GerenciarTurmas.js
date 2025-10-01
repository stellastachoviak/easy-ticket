import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/GerenciarTurmas";
export default function GerenciarTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [nome, setNome] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    const json = await AsyncStorage.getItem("turmas");
    if (json) setTurmas(JSON.parse(json));
  };

  const salvarTurmas = async (lista) => {
    setTurmas(lista);
    await AsyncStorage.setItem("turmas", JSON.stringify(lista));
  };

  const limparCampos = () => {
    setNome("");
    setInicio("");
    setFim("");
    setEditando(null);
  };

  const validarHorario = (h) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(h);

  const adicionarOuEditarTurma = async () => {
    if (!nome || !inicio || !fim) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (!validarHorario(inicio) || !validarHorario(fim)) {
      Alert.alert("Erro", "Horário deve estar no formato HH:MM");
      return;
    }
    if (editando !== null) {
      if (turmas.some((t, idx) => t.nome === nome && idx !== editando)) {
        Alert.alert("Erro", "Já existe uma turma com esse nome");
        return;
      }
      const novaLista = turmas.map((t, idx) =>
        idx === editando ? { nome, inicio, fim } : t
      );
      await salvarTurmas(novaLista);
    } else {
      if (turmas.some((t) => t.nome === nome)) {
        Alert.alert("Erro", "Já existe uma turma com esse nome");
        return;
      }
      await salvarTurmas([...turmas, { nome, inicio, fim }]);
    }
    limparCampos();
  };

  const editarTurma = (idx) => {
    setEditando(idx);
    setNome(turmas[idx].nome);
    setInicio(turmas[idx].inicio);
    setFim(turmas[idx].fim);
  };

  const excluirTurma = async (idx) => {
    const novaLista = turmas.filter((_, i) => i !== idx);
    await salvarTurmas(novaLista);
    limparCampos();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da turma"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Início (HH:MM)"
        value={inicio}
        onChangeText={setInicio}
        maxLength={5}
      />
      <TextInput
        style={styles.input}
        placeholder="Fim (HH:MM)"
        value={fim}
        onChangeText={setFim}
        maxLength={5}
      />
      <TouchableOpacity style={styles.button} onPress={adicionarOuEditarTurma}>
        <Text style={styles.buttonText}>{editando !== null ? "Salvar Edição" : "Adicionar Turma"}</Text>
      </TouchableOpacity>
      {editando !== null ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: "#aaa" }]} onPress={limparCampos}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.subtitle}>Turmas cadastradas:</Text>
      <FlatList
        data={turmas}
        keyExtractor={(item) => item.nome}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} - {item.inicio} às {item.fim}
            </Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#4caf50" }]}
                onPress={() => editarTurma(index)}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#f44336" }]}
                onPress={() => excluirTurma(index)}
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
