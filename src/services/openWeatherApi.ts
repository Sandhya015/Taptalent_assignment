import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CurrentWeatherResponse, ForecastResponse, GeocodeResult } from "@/types/weather";

const getKey = () => import.meta.env.VITE_OPENWEATHER_API_KEY ?? "";

export const openWeatherApi = createApi({
  reducerPath: "openWeatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.openweathermap.org" }),
  tagTypes: ["Current", "Forecast"],
  endpoints: (builder) => ({
    searchCities: builder.query<GeocodeResult[], string>({
      query: (q) => ({
        url: "/geo/1.0/direct",
        params: { q, limit: 6, appid: getKey() },
      }),
      keepUnusedDataFor: 120,
    }),
    getCurrentWeather: builder.query<
      CurrentWeatherResponse,
      { lat: number; lon: number; units: "metric" | "imperial" }
    >({
      query: ({ lat, lon, units }) => ({
        url: "/data/2.5/weather",
        params: { lat, lon, units, appid: getKey() },
      }),
      providesTags: (_r, _e, arg) => [
        { type: "Current", id: `${arg.lat.toFixed(4)},${arg.lon.toFixed(4)}` },
      ],
    }),
    getForecast: builder.query<
      ForecastResponse,
      { lat: number; lon: number; units: "metric" | "imperial" }
    >({
      query: ({ lat, lon, units }) => ({
        url: "/data/2.5/forecast",
        params: { lat, lon, units, appid: getKey() },
      }),
      providesTags: (_r, _e, arg) => [
        { type: "Forecast", id: `${arg.lat.toFixed(4)},${arg.lon.toFixed(4)}` },
      ],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useSearchCitiesQuery,
  useLazySearchCitiesQuery,
  useGetCurrentWeatherQuery,
  useGetForecastQuery,
} = openWeatherApi;
