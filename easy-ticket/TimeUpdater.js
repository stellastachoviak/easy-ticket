import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTurmas, tickTime } from "./redux/timeSlice";
import { loadUserFromStorage } from "./redux/authSlice";

const SAFE_TIME_INITIAL = {
  intervaloAtivo: false,
  ticketLiberado: false,
  tempoRestante: 0,
  mensagem: '',
  turmaAtual: null,
  turmas: [],
  loadingTurmas: false,
};

let loggedRootKeys = false;

export default function TimeUpdater() {
  const dispatch = useDispatch();

  const timeState = useSelector((root) => {
    if (__DEV__ && !loggedRootKeys) {
      // eslint-disable-next-line no-console
      console.log('[TimeUpdater] Root state keys:', Object.keys(root || {}));
      loggedRootKeys = true;
    }
    return root?.time ?? SAFE_TIME_INITIAL;
  });

  const { turmaAtual } = timeState;

  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadTurmas());
  }, [dispatch]);

  useEffect(() => {
    dispatch(tickTime());
    const id = setInterval(() => dispatch(tickTime()), 1000);
    return () => clearInterval(id);
  }, [dispatch, turmaAtual, timeState.turmas]);

  return null;
}
