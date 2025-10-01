import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [turmaAtual, setTurmaAtual] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [ticketLiberado, setTicketLiberado] = useState(false); // nova flag

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const json = await AsyncStorage.getItem("turmas");
        if (json) {
          const lista = JSON.parse(json);
          setTurmas(lista);
          console.log("Turmas carregadas:", lista);
        } else {
          console.log("Nenhuma turma encontrada no AsyncStorage.");
          setTurmas([]);
        }
      } catch (e) {
        console.error("Erro ao carregar turmas:", e);
        setTurmas([]);
      }
    };

    carregarTurmas();
  }, []);

  useEffect(() => {
    function atualizarTempo() {
      if (!turmas.length) {
        setMensagem("Nenhuma turma carregada.");
        return;
      }
      if (!turmaAtual) {
        setMensagem("Nenhuma turma selecionada.");
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setTicketLiberado(false);
        return;
      }

      const turmaObj = turmas.find(
        (t) => t.nome.trim().toLowerCase() === turmaAtual.trim().toLowerCase()
      );

      if (!turmaObj) {
        setMensagem(`Turma '${turmaAtual}' não encontrada.`);
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setTicketLiberado(false);
        return;
      }

      const agora = new Date();

      const [hInicio, mInicio] = turmaObj.inicio.split(":").map(Number);
      const [hFim, mFim] = turmaObj.fim.split(":").map(Number);

      const inicioIntervalo = new Date(agora);
      inicioIntervalo.setHours(hInicio, mInicio, 0, 0);

      let fimIntervalo = new Date(agora);
      fimIntervalo.setHours(hFim, mFim, 0, 0);

      // Caso o horário de fim seja no dia seguinte (ex: 22:00 -> 00:10)
      if (fimIntervalo.getTime() <= inicioIntervalo.getTime()) {
        fimIntervalo.setDate(fimIntervalo.getDate() + 1);
      }

      const preInicioIntervalo = new Date(inicioIntervalo.getTime() - 5 * 60000);

      const nowMs = agora.getTime();
      const preMs = preInicioIntervalo.getTime();
      const inicioMs = inicioIntervalo.getTime();
      const fimMs = fimIntervalo.getTime();

      // Reset base
      let novaMensagem = "";
      let liberado = false;
      let ativo = false;
      let restanteSeg = 0;

      if (nowMs >= inicioMs && nowMs < fimMs) {
        ativo = true;
        liberado = true;
        restanteSeg = Math.max(0, Math.floor((fimMs - nowMs) / 1000));
      } else if (nowMs >= preMs && nowMs < inicioMs) {
        ativo = false;
        liberado = true;
        restanteSeg = Math.max(0, Math.floor((inicioMs - nowMs) / 1000));
        novaMensagem = "Ticket liberado (pré-intervalo).";
      } else if (nowMs < preMs) {
        ativo = false;
        liberado = false;
        restanteSeg = Math.max(0, Math.floor((preMs - nowMs) / 1000));
        novaMensagem = "Faltam para a liberação do ticket.";
      } else {
        // nowMs >= fimMs
        ativo = false;
        liberado = false;
        restanteSeg = 0;
        novaMensagem = "Intervalo já acabou.";
      }

      setIntervaloAtivo(ativo);
      setTicketLiberado(liberado);
      setTempoRestante(restanteSeg);
      setMensagem(novaMensagem);
    }

    atualizarTempo();
    const timer = setInterval(atualizarTempo, 1000);
    return () => clearInterval(timer);
  }, [turmaAtual, turmas]);

  return (
    <TimeContext.Provider
      value={{
        intervaloAtivo,
        ticketLiberado, // exposto
        tempoRestante,
        mensagem,
        turmaAtual,
        setTurmaAtual,
        turmas,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  return useContext(TimeContext);
}
