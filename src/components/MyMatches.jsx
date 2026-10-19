import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites.js";
import FavButton from "./FavButton.jsx";

function MyMatches({ data }) {
  const { currentUser, emailVerified } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState(data);
  const { handleRemove } = useFavorites(
    currentUser,
    emailVerified,
    setMatches,
    "matches",
    "fixture_id",
  );

  return (
    <section className="card min-w-0 p-4 sm:p-5">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">Favori Maçlar</h2>

      {!matches.length ? (
        <div className="flex min-h-32 items-center justify-center text-center text-base font-medium text-muted sm:text-lg">
          Favori maç yok
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <div key={match.fixture_id} className="row flex min-w-0 items-center gap-2 p-2 sm:gap-3 sm:p-3">
              <FavButton
                active
                onClick={() => handleRemove(match.fixture_id)}
                activeLabel="Maçı favorilerden çıkar"
              />
              <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center text-sm font-medium sm:gap-3 sm:text-base">
                <button
                  type="button"
                  onClick={() => navigate(`/team/${match.home_team.id}/2023`)}
                  className="flex min-w-0 items-center justify-end gap-1.5 hover:text-accent sm:gap-2"
                >
                <img
                  src={match.home_team.logo}
                    alt=""
                    className="size-5 shrink-0 object-contain sm:size-6"
                />
                  <span className="truncate">{match.home_team.name}</span>
                </button>
                <span className="text-muted">-</span>
                <button
                  type="button"
                  onClick={() => navigate(`/team/${match.away_team.id}/2023`)}
                  className="flex min-w-0 items-center gap-1.5 hover:text-accent sm:gap-2"
                >
                  <span className="truncate">{match.away_team.name}</span>
                <img
                  src={match.away_team.logo}
                    alt=""
                    className="size-5 shrink-0 object-contain sm:size-6"
                />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyMatches;
