import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [turmaAtual, setTurmaAtual] = useState(null);
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    const carregarTurmas = async () => {
      const json = await AsyncStorage.getItem("turmas");
      if (json) setTurmas(JSON.parse(json));
    };
    carregarTurmas();
  }, []);

  useEffect(() => {
    function atualizarTempo() {
      if (!turmaAtual) {
        setMensagem("Nenhuma turma selecionada.");
        setIntervaloAtivo(false);
        setTempoRestante(0);
        return;
      }

      const turmaObj = turmas.find((t) => t.nome === turmaAtual);
      if (!turmaObj) {
        setMensagem("Turma não encontrada.");
        setIntervaloAtivo(false);
        setTempoRestante(0);
        return;
      }

      const agora = new Date();
      const [hInicio, mInicio] = turmaObj.inicio.split(":").map(Number);
      const [hFim, mFim] = turmaObj.fim.split(":").map(Number);

      const inicioIntervalo = new Date(agora);
      inicioIntervalo.setHours(hInicio, mInicio, 0, 0);

      const fimIntervalo = new Date(agora);
      fimIntervalo.setHours(hFim, mFim, 0, 0);

      if (agora >= inicioIntervalo && agora <= fimIntervalo) {
        setIntervaloAtivo(true);
        setTempoRestante(Math.floor((fimIntervalo - agora) / 1000));
        setMensagem("");
      } else if (agora < inicioIntervalo) {
        setIntervaloAtivo(false);
        setTempoRestante(Math.floor((inicioIntervalo - agora) / 1000));
        setMensagem("Faltam para o intervalo");
      } else {
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setMensagem("Intervalo já acabou.");
      }
    }

    atualizarTempo();
    const timer = setInterval(atualizarTempo, 1000);
    return () => clearInterval(timer);
  }, [turmaAtual, turmas]);

  return (
    <TimeContext.Provider
      value={{ intervaloAtivo, tempoRestante, mensagem, turmaAtual, setTurmaAtual, turmas }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  return useContext(TimeContext);
}
