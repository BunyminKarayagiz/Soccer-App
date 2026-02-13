import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function MyTeams({ data }) {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState(data);
  const navigate = useNavigate();
  const removeFav = async (teamId) => {
    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const favs = snap.data().favorites?.teams || [];
    const updated = favs.filter((t) => t.id !== teamId);

    await updateDoc(ref, {
      "favorites.teams": updated,
    });

    setTeams(updated);
  };
  console.log(teams);

  return (
    <div className="bg-[#3C096C] p-5 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-4">Favori Takımlar</h2>

      {!teams.length ? (
        <div className="text-white font-medium flex justify-center mt-[100px] text-2xl">
          Favori takım yok
        </div>
      ) : (
        <>
          {teams.map((t) => (
            <div
              key={t.id}
              className="flex text-white p-[5px] px-[10px] rounded-[12px] bg-[#7B2CBF] items-center gap-[30px] mt-[10px]"
            >
              <IoIosStar
                className="text-yellow-400 size-8 cursor-pointer"
                onClick={() => removeFav(t.id)}
              />
              <div
                onClick={() => navigate(`/team/${t.id}/2023`)}
                className="flex items-center gap-[10px] cursor-pointer"
              >
                <img
                  src={t.photo}
                  alt=""
                  className="w-[40px] h-[40px] object-contain"
                />
                <p className="font-medium text-[20px]">{t.name}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MyTeams;
