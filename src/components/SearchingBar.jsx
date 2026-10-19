import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

function SearchingBar({ type = "league" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const labels = {
    leagues: { title: "Lig ara", placeholder: "Lig adı yaz..." },
    teams: { title: "Takım ara", placeholder: "Takım adı yaz..." },
    players: { title: "Oyuncu ara", placeholder: "Oyuncu adı yaz..." },
  };
  const label = labels[type] || labels.leagues;

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let url = "";
        if (type === "leagues" || type === "teams") {
          url = `https://v3.football.api-sports.io/${type}?search=${query}`;
        }
        if (type === "players") {
          url = `https://v3.football.api-sports.io/${type}/profiles?search=${query}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-apisports-key": import.meta.env.VITE_APIKEY_APIFOOTBALL,
          },
        });

        const data = await res.json();
        setResults(data.response.slice(0, 10));
      } catch (err) {
        console.log("search hata:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchData();
    }, 500); // 500ms debounce

    return () => clearTimeout(delay);
  }, [query, type]);

  // 🔥 seçilince
  const handleSelect = (item) => {
    if (type === "leagues") {
      navigate(`/league/${item.league.id}/2023`);
    }

    if (type === "teams") {
      navigate(`/team/${item.team.id}/2023`);
    }

    if (type === "players") {
      navigate(`/player/${item.player.id}`);
    }

    setQuery("");
    setResults([]);
  };

  return (
    <section className="card relative z-20 w-full p-3 sm:p-4">
      <div className="mb-3">
        <h2 className="text-base font-bold sm:text-lg">{label.title}</h2>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          En az 3 karakter yazarak aramayı başlat.
        </p>
      </div>
      <label className="flex min-w-0 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <IoSearchOutline className="size-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          type="search"
          aria-label={label.title}
          placeholder={label.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="auth-field h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:text-base"
        />
        {loading && (
          <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Aranıyor" />
        )}
      </label>

      {results.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-72 overflow-auto rounded-xl border border-line bg-surface p-1 shadow-2xl">
          {results.map((item, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleSelect(item)}
              className="flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {type === "leagues" && (
                <>
                  <img
                    src={item.league.logo}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    alt=""
                  />
                  <span className="truncate text-sm sm:text-base">{item.league.name}</span>
                </>
              )}

              {/* TEAM */}
              {type === "teams" && (
                <>
                  <img
                    src={item.team.logo}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    alt=""
                  />
                  <span className="truncate text-sm sm:text-base">{item.team.name}</span>
                </>
              )}

              {/* PLAYER */}
              {type === "players" && (
                <>
                  <img
                    src={item.player.photo}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                    alt=""
                  />
                  <span className="truncate text-sm sm:text-base">{item.player.name}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchingBar;
