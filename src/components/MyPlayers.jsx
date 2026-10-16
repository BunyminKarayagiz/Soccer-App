import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites.js";
import FavButton from "./FavButton.jsx";

function MyPlayers({ data }) {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState(data);
  const navigate = useNavigate();

  const { handleRemove } = useFavorites(currentUser, setPlayers, "players");

  return (
    <section className="card min-w-0 p-4 sm:p-5">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">Favori Oyuncular</h2>
      {!players.length ? (
        <div className="flex min-h-32 items-center justify-center text-center text-base font-medium text-muted sm:text-lg">
          Favori oyuncu yok
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((p) => (
            <div key={p.id} className="row flex min-w-0 items-center gap-3 p-3">
              <FavButton
                active
                onClick={() => handleRemove(p.id)}
                activeLabel={`${p.name} favorilerden çıkar`}
              />
              <div
                onClick={() => navigate(`/player/${p.id}`)}
                className="flex min-w-0 cursor-pointer items-center gap-3"
              >
                <img
                  src={p.photo}
                  alt=""
                  className="size-10 shrink-0 object-contain"
                />
                <p className="truncate font-medium">{p.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyPlayers;
