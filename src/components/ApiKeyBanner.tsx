const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

export function ApiKeyBanner() {
  if (key && key.length > 0) return null;
  return (
    <div className="api-banner" role="status">
      Add <code style={{ fontFamily: "var(--font-mono)" }}>VITE_OPENWEATHER_API_KEY</code> to a{" "}
      <code style={{ fontFamily: "var(--font-mono)" }}>.env</code> file in the project root, then
      restart the dev server. Get a free key at{" "}
      <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">
        openweathermap.org
      </a>
      .
    </div>
  );
}
