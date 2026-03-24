import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/authSlice";
import { setUnit } from "@/store/settingsSlice";

export function Header() {
  const unit = useAppSelector((s) => s.settings.unit);
  const email = useAppSelector((s) => s.auth.email);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="brand">
        <h1 className="brand-title">Weather Analytics</h1>
        <p className="brand-tagline">Live conditions, forecasts, and trends</p>
        {email ? (
          <p className="header-user" title={email}>
            Signed in as <strong>{email}</strong>
          </p>
        ) : null}
      </div>
      <div className="header-actions">
        <Link className="nav-link" to="/">
          Dashboard
        </Link>
        <button
          type="button"
          className="header-signout"
          onClick={() => {
            dispatch(signOut());
            navigate("/login", { replace: true });
          }}
        >
          Sign out
        </button>
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
