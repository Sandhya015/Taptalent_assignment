import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { CityCard } from "@/components/CityCard";
import { SearchBar } from "@/components/SearchBar";
import { useAppSelector } from "@/store/hooks";

export function Dashboard() {
  const favorites = useAppSelector((s) => s.favorites.cities);

  return (
    <>
      <ApiKeyBanner />
      <SearchBar />
      <section>
        <h2 className="cards-section-title">Favorite cities</h2>
        {favorites.length === 0 ? (
          <div className="empty-state">
            <h2>No cities yet</h2>
            <p>Search above and pick a city to pin it here. Favorites are saved in this browser.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {favorites.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
