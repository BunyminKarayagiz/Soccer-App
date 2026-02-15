import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { useAuth } from "../context/AuthContext.jsx";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";

function MyMatches({ data }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState(data);

  const removeFav = async (matchId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    console.log(data);
    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const favs = snap.data().favorites?.matches || [];

    const updated = favs.filter((m) => m.fixture_id !== matchId);

    await updateDoc(ref, {
      "favorites.matches": updated,
    });

    setMatches(updated);
  };

  return (
    <div className="bg-[#3C096C] p-5 rounded-xl">
      <h2 className="text-white text-2xl font-bold mb-4">Favori Maçlar</h2>

      {!matches.length ? (
        <div className="text-white font-medium flex justify-center mt-[100px] text-2xl">
          Favori maç yok
        </div>
      ) : (
        <>
          {matches.map((match) => (
            <div
              key={match.fixture_id}
              className="flex gap-[40px] items-center bg-[#7B2CBF] p-3 rounded-xl mb-2 text-white"
            >
              <IoIosStar
                className="text-yellow-400 text-2xl cursor-pointer"
                onClick={() => removeFav(match.fixture_id)}
              />
              <div className="flex gap-3 justify-center items-center font-medium text-[20px]">
                <img
                  onClick={() => navigate(`/team/${match.home_team.id}/2023`)}
                  src={match.home_team.logo}
                  className="w-6 cursor-pointer"
                />
                <p>{match.home_team.name}</p>
                <span>-</span>
                <p>{match.away_team.name}</p>
                <img
                  onClick={() => navigate(`/team/${match.home_team.id}/2023`)}
                  src={match.away_team.logo}
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default MyMatches;
