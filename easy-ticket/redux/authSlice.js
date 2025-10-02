import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadUserFromStorage = createAsyncThunk("auth/loadUser", async () => {
  const stored = await AsyncStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});

export const loginUser = createAsyncThunk("auth/loginUser", async (userData) => {
  await AsyncStorage.setItem("user", JSON.stringify(userData));
  if (userData.type === "aluno") {
    await AsyncStorage.setItem("usuarioLogado", JSON.stringify(userData));
  }
  return userData;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("usuarioLogado");
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true, // was false
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.pending, (s) => { s.isLoading = true; })
      .addCase(loadUserFromStorage.fulfilled, (s, a) => { s.isLoading = false; s.user = a.payload; })
      .addCase(loadUserFromStorage.rejected, (s) => { s.isLoading = false; })
      .addCase(loginUser.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(logoutUser.fulfilled, (s) => { s.user = null; });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
