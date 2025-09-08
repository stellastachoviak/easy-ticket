import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import usuarios from "../data/usuarios.json"; 
import { useTime } from '../TimeContext';

export default function Login({ navigation }) {
  const { tempoRestante } = useTime();
  const [isAdm, setIsAdm] = useState(true);
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
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
      
      navigation.navigate("HomeAluno");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <TouchableOpacity
            style={[styles.switchButton, isAdm && styles.activeSwitch]}
            onPress={() => setIsAdm(true)}
          >
            <Text style={[styles.switchText, isAdm && styles.activeText]}>
              Adm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, !isAdm && styles.activeSwitch]}
            onPress={() => setIsAdm(false)}
          >
            <Text style={[styles.switchText, !isAdm && styles.activeText]}>
              Aluno
            </Text>
          </TouchableOpacity>
        </View>

        
        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          placeholderTextColor="#999"
        />

        {isAdm && (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showButton}
            >
              <Text style={{ color: "#007bff" }}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b2a",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  switchRow: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeSwitch: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  switchText: {
    fontSize: 16,
    color: "#999",
  },
  activeText: {
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  showButton: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: "#2979ff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
