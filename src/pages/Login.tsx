import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signIn } from "@/store/authSlice";

/** Assessment demo — only this account can sign in (no backend). */
const DEMO_EMAIL = "taptalent@gmail.com";
const DEMO_PASSWORD = "Weather@1234";

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const alreadyIn = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (alreadyIn) navigate(from, { replace: true });
  }, [alreadyIn, from, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your work email.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    const emailOk = trimmedEmail.toLowerCase() === DEMO_EMAIL.toLowerCase();
    const passOk = password === DEMO_PASSWORD;
    if (!emailOk || !passOk) {
      setError("Invalid email or password.");
      return;
    }
    dispatch(
      signIn({
        email: DEMO_EMAIL,
        rememberMe,
      })
    );
    setPassword("");
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-split">
        <aside className="login-brand" aria-hidden={false}>
          <div className="login-brand-inner">
            <div className="login-brand-logo">
              <span className="login-brand-mark">WA</span>
              <span className="login-brand-name">Weather Analytics</span>
            </div>
            <h1 className="login-brand-headline">
              Understand your climate with <em>clarity</em>
            </h1>
            <p className="login-brand-lead">
              A unified view for live conditions, multi-city dashboards, forecasts, and historical
              trends — built for teams who care about the weather.
            </p>
            <ul className="login-brand-features">
              <li>
                <span className="login-brand-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                Real-time conditions with short refresh windows for pinned cities
              </li>
              <li>
                <span className="login-brand-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19h16M7 16V9M12 16V5M17 16v-5" />
                  </svg>
                </span>
                Interactive charts for temperature, precipitation, and wind patterns
              </li>
              <li>
                <span className="login-brand-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 4v4M16 4v4" />
                  </svg>
                </span>
                Seven-day outlook plus hour-by-hour steps from forecast APIs
              </li>
              <li>
                <span className="login-brand-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18M7 16l4-4 4 4 6-7" />
                  </svg>
                </span>
                Favorites and unit preferences synced in your browser session
              </li>
            </ul>
            <p className="login-brand-footer">© {new Date().getFullYear()} Weather Analytics. Demo sign-in.</p>
          </div>
        </aside>

        <main className="login-main">
          <div className="login-card">
            <p className="login-kicker">Welcome back</p>
            <h2 className="login-title">Sign in to your account</h2>
            <p className="login-subtitle">Enter your credentials to open the weather dashboard.</p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}
              <label className="login-label" htmlFor="login-email">
                Work email
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" opacity="0" />
                    <path d="M4 6h16v12H4z M4 8l8 5 8-5" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <label className="login-label" htmlFor="login-password">
                Password
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  className="login-input login-input-pad-right"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="login-row">
                <label className="login-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                <button type="button" className="login-link-btn" onClick={() => setError("Demo only — use any password.")}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-submit">
                Sign in
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="login-divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="login-google" disabled title="Not configured for this demo">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>

            <div className="login-badges" aria-label="Security notes">
              <span>Demo build</span>
              <span>·</span>
              <span>Password not saved after sign-in</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
