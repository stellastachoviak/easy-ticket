import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usuarios from "../data/usuarios.json";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { setTurmaAtual } from "../redux/timeSlice";
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';

export default function Login({ navigation }) {
  const [isAdm, setIsAdm] = useState(true);
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // novo estado para mensagem de erro

  const handleLogin = async () => {
    setError(""); // reseta erro anterior
    if (!matricula.trim() || (isAdm && !senha.trim())) {
      setError("Preencha todos os campos!");
      return;
    }
    if (isAdm) {
      const encontrado = usuarios.admins.find(a => a.matricula === matricula && a.senha === senha);
      if (encontrado) {
        await dispatch(loginUser({ ...encontrado, type: "admin" }));
        setError("");
        navigation.reset({ index: 0, routes: [{ name: "DrawerAdmin" }] });
      } else {
        setError("Matrícula ou senha inválida!");
      }
    } else {
      const json = await AsyncStorage.getItem("alunos");
      const alunos = json ? JSON.parse(json) : [];
      const alunoEncontrado = alunos.find(a => a.matricula === matricula);
      if (alunoEncontrado) {
        await dispatch(loginUser({ ...alunoEncontrado, type: "aluno" }));
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify({ ...alunoEncontrado, type: "aluno" }));
        dispatch(setTurmaAtual(alunoEncontrado.turma));
        setError("");
        navigation.reset({ index: 0, routes: [{ name: "AppTabs" }] });
      } else {
        setError("Matrícula não encontrada!");
      }
    }
  };

  return (
    <ImageBackground source={require('../assets/cafeteria.png')} style={styles.container} resizeMode="cover">
  <View style={{ width: '90%', alignSelf: 'center', backgroundColor: 'rgba(243,236,231,0.92)', borderRadius: 32, padding: 24, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', width: '100%', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }, isAdm ? {} : { backgroundColor: '#D8D8D8' }]}
            onPress={() => setIsAdm(true)}
          >
            <Text style={[styles.buttonText, isAdm ? {} : { color: '#7A8C8C' }]}>Administrador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }, !isAdm ? {} : { backgroundColor: '#D8D8D8' }]}
            onPress={() => setIsAdm(false)}
          >
            <Text style={[styles.buttonText, !isAdm ? {} : { color: '#7A8C8C' }]}>Aluno</Text>
          </TouchableOpacity>
        </View>
        


        <View style={styles.inputRow}>
          <Ionicons name="person" size={22} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={isAdm ? "Matrícula" : "Matrícula do Aluno"}
            value={matricula}
            onChangeText={(t)=>{ setMatricula(t); if (error) setError(""); }}
            keyboardType="numeric"
            placeholderTextColor="#a1a1a1ff"
          />
        </View>
          

        {isAdm ? (
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed" size={22} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={(t)=>{ setSenha(t); if (error) setError(""); }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#a1a1a1ff"
            />
          </View>
        ) : null}
        {error ? (
          <Text style={{ color: 'red', marginBottom: 12, alignSelf: 'flex-start' }}>
            {error}
          </Text>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}
          style={{ marginTop: 18 }}>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
