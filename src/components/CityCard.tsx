import type { KeyboardEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentWeatherQuery } from "@/services/openWeatherApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFavorite, removeFavorite } from "@/store/favoritesSlice";
import type { FavoriteCity } from "@/types/weather";
import { displayCityName } from "@/utils/format";
import { UpdatedAgo } from "@/components/UpdatedAgo";

const POLL_MS = 45_000;

export function CityCard({ city }: { city: FavoriteCity }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unit = useAppSelector((s) => s.settings.unit);
  const hasKey = Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY);
  const { data, isLoading, isError, isFetching, fulfilledTimeStamp } = useGetCurrentWeatherQuery(
    { lat: city.lat, lon: city.lon, units: unit },
    { pollingInterval: POLL_MS, skip: !hasKey }
  );

  const isFav = useAppSelector((s) => s.favorites.cities.some((c) => c.id === city.id));

  const onCardActivate = () => {
    navigate(`/city/${city.lat}/${city.lon}`, { state: { city } });
  };

  const onFav = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFav) dispatch(removeFavorite(city.id));
    else
      dispatch(
        addFavorite({
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon,
        })
      );
  };

  const unitLabel = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div
      className="city-card"
      role="link"
      tabIndex={0}
      onClick={onCardActivate}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardActivate();
        }
      }}
    >
      <div className="city-card-header">
        <div>
          <h2 className="city-card-name">{displayCityName(city)}</h2>
          <p className="city-card-meta">Pinned location</p>
        </div>
        <button
          type="button"
          className={`fav-btn ${isFav ? "active" : ""}`}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFav}
          onClick={onFav}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>

      {!hasKey && (
        <p className="city-card-desc" style={{ marginTop: 12 }}>
          Add an API key to load weather for this card.
        </p>
      )}
      {hasKey && isLoading && (
        <>
          <div className="skeleton" style={{ height: 48, marginTop: 12, width: "40%" }} />
          <div className="skeleton" style={{ height: 14, marginTop: 8, width: "60%" }} />
        </>
      )}
      {hasKey && isError && (
        <p className="city-card-desc" style={{ color: "var(--danger)" }}>
          Unable to load weather.
        </p>
      )}
      {hasKey && data && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p className="city-card-temp">
              {Math.round(data.main.temp)}
              {unitLabel}
            </p>
            <img
              className="weather-icon-lg"
              src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@2x.png`}
              alt=""
            />
          </div>
          <p className="city-card-desc">{data.weather[0]?.description}</p>
          <UpdatedAgo fulfilledTimeStamp={fulfilledTimeStamp} isFetching={isFetching} />
          <div className="city-card-stats">
            <span className="city-card-stat">
              Humidity <strong>{data.main.humidity}%</strong>
            </span>
            <span className="city-card-stat">
              Wind <strong>{data.wind.speed.toFixed(1)}</strong> {windUnit}
            </span>
            <span className="city-card-stat">
              Feels <strong>{Math.round(data.main.feels_like)}{unitLabel}</strong>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
