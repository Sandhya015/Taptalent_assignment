import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUnit } from "@/store/settingsSlice";

export function Header() {
  const unit = useAppSelector((s) => s.settings.unit);
  const dispatch = useAppDispatch();

  return (
    <header className="site-header">
      <div className="brand">
        <h1 className="brand-title">Weather Analytics</h1>
        <p className="brand-tagline">Live conditions, forecasts, and trends</p>
      </div>
      <div className="header-actions">
        <Link className="nav-link" to="/">
          Dashboard
        </Link>
        <div className="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={unit === "metric" ? "active" : ""}
            onClick={() => dispatch(setUnit("metric"))}
          >
            °C
          </button>
          <button
            type="button"
            className={unit === "imperial" ? "active" : ""}
            onClick={() => dispatch(setUnit("imperial"))}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
