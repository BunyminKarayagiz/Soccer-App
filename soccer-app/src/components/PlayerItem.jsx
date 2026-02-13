import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
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
      className="bg-[#3C096C] rounded-[12px] p-[15px] hover:bg-[#7B2CBF] transition delay-75 cursor-pointer flex flex-col gap-[20px]"
    >
      <div className="flex gap-3 text-white">
        <img
          src={player.player.photo}
          alt=""
          className="h-[50px] w-[50px] object-contain rounded-[12px]"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-[20px]">{player.player.name}</p>
          <div className="flex items-center gap-2">
            <img
              src={player.team.logo}
              alt=""
              className="h-[20px] w-[20px] object-contain"
            />
            <p className="text-[15px] font-light">{player.team.name}</p>
          </div>
        </div>
        {isFav ? (
          <IoIosStar
            onClick={toggleFav}
            className="size-8 ml-[15px] text-yellow-400 cursor-pointer"
          />
        ) : (
          <IoIosStarOutline
            onClick={toggleFav}
            className="size-8 ml-[15px] text-white cursor-pointer"
          />
        )}
      </div>

      <div className="flex text-white px-[10px] gap-[20px] justify-center items-center font-light">
        <div className="flex flex-col gap-[5px]">
          <p>Season : {player.statistics.goal}</p>
          <p>Age : {player.statistics.goal}</p>
          <p>Rating : {player.statistics.goal}</p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <p>Time : {player.statistics.goal}</p>
          <p>Goals : {player.statistics.goal}</p>
          <p>Assists : {player.statistics.goal}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerItem;
