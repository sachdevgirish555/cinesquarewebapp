import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserAPI } from "../../services/userService";
import {
  clearAdminSessionStorage,
  getAdminSessionExpiry,
  isAdminSessionExpired,
  startAdminSession,
} from "../../utils/adminSession";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserAPI(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const sessionExpired = storedToken ? isAdminSessionExpired() : true;

if (storedToken && sessionExpired) {
  clearAdminSessionStorage();
}

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken && !sessionExpired ? storedToken : null,
  sessionExpiresAt: storedToken && !sessionExpired ? getAdminSessionExpiry() : null,
  loading: false,
  error: null,
  isAuthenticated: Boolean(storedToken && !sessionExpired),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAdminSessionStorage();
      state.user = null;
      state.token = null;
      state.sessionExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    syncSessionState: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const expired = token ? isAdminSessionExpired() : true;

      if (!token || expired) {
        clearAdminSessionStorage();
        state.user = null;
        state.token = null;
        state.sessionExpiresAt = null;
        state.isAuthenticated = false;
        return;
      }

      state.user = user ? JSON.parse(user) : null;
      state.token = token;
      state.sessionExpiresAt = getAdminSessionExpiry();
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const sessionExpiresAt = startAdminSession();

        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiresAt = sessionExpiresAt;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        clearAdminSessionStorage();
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.sessionExpiresAt = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, syncSessionState } = authSlice.actions;
export default authSlice.reducer;
