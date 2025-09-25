import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import usuarios from "../data/usuarios.json";
import { useTime } from "../TimeContext";

export default function Login({ navigation }) {
  const [isAdm, setIsAdm] = useState(true);
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setTurmaAtual } = useTime();

  const handleLogin = async () => {
    if (!matricula.trim() || (isAdm && !senha.trim())) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (isAdm) {
      const encontrado = usuarios.admins.find(
        (adm) => adm.matricula === matricula && adm.senha === senha
      );

      if (encontrado) {
        navigation.navigate("TelaAdm");
      } else {
        Alert.alert("Erro", "Matrícula ou senha inválida!");
      }
    } else {
      try {
        const json = await AsyncStorage.getItem("alunos");
        const alunos = json ? JSON.parse(json) : [];

        const alunoEncontrado = alunos.find(
          (aluno) => aluno.matricula === matricula
        );

        if (alunoEncontrado) {
          setTurmaAtual(alunoEncontrado.turma);
          navigation.navigate("HomeAluno", { aluno: alunoEncontrado });
        } else {
          Alert.alert("Erro", "Matrícula não encontrada!");
        }
      } catch (e) {
        console.log("Erro ao verificar aluno", e);
        Alert.alert("Erro", "Não foi possível verificar a matrícula.");
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={{ flexDirection: 'row', width: '100%', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }, isAdm ? {} : { backgroundColor: '#B6B6A2' }]}
            onPress={() => setIsAdm(true)}
          >
            <Text style={[styles.buttonText, isAdm ? {} : { color: '#7A8C8C' }]}>Administrador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }, !isAdm ? {} : { backgroundColor: '#B6B6A2' }]}
            onPress={() => setIsAdm(false)}
          >
            <Text style={[styles.buttonText, !isAdm ? {} : { color: '#7A8C8C' }]}>Aluno</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="person" size={22} style={styles.icon} />
          <TextInput
            style={styles.inputText}
            placeholder={isAdm ? "Matrícula" : "Matrícula do Aluno"}
            value={matricula}
            onChangeText={setMatricula}
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
        </View>
        {isAdm && (
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed" size={22} style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              placeholderTextColor="#fff"
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}
          style={{ marginTop: 16 }}>
          <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
