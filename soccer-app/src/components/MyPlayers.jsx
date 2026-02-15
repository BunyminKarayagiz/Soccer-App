import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext.jsx";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";

function MyPlayers({ data }) {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState(data);
  const navigate = useNavigate();
  const removeFav = async (matchId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const favs = snap.data().favorites?.players || [];

    const updated = favs.filter((m) => m.id !== matchId);

    await updateDoc(ref, {
      "favorites.players": updated,
    });

    setPlayers(updated);
  };

  return (
    <div className="bg-[#3C096C] p-5 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-4">Favori Oyuncular</h2>
      {!players.length ? (
        <>
          <div className="text-white font-medium flex justify-center mt-[100px] text-2xl">
            Favori oyuncu yok
          </div>
        </>
      ) : (
        <>
          {players.map((p) => (
            <div
              key={p.id}
              className="flex gap-[30px] text-white p-[5px] rounded-[12px] bg-[#7B2CBF] mt-[10px]"
            >
              <IoIosStar
                className="text-yellow-400 size-9 cursor-pointer"
                onClick={() => removeFav(p.id)}
              />
              <div
              onClick={() => navigate(`/player/${p.id}`)}
              className="flex gap-[10px] items-center cursor-pointer">
                <img
                  src={p.photo}
                  alt=""
                  className="w-[40px] h-[40px] object-contain"
                />
                <p className="font-medium text-[20px]">{p.name}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MyPlayers;
