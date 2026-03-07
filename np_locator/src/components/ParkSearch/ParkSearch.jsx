import "./ParkSearch.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export function ParkSearch({ parks, park, getLandscapeImage }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return parks
      .filter((p) => (p.fullName || "").toLowerCase().includes(q))
      .slice(0, 5);
  }, [parks, query]);

  return (
    <div className="park-search__container">
      <input
        className="park-search__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="       Search a park…"
      />

      {suggestions.length > 0 && (
        <div className="park-search__suggestions">
          {suggestions.map((p) => (
            <button
              className="park-search__btn"
              key={p.parkCode}
              type="button"
              onClick={() => {
                navigate(`/park/${p.parkCode}`);
                setQuery("");
              }}
            >
              {p.fullName}
              <img className="park-search__img" src={getLandscapeImage(p)} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
