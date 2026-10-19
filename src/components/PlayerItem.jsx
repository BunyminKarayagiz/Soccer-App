import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FavButton from "./FavButton.jsx";

function PlayerItem({ player }) {
  const { currentUser, emailVerified } = useAuth();
  const [favPlayers, setFavPlayers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser || !emailVerified) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavPlayers(snap.data().favorites?.players || []);
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

    const uid = currentUser.uid;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const currentFavs = data.favorites?.players || [];

    const exists = currentFavs.some((p) => p.id === player.player.id);

    let updated;

    if (exists) {
      // kaldır
      updated = currentFavs.filter((p) => p.id !== player.player.id);
    } else {
      // ekle
      const newFav = {
        id: player.player.id,
        name: player.player.name,
        photo: player.player.photo,
      };

      updated = [...currentFavs, newFav];
    }

    await updateDoc(ref, {
      "favorites.players": updated,
    });

    setFavPlayers(updated);
  };
  const isFav = favPlayers.some((p) => p.id === player.player.id);
  return (
    <div
      onClick={() => {
        navigate(`/player/${player.player.id}`);
      }}
      className="row flex cursor-pointer flex-col gap-3 p-3 transition delay-75 sm:gap-5 sm:p-4"
    >
      <div className="flex items-start gap-2 text-ink sm:gap-3">
        <img
          src={player.player.photo}
          alt=""
          className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] object-contain rounded-[12px] flex-shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="font-semibold text-base sm:text-[20px] truncate">{player.player.name}</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <img
              src={player.team.logo}
              alt=""
              className="h-[15px] w-[15px] sm:h-[20px] sm:w-[20px] object-contain flex-shrink-0"
            />
            <p className="text-xs sm:text-[15px] font-light truncate">{player.team.name}</p>
          </div>
        </div>
        <FavButton
          active={isFav}
          onClick={toggleFav}
          label={`${player.player.name} favorilere ekle`}
          activeLabel={`${player.player.name} favorilerden çıkar`}
          className="flex-shrink-0"
        />
      </div>

      <div className="flex items-center justify-center gap-3 px-2 text-xs font-light text-ink sm:gap-5 sm:px-3 sm:text-base">
        <div className="flex flex-col gap-1 sm:gap-[5px]">
          <p>Season : {player.team.season}</p>
          <p>Age : {player.player.age}</p>
          <p>Rating : {Number(player.stat.rating).toFixed(1)}</p>
        </div>
        <div className="flex flex-col gap-1 sm:gap-[5px]">
          <p>Time : {player.stat.appearances}</p>
          <p>Goals : {player.stat.goals}</p>
          <p>Assists : {player.stat.assists}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerItem;
