import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
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
    <ImageBackground source={require('../assets/cafeteria_background.jpg')} style={styles.container} resizeMode="cover">
      <View style={{ width: '90%', alignSelf: 'center', backgroundColor: 'rgba(216,187,165,0.85)', borderRadius: 32, padding: 24, alignItems: 'center' }}>
        {/* Botões de seleção */}
        <View style={{ flexDirection: 'row', width: '100%', gap: 12, marginBottom: 24 }}>
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
        {/* Campo Matrícula */}
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: styles.input.backgroundColor, borderRadius: styles.input.borderRadius, minHeight: styles.input.minHeight, marginVertical: styles.input.marginVertical, paddingHorizontal: styles.input.paddingHorizontal, paddingVertical: styles.input.paddingVertical, marginBottom: 12, shadowColor: styles.input.shadowColor, shadowOffset: styles.input.shadowOffset, shadowOpacity: styles.input.shadowOpacity, shadowRadius: styles.input.shadowRadius, elevation: styles.input.elevation }}>
          <Ionicons name="person" size={24} color="#fff" style={{ marginRight: 12 }} />
          <TextInput
            style={{ flex: 1, color: '#fff', fontSize: 16 }}
            placeholder={isAdm ? "Matrícula" : "Matrícula do Aluno"}
            value={matricula}
            onChangeText={setMatricula}
            keyboardType="numeric"
            placeholderTextColor="#fff"
          />
        </View>
        {/* Campo Senha */}
        {isAdm && (
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: styles.input.backgroundColor, borderRadius: styles.input.borderRadius, minHeight: styles.input.minHeight, marginVertical: styles.input.marginVertical, paddingHorizontal: styles.input.paddingHorizontal, paddingVertical: styles.input.paddingVertical, marginBottom: 12, shadowColor: styles.input.shadowColor, shadowOffset: styles.input.shadowOffset, shadowOpacity: styles.input.shadowOpacity, shadowRadius: styles.input.shadowRadius, elevation: styles.input.elevation }}>
            <Ionicons name="lock-closed" size={24} color="#fff" style={{ marginRight: 12 }} />
            <TextInput
              style={{ flex: 1, color: '#fff', fontSize: 16 }}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              placeholderTextColor="#fff"
            />
          </View>
        )}
        {/* Botão Entrar */}
        <TouchableOpacity
          style={[styles.button, { marginTop: 24 }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        {/* Link Cadastro */}
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}
          style={{ marginTop: 18 }}>
          <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
