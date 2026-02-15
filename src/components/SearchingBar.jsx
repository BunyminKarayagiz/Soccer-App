import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchingBar({ type = "league" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 debounce timer
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    console.log(type);

    const delay = setTimeout(() => {
      fetchData();
    }, 500); // 500ms debounce

    return ()  => clearTimeout(delay);
  }, [query, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = "";
      if (type === "leagues") {
        url = `https://v3.football.api-sports.io/${type}?search=${query}`;
      }
      if (type === "teams") {
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
      console.log(data);
      const leagues = data.response.slice(0, 10);

      setResults(leagues);
    } catch (err) {
      console.log("search hata:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="relative w-full">
      <input
        type="text"
        placeholder={`${type} ara...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#240046] text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl outline-none border border-purple-600"
      />

      {results.length > 0 && (
        <div className="absolute w-full bg-[#240046] mt-2 rounded-xl shadow-lg z-50 max-h-[250px] sm:max-h-[300px] overflow-auto">
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-purple-700 cursor-pointer text-white border-b border-white/10 flex items-center gap-2"
            >
              {type === "leagues" && (
                <>
                  <img
                    src={item.league.logo}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    alt=""
                  />
                  <span className="text-sm sm:text-base">{item.league.name}</span>
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
                  <span className="text-sm sm:text-base">{item.team.name}</span>
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
                  <span className="text-sm sm:text-base">{item.player.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchingBar;
