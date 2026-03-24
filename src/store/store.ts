import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { openWeatherApi } from "@/services/openWeatherApi";
import { favoritesSlice } from "@/store/favoritesSlice";
import { settingsSlice } from "@/store/settingsSlice";

export const store = configureStore({
  reducer: {
    [openWeatherApi.reducerPath]: openWeatherApi.reducer,
    favorites: favoritesSlice.reducer,
    settings: settingsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(openWeatherApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
