import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "wa_auth";

export interface AuthState {
  /** Set on successful sign-in; kept exactly as submitted (trimmed once for display safety). */
  email: string;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

function loadAuth(): Pick<AuthState, "email" | "isAuthenticated" | "rememberMe"> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
    if (!raw) return { email: "", isAuthenticated: false, rememberMe: false };
    const p = JSON.parse(raw) as Partial<AuthState>;
    if (typeof p.email !== "string" || typeof p.isAuthenticated !== "boolean") {
      return { email: "", isAuthenticated: false, rememberMe: false };
    }
    return {
      email: p.email,
      isAuthenticated: p.isAuthenticated,
      rememberMe: Boolean(p.rememberMe),
    };
  } catch {
    return { email: "", isAuthenticated: false, rememberMe: false };
  }
}

function persist(state: AuthState) {
  if (!state.isAuthenticated) return;
  const payload = JSON.stringify({
    email: state.email,
    isAuthenticated: state.isAuthenticated,
    rememberMe: state.rememberMe,
  });
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    if (state.rememberMe) localStorage.setItem(STORAGE_KEY, payload);
    else sessionStorage.setItem(STORAGE_KEY, payload);
  } catch {
    /* ignore */
  }
}

function clearPersist() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const loaded = loadAuth();
const initialState: AuthState = {
  email: loaded.email,
  isAuthenticated: loaded.isAuthenticated && loaded.email.length > 0,
  rememberMe: loaded.rememberMe,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(
      state,
      action: PayloadAction<{ email: string; rememberMe: boolean }>
    ) {
      state.email = action.payload.email;
      state.rememberMe = action.payload.rememberMe;
      state.isAuthenticated = true;
      persist(state);
    },
    signOut(state) {
      state.email = "";
      state.isAuthenticated = false;
      state.rememberMe = false;
      clearPersist();
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
