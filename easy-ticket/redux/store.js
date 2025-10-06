import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import timeReducer from "./timeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    time: timeReducer,
  },
});

function isValidReduxStore(obj) {
  return !!obj
    && typeof obj === 'object'
    && typeof obj.getState === 'function'
    && typeof obj.dispatch === 'function'
    && typeof obj.subscribe === 'function';
}

if (global.__EASY_TICKET_STORE__) {

  console.warn('[store.js] Módulo store carregado novamente (possível caminho duplicado/case diferente).');
} else {
  global.__EASY_TICKET_STORE__ = store;
}

console.log('[store.js] configureStore typeof:', typeof configureStore);

console.log('[store.js] store keys:', Object.keys(store || {}));

if (!isValidReduxStore(store)) {

  console.error('[store.js] Store inválido imediatamente após criação:', store);
}


export { store, isValidReduxStore };
export default store;
