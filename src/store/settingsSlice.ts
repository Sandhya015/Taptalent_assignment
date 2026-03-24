import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TemperatureUnit = "metric" | "imperial";

const STORAGE_KEY = "wa_settings_unit";

function loadUnit(): TemperatureUnit {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "imperial" || v === "metric") return v;
  } catch {
    /* ignore */
  }
  return "metric";
}

function persistUnit(unit: TemperatureUnit) {
  try {
    localStorage.setItem(STORAGE_KEY, unit);
  } catch {
    /* ignore */
  }
}

const initialState: { unit: TemperatureUnit } = {
  unit: loadUnit(),
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUnit(state, action: PayloadAction<TemperatureUnit>) {
      state.unit = action.payload;
      persistUnit(action.payload);
    },
    toggleUnit(state) {
      state.unit = state.unit === "metric" ? "imperial" : "metric";
      persistUnit(state.unit);
    },
  },
});

export const { setUnit, toggleUnit } = settingsSlice.actions;
