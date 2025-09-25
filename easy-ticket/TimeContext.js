import React, { createContext, useContext, useState, useEffect } from "react";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [turmaAtual, setTurmaAtual] = useState(null);

  const horarios = {
    "Desi-V1": { inicio: "15:00", fim: "15:15" },
    "Desi-V2": { inicio: "15:15", fim: "15:30" },
    "Desi-V3": { inicio: "15:30", fim: "15:45" },
  };

  useEffect(() => {
    function atualizarTempo() {
      if (!turmaAtual) {
        setMensagem("Nenhuma turma selecionada.");
        return;
      }

      const agora = new Date();
      const { inicio, fim } = horarios[turmaAtual];

      const [hInicio, mInicio] = inicio.split(":").map(Number);
      const [hFim, mFim] = fim.split(":").map(Number);

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
  }, [turmaAtual]);

  return (
    <TimeContext.Provider
      value={{ intervaloAtivo, tempoRestante, mensagem, turmaAtual, setTurmaAtual }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  return useContext(TimeContext);
}