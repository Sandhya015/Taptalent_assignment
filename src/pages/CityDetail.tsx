import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { UpdatedAgo } from "@/components/UpdatedAgo";
import {
  DailyTempChart,
  HourlyTempChart,
  PrecipitationChart,
  WindChart,
} from "@/components/charts/WeatherCharts";
import { useGetCurrentWeatherQuery, useGetForecastQuery } from "@/services/openWeatherApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFavorite, removeFavorite } from "@/store/favoritesSlice";
import type { FavoriteCity, ForecastListItem } from "@/types/weather";
import { aggregateDaily, buildHourlySeries } from "@/utils/aggregateForecast";
import { dewPointCelsius } from "@/utils/dewPoint";
import { cityKey, displayCityName, windDirection } from "@/utils/format";

const POLL_MS = 45_000;

type RangeKey = "24" | "48" | "120";

function sliceForRange(list: ForecastListItem[], range: RangeKey) {
  const n = range === "24" ? 8 : range === "48" ? 16 : list.length;
  return list.slice(0, n);
}

export function CityDetail() {
  const { lat: latStr, lon: lonStr } = useParams();
  const lat = Number(latStr);
  const lon = Number(lonStr);
  const locationState = useLocation().state as { city?: FavoriteCity } | undefined;
  const unit = useAppSelector((s) => s.settings.unit);
  const dispatch = useAppDispatch();
  const [range, setRange] = useState<RangeKey>("24");

  const hasKey = Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY);
  const skipCoords = Number.isNaN(lat) || Number.isNaN(lon);
  const skip = !hasKey || skipCoords;

  const currentQ = useGetCurrentWeatherQuery(
    { lat, lon, units: unit },
    { pollingInterval: POLL_MS, skip }
  );
  const forecastQ = useGetForecastQuery({ lat, lon, units: unit }, { pollingInterval: 120_000, skip });

  const cityFromState = locationState?.city;
  const resolvedCity: FavoriteCity | null = useMemo(() => {
    if (cityFromState && Math.abs(cityFromState.lat - lat) < 1e-4 && Math.abs(cityFromState.lon - lon) < 1e-4) {
      return cityFromState;
    }
    if (currentQ.data) {
      return {
        id: cityKey(lat, lon),
        name: currentQ.data.name,
        country: currentQ.data.sys.country ?? "",
        lat: currentQ.data.coord.lat,
        lon: currentQ.data.coord.lon,
      };
    }
    return null;
  }, [cityFromState, currentQ.data, lat, lon]);

  const favId = resolvedCity?.id ?? cityKey(lat, lon);
  const isFav = useAppSelector((s) => s.favorites.cities.some((c) => c.id === favId));

  const tz = forecastQ.data?.city.timezone ?? currentQ.data?.timezone ?? 0;
  const list = forecastQ.data?.list ?? [];

  const sliced = useMemo(() => sliceForRange(list, range), [list, range]);
  const hourly = useMemo(() => buildHourlySeries(sliced, tz, sliced.length), [sliced, tz]);
  const daily = useMemo(() => aggregateDaily(list, tz), [list, tz]);

  const unitLabel = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";
  const speedUnit = unit === "metric" ? "km" : "mi";

  const dewStr = useMemo(() => {
    if (!currentQ.data) return "—";
    const t = currentQ.data.main.temp;
    const h = currentQ.data.main.humidity;
    const tC = unit === "metric" ? t : ((t - 32) * 5) / 9;
    const dpC = dewPointCelsius(tC, h);
    if (Number.isNaN(dpC)) return "—";
    const display = unit === "metric" ? dpC : (dpC * 9) / 5 + 32;
    return `${display.toFixed(1)}${unitLabel}`;
  }, [currentQ.data, unit, unitLabel]);

  if (!hasKey) {
    return (
      <p className="error-inline">
        Configure your API key to view city details.
      </p>
    );
  }

  if (skipCoords) {
    return <p className="error-inline">Invalid coordinates.</p>;
  }

  const title = resolvedCity ? displayCityName(resolvedCity) : "Loading…";

  return (
    <>
      <Link className="detail-back" to="/">
        ← Back to dashboard
      </Link>

      <div className="detail-hero">
        <div>
          <h1>{title}</h1>
          <p className="detail-hero-sub">
            {currentQ.data?.weather[0]?.description ?? "Forecast & analytics"}
          </p>
          <UpdatedAgo
            fulfilledTimeStamp={currentQ.fulfilledTimeStamp}
            isFetching={currentQ.isFetching}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {currentQ.data && (
            <div className="detail-hero-temp">
              <img
                src={`https://openweathermap.org/img/wn/${currentQ.data.weather[0]?.icon}@2x.png`}
                alt=""
                width={72}
                height={72}
              />
              <span>
                {Math.round(currentQ.data.main.temp)}
                {unitLabel}
              </span>
            </div>
          )}
          <button
            type="button"
            className={`fav-btn ${isFav ? "active" : ""}`}
            style={{ width: "auto", padding: "0 1rem", height: 44 }}
            onClick={() => {
              if (!resolvedCity) return;
              if (isFav) dispatch(removeFavorite(favId));
              else
                dispatch(
                  addFavorite({
                    name: resolvedCity.name,
                    country: resolvedCity.country,
                    state: resolvedCity.state,
                    lat: resolvedCity.lat,
                    lon: resolvedCity.lon,
                  })
                );
            }}
            disabled={!resolvedCity}
          >
            {isFav ? "Remove favorite" : "Add favorite"}
          </button>
        </div>
      </div>

      {currentQ.isLoading && <div className="loading-inline">Loading current conditions…</div>}
      {currentQ.isError && (
        <div className="error-inline">Could not load current weather for this location.</div>
      )}

      {currentQ.data && (
        <div className="stats-grid">
          <div className="stat-tile">
            <p className="stat-tile-label">Pressure</p>
            <p className="stat-tile-value">{currentQ.data.main.pressure} hPa</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">Humidity</p>
            <p className="stat-tile-value">{currentQ.data.main.humidity}%</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">Dew point</p>
            <p className="stat-tile-value">{dewStr}</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">UV index</p>
            <p className="stat-tile-value" title="Not included in OpenWeather free Current Weather API">
              —
            </p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">Wind</p>
            <p className="stat-tile-value">
              {currentQ.data.wind.speed.toFixed(1)} {windUnit}{" "}
              {windDirection(currentQ.data.wind.deg)}
            </p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">Visibility</p>
            <p className="stat-tile-value">
              {currentQ.data.visibility != null
                ? `${(currentQ.data.visibility / (unit === "metric" ? 1000 : 1609)).toFixed(1)} ${speedUnit}`
                : "—"}
            </p>
          </div>
        </div>
      )}

      <div className="range-bar">
        <label htmlFor="range-select">Chart window</label>
        <select
          id="range-select"
          value={range}
          onChange={(e) => setRange(e.target.value as RangeKey)}
        >
          <option value="24">24 hours (3-hour steps)</option>
          <option value="48">48 hours</option>
          <option value="120">5 days (full forecast)</option>
        </select>
      </div>

      {forecastQ.isLoading && <div className="loading-inline">Loading forecast…</div>}
      {forecastQ.isError && (
        <div className="error-inline">Could not load forecast data.</div>
      )}

      {hourly.length > 0 && (
        <>
          <section className="chart-section">
            <h2>Temperature trend</h2>
            <HourlyTempChart data={hourly} unitLabel={unitLabel} />
          </section>
          <section className="chart-section">
            <h2>Precipitation</h2>
            <PrecipitationChart data={hourly} />
          </section>
          <section className="chart-section">
            <h2>Wind</h2>
            <WindChart data={hourly} windUnit={windUnit} />
          </section>
        </>
      )}

      {daily.length > 0 && (
        <section className="chart-section">
          <h2>Daily high / low</h2>
          <DailyTempChart data={daily} unitLabel={unitLabel} />
        </section>
      )}
    </>
  );
}
