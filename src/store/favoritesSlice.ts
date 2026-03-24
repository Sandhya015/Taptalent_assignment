import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteCity } from "@/types/weather";
import { cityKey } from "@/utils/format";

const STORAGE_KEY = "wa_favorites";

function loadFavorites(): FavoriteCity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is FavoriteCity =>
        x &&
        typeof x === "object" &&
        typeof (x as FavoriteCity).id === "string" &&
        typeof (x as FavoriteCity).name === "string" &&
        typeof (x as FavoriteCity).lat === "number" &&
        typeof (x as FavoriteCity).lon === "number"
    );
  } catch {
    return [];
  }
}

function persistFavorites(cities: FavoriteCity[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    /* ignore */
  }
}

const initialState: { cities: FavoriteCity[] } = {
  cities: loadFavorites(),
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Omit<FavoriteCity, "id"> & { id?: string }>) {
      const { id, ...rest } = action.payload;
      const key = id ?? cityKey(rest.lat, rest.lon);
      if (state.cities.some((c) => c.id === key)) return;
      state.cities.unshift({ ...rest, id: key });
      persistFavorites(state.cities);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter((c) => c.id !== action.payload);
      persistFavorites(state.cities);
    },
    reorderFavorites(state, action: PayloadAction<FavoriteCity[]>) {
      state.cities = action.payload;
      persistFavorites(state.cities);
    },
  },
});

export const { addFavorite, removeFavorite, reorderFavorites } = favoritesSlice.actions;
