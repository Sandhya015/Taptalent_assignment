import type { ForecastListItem } from "@/types/weather";

/** OWM-style: interpret (dt + tz) as shifted UTC for local calendar components. */
function localDateKey(dt: number, timezoneSec: number): string {
  const d = new Date((dt + timezoneSec) * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface DailyAgg {
  dateKey: string;
  label: string;
  tempMin: number;
  tempMax: number;
  precipChance: number;
  rainMm: number;
  windAvg: number;
  windDegAvg: number;
}

export interface HourlyPoint {
  dt: number;
  label: string;
  temp: number;
  pop: number;
  rainMm: number;
  wind: number;
  windDeg: number;
}

export function buildHourlySeries(
  list: ForecastListItem[],
  timezoneSec: number,
  maxPoints: number
): HourlyPoint[] {
  return list.slice(0, maxPoints).map((item) => {
    const d = new Date((item.dt + timezoneSec) * 1000);
    const label = `${String(d.getUTCHours()).padStart(2, "0")}:00`;
    const rain =
      (item.rain?.["3h"] ?? 0) + (item.snow?.["3h"] ?? 0);
    return {
      dt: item.dt,
      label,
      temp: item.main.temp,
      pop: item.pop,
      rainMm: rain,
      wind: item.wind.speed,
      windDeg: item.wind.deg,
    };
  });
}

export function aggregateDaily(
  list: ForecastListItem[],
  timezoneSec: number
): DailyAgg[] {
  const map = new Map<
    string,
    {
      temps: number[];
      pops: number[];
      rain: number;
      winds: number[];
      degs: number[];
    }
  >();

  for (const item of list) {
    const key = localDateKey(item.dt, timezoneSec);
    const bucket = map.get(key) ?? {
      temps: [],
      pops: [],
      rain: 0,
      winds: [],
      degs: [],
    };
    bucket.temps.push(item.main.temp, item.main.temp_min, item.main.temp_max);
    bucket.pops.push(item.pop);
    bucket.rain += item.rain?.["3h"] ?? 0;
    bucket.rain += item.snow?.["3h"] ?? 0;
    bucket.winds.push(item.wind.speed);
    bucket.degs.push(item.wind.deg);
    map.set(key, bucket);
  }

  const keys = [...map.keys()].sort();
  return keys.map((dateKey) => {
    const b = map.get(dateKey)!;
    const temps = b.temps;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < b.degs.length; i++) {
      const rad = (b.degs[i] * Math.PI) / 180;
      sx += Math.sin(rad) * b.winds[i];
      sy += Math.cos(rad) * b.winds[i];
    }
    let windDegAvg = (Math.atan2(sx, sy) * 180) / Math.PI;
    if (windDegAvg < 0) windDegAvg += 360;

    const d = new Date(`${dateKey}T12:00:00Z`);
    const label = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

    return {
      dateKey,
      label,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      precipChance: b.pops.reduce((a, c) => a + c, 0) / b.pops.length,
      rainMm: Math.round(b.rain * 10) / 10,
      windAvg: b.winds.reduce((a, c) => a + c, 0) / b.winds.length,
      windDegAvg: windDegAvg,
    };
  });
}
