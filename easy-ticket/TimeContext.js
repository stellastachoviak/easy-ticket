import React, { createContext, useContext, useState, useEffect } from "react";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [ticketLiberado, setTicketLiberado] = useState(false);
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mensagem, setMensagem] = useState(""); 

  // 🔹 Controle de horário manual (apenas para teste)
  const [usarHorarioManual, setUsarHorarioManual] = useState(false);
  const [horaManual, setHoraManual] = useState(14);
  const [minutoManual, setMinutoManual] = useState(50);
  const [segundoManual, setSegundoManual] = useState(0);

  useEffect(() => {
    function atualizarTempo() {
      let agora;

      if (usarHorarioManual) {
        // Simula horário manual
        agora = new Date();
        agora.setHours(horaManual, minutoManual, segundoManual, 0);
      } else {
        // Hora local do dispositivo
        agora = new Date();
      }

      const diaSemana = agora.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb

      // só funciona de segunda (1) até quinta (4)
      if (diaSemana < 1 || diaSemana > 4) {
        setTicketLiberado(false);
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setMensagem("Hoje não tem intervalo.");
        return;
      }

      // Definir horários fixos
      const inicioTicket = new Date(agora);
      inicioTicket.setHours(14, 55, 0, 0);

      const inicioIntervalo = new Date(agora);
      inicioIntervalo.setHours(15, 0, 0, 0);

      const fim = new Date(agora);
      fim.setHours(15, 15, 0, 0);

      // Ticket liberado: 14:55 - 15:15
      if (agora >= inicioTicket && agora <= fim) {
        setTicketLiberado(true);
      } else {
        setTicketLiberado(false);
      }

      // Intervalo ativo: 15:00 - 15:15
      if (agora >= inicioIntervalo && agora <= fim) {
        setIntervaloAtivo(true);
        setTempoRestante(Math.floor((fim.getTime() - agora.getTime()) / 1000));
        setMensagem("");
      } else if (agora < inicioIntervalo) {
        setIntervaloAtivo(false);
        setTempoRestante(Math.floor((inicioIntervalo.getTime() - agora.getTime()) / 1000));
        setMensagem("Faltam alguns minutos para o intervalo");
      } else {
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setMensagem("Intervalo já acabou.");
      }
    }

    atualizarTempo();
    const timer = setInterval(atualizarTempo, 1000);
    return () => clearInterval(timer);
  }, [usarHorarioManual, horaManual, minutoManual, segundoManual]);

  return (
    <TimeContext.Provider
      value={{
        ticketLiberado,
        intervaloAtivo,
        tempoRestante,
        mensagem,
        usarHorarioManual,
        setUsarHorarioManual,
        setHoraManual,
        setMinutoManual,
        setSegundoManual,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  return useContext(TimeContext);
}
