import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadTurmas = createAsyncThunk("time/loadTurmas", async () => {
  const json = await AsyncStorage.getItem("turmas");
  return json ? JSON.parse(json) : [];
});

// Helpers de validação
const hasEmoji = (str = "") => {
  // Detecta a maioria dos emojis (Extended_Pictographic); fallback simples para pares surrogates
  try {
    return /[\p{Extended_Pictographic}]/u.test(str);
  } catch {
    return /([\uD800-\uDBFF][\uDC00-\uDFFF])/.test(str);
  }
};

const validateHM = (v) => /^\d{2}:\d{2}$/.test(v);
const toMinutes = (v) => {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
};

// Retorna { ok:boolean, error?:string, sanitized?:object }
const validateTurmaPayload = (turma) => {
  if (!turma || typeof turma !== "object") return { ok: false, error: "Dados de turma inválidos." };

  const { nome, horaInicio, horaFim } = turma;

  if (!nome?.trim()) return { ok: false, error: "Nome da turma obrigatório." };
  if (hasEmoji(nome)) return { ok: false, error: "Nome da turma não pode conter emoji." };

  if (!validateHM(horaInicio) || !validateHM(horaFim))
    return { ok: false, error: "Horários devem estar no formato HH:MM." };

  const ini = toMinutes(horaInicio);
  const fim = toMinutes(horaFim);

  if (fim < ini) return { ok: false, error: "Hora de término não pode ser menor que a de início." };

  return { ok: true, sanitized: { ...turma, nome: nome.trim() } };
};

function computeTimeState(turmas, turmaAtual) {
  if (!turmas.length) {
    return {
      intervaloAtivo: false,
      ticketLiberado: false,
      tempoRestante: 0,
      mensagem: "Nenhuma turma carregada.",
    };
  }
  if (!turmaAtual) {
    return {
      intervaloAtivo: false,
      ticketLiberado: false,
      tempoRestante: 0,
      mensagem: "Nenhuma turma selecionada.",
    };
  }
  const turmaObj = turmas.find(
    (t) => t.nome.trim().toLowerCase() === turmaAtual.trim().toLowerCase()
  );
  if (!turmaObj) {
    return {
      intervaloAtivo: false,
      ticketLiberado: false,
      tempoRestante: 0,
      mensagem: `Turma '${turmaAtual}' não encontrada.`,
    };
  }
  const agora = new Date();
  const [hInicio, mInicio] = turmaObj.inicio.split(":").map(Number);
  const [hFim, mFim] = turmaObj.fim.split(":").map(Number);
  const inicio = new Date(agora); inicio.setHours(hInicio, mInicio, 0, 0);
  const fim = new Date(agora); fim.setHours(hFim, mFim, 0, 0);
  if (fim.getTime() <= inicio.getTime()) fim.setDate(fim.getDate() + 1);
  const pre = new Date(inicio.getTime() - 5 * 60000);
  const now = agora.getTime();
  let intervaloAtivo = false;
  let ticketLiberado = false;
  let tempoRestante = 0;
  let mensagem = "";
  if (now >= inicio.getTime() && now < fim.getTime()) {
    intervaloAtivo = true;
    ticketLiberado = true;
    tempoRestante = Math.max(0, Math.floor((fim.getTime() - now) / 1000));
  } else if (now >= pre.getTime() && now < inicio.getTime()) {
    intervaloAtivo = false;
    ticketLiberado = true;
    tempoRestante = Math.max(0, Math.floor((inicio.getTime() - now) / 1000));
    mensagem = "Ticket liberado (pré-intervalo).";
  } else if (now < pre.getTime()) {
    intervaloAtivo = false;
    ticketLiberado = false;
    tempoRestante = Math.max(0, Math.floor((pre.getTime() - now) / 1000));
    mensagem = "Faltam para a liberação do ticket.";
  } else {
    intervaloAtivo = false;
    ticketLiberado = false;
    tempoRestante = 0;
    mensagem = "Intervalo já acabou.";
  }
  return { intervaloAtivo, ticketLiberado, tempoRestante, mensagem };
}

let loggedTickOnce = false; 

export const tickTime = createAsyncThunk("time/tickTime", async (_, { getState }) => {
  const state = getState();
  if (!loggedTickOnce) {
    console.log('[timeSlice.tickTime] getState keys:', Object.keys(state));
    loggedTickOnce = true;
  }
  const { time } = state;
  return computeTimeState(time.turmas, time.turmaAtual);
});

const initialState = {
  intervaloAtivo: false,
  ticketLiberado: false,
  tempoRestante: 0,
  mensagem: "",
  turmaAtual: null,
  turmas: [],
  loadingTurmas: false,
  turmaErro: null,
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setTurmaAtual(state, action) {
      state.turmaAtual = action.payload;
    },
    clearTurmaErro(state) {
      state.turmaErro = null;
    },
    addTurma(state, action) {
      const { ok, error, sanitized } = validateTurmaPayload(action.payload);
      if (!ok) {
        state.turmaErro = error;
        return;
      }
      state.turmaErro = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTurmas.pending, (s) => { s.loadingTurmas = true; })
      .addCase(loadTurmas.fulfilled, (s, a) => {
        s.loadingTurmas = false;
        s.turmas = a.payload;
      })
      .addCase(loadTurmas.rejected, (s) => { s.loadingTurmas = false; })
      .addCase(tickTime.fulfilled, (s, a) => {
        const { intervaloAtivo, ticketLiberado, tempoRestante, mensagem } = a.payload;
        s.intervaloAtivo = intervaloAtivo;
        s.ticketLiberado = ticketLiberado;
        s.tempoRestante = tempoRestante;
        s.mensagem = mensagem;
      });
  },
});

export const { setTurmaAtual, clearTurmaErro, addTurma } = timeSlice.actions;
export default timeSlice.reducer;
