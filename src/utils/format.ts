import type { FavoriteCity } from "@/types/weather";

export function cityKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

export function displayCityName(c: Pick<FavoriteCity, "name" | "country" | "state">): string {
  const parts = [c.name];
  if (c.state) parts.push(c.state);
  parts.push(c.country);
  return parts.join(", ");
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}

export function formatTime(ts: number, timezoneOffsetSec: number): string {
  const utc = ts * 1000 + timezoneOffsetSec * 1000;
  return new Date(utc).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(ts: number, timezoneOffsetSec: number): string {
  const utc = ts * 1000 + timezoneOffsetSec * 1000;
  return new Date(utc).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
