import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function PlayerItem({ player }) {
  const { currentUser } = useAuth();
  const [favPlayers, setFavPlayers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavPlayers(snap.data().favorites?.players || []);
      }
    };
    fetchFavs();
  }, [currentUser]);

  const toggleFav = async (e) => {
    e.stopPropagation(); // karta tıklayıp player sayfasına gitmesin

    if (!currentUser) {
      navigate("/login");
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
      className="bg-[#3C096C] rounded-[12px] p-3 sm:p-[15px] hover:bg-[#7B2CBF] transition delay-75 cursor-pointer flex flex-col gap-3 sm:gap-[20px]"
    >
      <div className="flex gap-2 sm:gap-3 text-white items-start">
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
        {isFav ? (
          <IoIosStar
            onClick={toggleFav}
            className="size-6 sm:size-8 text-yellow-400 cursor-pointer flex-shrink-0"
          />
        ) : (
          <IoIosStarOutline
            onClick={toggleFav}
            className="size-6 sm:size-8 text-white cursor-pointer flex-shrink-0"
          />
        )}
      </div>

      <div className="flex text-white px-2 sm:px-[10px] gap-3 sm:gap-[20px] justify-center items-center font-light text-xs sm:text-base">
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
