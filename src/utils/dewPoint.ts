/** Approximate dew point (°C) from air temperature (°C) and relative humidity (%). */
export function dewPointCelsius(tempC: number, humidityPct: number): number {
  if (humidityPct <= 0 || humidityPct > 100) return NaN;
  const a = 17.625;
  const b = 243.04;
  const alpha = Math.log(humidityPct / 100) + (a * tempC) / (b + tempC);
  return (b * alpha) / (a - alpha);
}
