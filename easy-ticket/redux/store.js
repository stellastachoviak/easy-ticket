import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import timeReducer from "./timeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    time: timeReducer,
  },
});

// Runtime validation
function isValidReduxStore(obj) {
  return !!obj
    && typeof obj === 'object'
    && typeof obj.getState === 'function'
    && typeof obj.dispatch === 'function'
    && typeof obj.subscribe === 'function';
}

// Detect duplicate module loads (should execute once)
if (global.__EASY_TICKET_STORE__) {
  // eslint-disable-next-line no-console
  console.warn('[store.js] Módulo store carregado novamente (possível caminho duplicado/case diferente).');
} else {
  global.__EASY_TICKET_STORE__ = store;
}

// Detailed diagnostics
// eslint-disable-next-line no-console
console.log('[store.js] configureStore typeof:', typeof configureStore);
// eslint-disable-next-line no-console
console.log('[store.js] store keys:', Object.keys(store || {}));

if (!isValidReduxStore(store)) {
  // eslint-disable-next-line no-console
  console.error('[store.js] Store inválido imediatamente após criação:', store);
}

// Named export (helps avoid accidental incorrect imports)
export { store, isValidReduxStore };
export default store;
