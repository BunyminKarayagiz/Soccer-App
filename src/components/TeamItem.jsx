import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function TeamItem({ team }) {
  const { currentUser } = useAuth();
  const [favTeams, setFavTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavs = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFavTeams(snap.data().favorites?.teams || []);
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
    <div
      onClick={() => {
        navigate(`/team/${team.teams.id}/2023`);
      }}
      className="bg-[#3C096C] rounded-[12px] p-[20px] hover:bg-[#7B2CBF] transition delay-75 cursor-pointer flex"
    >
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
      <div className="flex flex-col gap-4 justify-center items-center">
        <img
          src={team.teams.logo}
          alt={team.teams.name}
          className="h-[100px] w-[100px] object-contain"
        />
        <div className="flex gap-4">
          <img
            src={team.teams.logo}
            alt=""
            className="h-[30px] w-[30px] object-contain"
          />
          <p className="text-white font-normal text-[20px]">{team.teams.name}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamItem;
