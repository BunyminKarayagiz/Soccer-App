import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites.js";
import FavButton from "./FavButton.jsx";

function MyLeagues({ data }) {
  const { currentUser, emailVerified } = useAuth();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState(data);
  const { handleRemove } = useFavorites(currentUser, emailVerified, setLeagues, "leagues");

  return (
    <section className="card min-w-0 p-4 sm:p-5">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">Favori Ligler</h2>

      {!leagues.length ? (
        <div className="flex min-h-32 items-center justify-center text-center text-base font-medium text-muted sm:text-lg">
          Favori lig yok
        </div>
      ) : (
        <div className="space-y-2">
          {leagues.map((league) => (
            <div key={league.id} className="row flex min-w-0 items-center gap-3 p-3">
              <FavButton
                active
                onClick={() => handleRemove(league.id)}
                activeLabel={`${league.league_name} favorilerden çıkar`}
              />
              <div
                onClick={() => navigate(`/league/${league.id}/2023`)}
                className="flex min-w-0 cursor-pointer items-center gap-3"
              >
                <img
                  src={league.logo}
                  alt=""
                  className="size-10 shrink-0 object-contain"
                />
                <p className="truncate font-medium">
                  {league.league_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyLeagues;
