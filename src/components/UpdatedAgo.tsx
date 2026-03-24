import { useEffect, useState } from "react";

const FRESH_MS = 60_000;

function formatAgo(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function UpdatedAgo({
  fulfilledTimeStamp,
  isFetching,
}: {
  fulfilledTimeStamp?: number;
  isFetching: boolean;
}) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 5000);
    return () => window.clearInterval(id);
  }, []);

  if (!fulfilledTimeStamp) return null;
  const age = Date.now() - fulfilledTimeStamp;
  const stale = age > FRESH_MS;
  const cls = ["stale-pill", stale ? "stale" : "", isFetching ? "fetching" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <span className="dot" aria-hidden />
      <span>
        {isFetching ? "Refreshing…" : `Updated ${formatAgo(age)}`}
        {stale && !isFetching ? " · auto-refresh" : ""}
      </span>
    </div>
  );
}
