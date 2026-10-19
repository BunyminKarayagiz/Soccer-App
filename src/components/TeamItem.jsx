import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FavButton from "./FavButton.jsx";

function TeamItem({ team }) {
  const { currentUser, emailVerified } = useAuth();
  const [favTeams, setFavTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser || !emailVerified) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavTeams(snap.data().favorites?.teams || []);
      }
    };
    fetchFavs();
  }, [currentUser, emailVerified]);

  const toggleFav = async (e) => {
    e.stopPropagation(); // karta tıklayıp player sayfasına gitmesin

    if (!currentUser || !emailVerified) {
      navigate(currentUser ? "/verify-email" : "/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const currentFavs = data.favorites?.teams || [];

    const exists = currentFavs.some((p) => p.id === team.teams.id);

    let updated;

    if (exists) {
      // kaldır
      updated = currentFavs.filter((p) => p.id !== team.teams.id);
    } else {
      // ekle
      const newFav = {
        id: team.teams.id,
        name: team.teams.name,
        photo: team.teams.logo,
      };

      updated = [...currentFavs, newFav];
    }

    await updateDoc(ref, {
      "favorites.teams": updated,
    });

    setFavTeams(updated);
  };

  const isFav = favTeams.some((p) => p.id === team.teams.id);

  return (
    <article
      onClick={() => {
        navigate(`/team/${team.teams.id}/2023`);
      }}
      className="row relative flex min-h-36 min-w-0 cursor-pointer flex-col items-center justify-center px-2 pb-3 pt-5 sm:min-h-40 sm:px-3"
    >
      <FavButton
        active={isFav}
        onClick={toggleFav}
        label={`${team.teams.name} favorilere ekle`}
        activeLabel={`${team.teams.name} favorilerden çıkar`}
        className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3"
      />
      <div className="flex w-full min-w-0 flex-col items-center justify-center gap-2 sm:gap-3">
        <img
          src={team.teams.logo}
          alt={team.teams.name}
          className="size-16 shrink-0 object-contain sm:size-20 xl:size-24"
        />
        <div className="flex w-full min-w-0 items-center justify-center gap-2">
          <img
            src={team.teams.flag}
            alt=""
            className="size-5 shrink-0 object-contain"
          />
          <p className="min-w-0 truncate text-center text-sm font-medium text-ink sm:text-base">
            {team.teams.name}
          </p>
        </div>
      </div>
    </article>
  );
}

export default TeamItem;
