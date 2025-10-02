// DEPRECATED: substituído por Redux (timeSlice). Provider removido.
// Qualquer uso de <TimeProvider> deve ser eliminado do App.js.
import { useSelector, useDispatch } from "react-redux";
import { setTurmaAtual } from "./redux/timeSlice";

// Hook de compatibilidade para código antigo.
export function useTime() {
  const state = useSelector(s => s.time);
  const dispatch = useDispatch();
  return {
    ...state,
    setTurmaAtual: (t) => dispatch(setTurmaAtual(t)),
  };
}
