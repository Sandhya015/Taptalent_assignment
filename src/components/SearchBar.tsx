import { useCallback, useEffect, useRef, useState } from "react";
import { useLazySearchCitiesQuery } from "@/services/openWeatherApi";
import { useAppDispatch } from "@/store/hooks";
import { addFavorite } from "@/store/favoritesSlice";
import { displayCityName } from "@/utils/format";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [search, result] = useLazySearchCitiesQuery();

  useEffect(() => {
    const t = window.setTimeout(() => {
      const trimmed = q.trim();
      if (trimmed.length >= 2) {
        void search(trimmed);
        setOpen(true);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [q, search]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const addCity = useCallback(
    (c: { name: string; country: string; state?: string; lat: number; lon: number }) => {
      dispatch(
        addFavorite({
          name: c.name,
          country: c.country,
          state: c.state,
          lat: c.lat,
          lon: c.lon,
        })
      );
      setQ("");
      setOpen(false);
    },
    [dispatch]
  );

  const data = result.data;
  const showList = open && q.trim().length >= 2 && (data?.length || result.isFetching || result.isError);

  return (
    <div className="search-wrap" ref={wrapRef}>
      <span className="search-icon" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        className="search-input"
        type="search"
        placeholder="Search city (autocomplete)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => {
          if (q.trim().length >= 2) setOpen(true);
        }}
        aria-autocomplete="list"
        aria-expanded={showList ? true : false}
        autoComplete="off"
      />
      {showList && (
        <ul className="search-dropdown" role="listbox">
          {result.isFetching && (
            <li className="loading-inline" style={{ listStyle: "none" }}>
              Searching…
            </li>
          )}
          {result.isError && (
            <li className="error-inline" style={{ listStyle: "none" }}>
              Could not reach the API. Check your key and network.
            </li>
          )}
          {!result.isFetching &&
            data?.map((c) => (
              <li key={`${c.lat},${c.lon}`} style={{ listStyle: "none" }}>
                <button
                  type="button"
                  className="search-item"
                  onClick={() => addCity(c)}
                  role="option"
                >
                  <span>{displayCityName(c)}</span>
                  <span className="search-item-country">{c.country}</span>
                </button>
              </li>
            ))}
          {!result.isFetching && data?.length === 0 && (
            <li className="loading-inline" style={{ listStyle: "none" }}>
              No cities found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
