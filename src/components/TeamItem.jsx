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
      className="bg-[#3C096C] rounded-[12px] p-3 sm:p-[20px] hover:bg-[#7B2CBF] transition delay-75 cursor-pointer flex relative"
    >
      {isFav ? (
        <IoIosStar
          onClick={toggleFav}
          className="size-6 sm:size-8 absolute top-2 right-2 sm:static sm:ml-[15px] text-yellow-400 cursor-pointer z-10"
        />
      ) : (
        <IoIosStarOutline
          onClick={toggleFav}
          className="size-6 sm:size-8 absolute top-2 right-2 sm:static sm:ml-[15px] text-white cursor-pointer z-10"
        />
      )}
      <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center w-full">
        <img
          src={team.teams.logo}
          alt={team.teams.name}
          className="h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] object-contain"
        />
        <div className="flex gap-2 sm:gap-4 items-center">
          <img
            src={team.teams.logo}
            alt=""
            className="h-[20px] w-[20px] sm:h-[30px] sm:w-[30px] object-contain"
          />
          <p className="text-white font-normal text-base sm:text-[20px] text-center">{team.teams.name}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamItem;
