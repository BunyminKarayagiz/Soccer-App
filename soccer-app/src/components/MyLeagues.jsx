import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function MyLeagues({ data }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState(data);
  console.log(data);
  const removeFav = async (matchId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const favs = snap.data().favorites?.leagues || [];

    const updated = favs.filter((m) => m.id !== matchId);

    await updateDoc(ref, {
      "favorites.leagues": updated,
    });

    setLeagues(updated);
  };

  return (
    <div className="bg-[#3C096C] p-5 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-4">Favori Leagues</h2>

      {!leagues.length ? (
        <>
          <div className="text-white font-medium flex justify-center mt-[100px] text-2xl">
            Favori maç yok
          </div>
        </>
      ) : (
        <>
          {leagues.map((league) => (
            <div
              key={league.id}
              className="flex gap-[30px] items-center bg-[#7B2CBF] p-3 rounded-xl mb-2 text-white"
            >
              {" "}
              <IoIosStar
                className="text-yellow-400 text-3xl cursor-pointer"
                onClick={() => removeFav(league.id)}
              />
              <div
                onClick={() => navigate(`/league/${league.id}/2023`)}
                className="flex gap-3 items-center cursor-pointer"
              >
                <img
                  src={league.logo}
                  className="w-[40px] h-[40px] object-contain"
                />
                <p className="text-white text-[20px] font-medium">
                  {league.league_name}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MyLeagues;
