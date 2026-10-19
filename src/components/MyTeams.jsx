import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites.js";
import FavButton from "./FavButton.jsx";

function MyTeams({ data }) {
  const { currentUser, emailVerified } = useAuth();
  const [teams, setTeams] = useState(data);
  const navigate = useNavigate();

  const { handleRemove } = useFavorites(currentUser, emailVerified, setTeams, "teams");

  return (
    <section className="card min-w-0 p-4 sm:p-5">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">Favori Takımlar</h2>

      {!teams.length ? (
        <div className="flex min-h-32 items-center justify-center text-center text-base font-medium text-muted sm:text-lg">
          Favori takım yok
        </div>
      ) : (
        <div className="space-y-2">
          {teams.map((t) => (
            <div key={t.id} className="row flex min-w-0 items-center gap-3 p-3">
              <FavButton
                active
                onClick={() => handleRemove(t.id)}
                activeLabel={`${t.name} favorilerden çıkar`}
              />
              <div
                onClick={() => navigate(`/team/${t.id}/2023`)}
                className="flex min-w-0 cursor-pointer items-center gap-3"
              >
                <img
                  src={t.photo}
                  alt=""
                  className="size-10 shrink-0 object-contain"
                />
                <p className="truncate font-medium">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyTeams;
