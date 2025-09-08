import React, { createContext, useContext, useState, useEffect } from "react";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [ticketLiberado, setTicketLiberado] = useState(false);
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mensagem, setMensagem] = useState(""); 

  // 🔹 Controle de horário manual
  const [usarHorarioManual, setUsarHorarioManual] = useState(false);
  const [horaManual, setHoraManual] = useState(14);
  const [minutoManual, setMinutoManual] = useState(50);
  const [segundoManual, setSegundoManual] = useState(0);

  useEffect(() => {
    function atualizarTempo() {
      let agoraBRT;

      if (usarHorarioManual) {
        // Simula horário manual em BRT
        agoraBRT = new Date();
        agoraBRT.setHours(horaManual, minutoManual, segundoManual, 0);
      } else {
        // Hora real BRT (UTC-3)
        const agoraUTC = new Date();
        agoraBRT = new Date(agoraUTC.getTime() - 3 * 60 * 60 * 1000);
      }

      const diaSemana = agoraBRT.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb

      // só funciona de segunda (1) até quinta (4)
      if (diaSemana < 1 || diaSemana > 4) {
        setTicketLiberado(false);
        setIntervaloAtivo(false);
        setTempoRestante(0);
        setMensagem("Hoje não tem intervalo.");
        return;
      }

      // Definir horários fixos em BRT
      const inicioTicket = new Date(agoraBRT);
      inicioTicket.setHours(14, 55, 0, 0);

      const inicioIntervalo = new Date(agoraBRT);
      inicioIntervalo.setHours(15, 0, 0, 0);

      const fim = new Date(agoraBRT);
      fim.setHours(15, 15, 0, 0);

      // Ticket: 14:55 - 15:15
      if (agoraBRT >= inicioTicket && agoraBRT <= fim) {
        setTicketLiberado(true);
      } else {
        setTicketLiberado(false);
      }

      // Intervalo: 15:00 - 15:15
      if (agoraBRT >= inicioIntervalo && agoraBRT <= fim) {
        setIntervaloAtivo(true);
        setTempoRestante(Math.floor((fim.getTime() - agoraBRT.getTime()) / 1000));
        setMensagem("");
      } else if (agoraBRT < inicioIntervalo) {
        setIntervaloAtivo(false);
        setTempoRestante(Math.floor((inicioIntervalo.getTime() - agoraBRT.getTime()) / 1000));
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
