import React, { useEffect, useState } from "react";
import refreeImg from "../assets/refree.png";
import stadImg from "../assets/stadium.png";
import { liveMatchesDatas } from "../datas/apiDatas";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { topLeagues_str } from "../services/apiServices.js";
import { getLiveMatchs } from "../services/apiServices";
import { xLiveMatchesData } from "../datas/apiDatas";
function LiveMatches() {
  const [groupedMatchs, setGroupedMatchs] = useState({});
  const [favMatches, setFavMatches] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isFav = (matchId) => {
    return favMatches.some((m) => m.fixture_id === matchId);
  };
  const handleFav = async (match) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const uid = currentUser.uid;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();
    const currentFavs = data.favorites?.matches || [];

    const exists = currentFavs.some((m) => m.fixture_id === match.fixture_id);

    let updated;

    if (exists) {
      // ❌ kaldır
      updated = currentFavs.filter((m) => m.fixture_id !== match.fixture_id);
    } else {
      // ⭐ ekle
      updated = [...favMatches, match];
    }

    await updateDoc(ref, {
      "favorites.matches": updated,
    });

    setFavMatches(updated);
  };

  useEffect(() => {
    const fetchFav = async () => {
      if (!currentUser) return;

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setFavMatches(snap.data().favorites?.matches || []);
      }
    };

    /*const fetchLive = async () => {
      try {
        const data = await getLiveMatchs(topLeagues_str);
        // örnek: premier league + laliga + bundesliga

        if (data) {
          setGroupedMatchs(data);
          console.log(data)
        }
      } catch (err) {
        console.log("live match çekme hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();*/
    setGroupedMatchs(xLiveMatchesData)
    fetchFav();
  }, [currentUser]);

  if (!groupedMatchs) {
    return <p className="text-white">No Data</p>;
  }
  return (
    <div
      className="custom-scroll overflow-y-auto scrollbar flex-1
  scrollbar-thumb-[#974CE0]
  scrollbar-track-transparent
  p-[2px]"
    >
      {Object.values(groupedMatchs).map((group) => (
        <div key={group.league.league_id}>
          <div
            onClick={() => navigate(`/league/${group.league.league_id}/2023`)}
            className="cursor-pointer flex bg-[#5A189A] rounded-[12px] mt-[25px] p-[5px] gap-[15px] items-center px-[20px]"
          >
            <img
              className="w-[30px] h-[30px] object-contain"
              src={group.league.league_logo}
              alt="Flag"
            />
            <h1 className="text-white font-bold text-[15px]">
              {group.league.league_name}
            </h1>
          </div>
          {group.matches.map((match) => (
            <div
              key={match.fixture_id}
              className="flex px-[27px] py-[8px] items-center gap-[10px] grid grid-cols-[25px_20px_1fr_20px_25px_120px]"
            >
              {isFav(match.fixture_id) ? (
                <IoIosStar
                  onClick={() => handleFav(match)}
                  className="size-8 ml-[-10px] text-yellow-400 cursor-pointer"
                />
              ) : (
                <IoIosStarOutline
                  onClick={() => handleFav(match)}
                  className="size-8 ml-[-10px] text-white cursor-pointer"
                />
              )}
              <p className="text-red-600 font-bold">{match.elapsed}'</p>
              {/* Teams */}
              <div className=" flex flex-col gap-[10px] font-semibold overflow-hidden">
                {/* Home Team */}
                <div className="flex items-center gap-[10px]">
                  <img
                    onClick={() => navigate(`/team/${match.home_team.id}/2023`)}
                    className="w-[30px] h-[30px] object-contain cursor-pointer"
                    src={match.home_team.logo}
                    alt={match.home_team.name}
                  />
                  <p className="text-white">{match.home_team.name}</p>
                </div>

                {/* Away Team */}
                <div>
                  <div className="flex items-center gap-[10px]">
                    <img
                      onClick={() =>
                        navigate(`/team/${match.away_team.id}/2023`)
                      }
                      className="w-[30px] h-[30px] object-contain cursor-pointer"
                      src={match.away_team.logo}
                      alt={match.away_team.name}
                    />
                    <p className="text-white">{match.away_team.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[18px] text-red-600 font-bold justify-center items-center">
                <p>{match.home_team.goal}</p>
                <p>{match.away_team.goal}</p>
              </div>
              <span className="mx-6 h-15 w-[1px] bg-white/70" />

              <div className=" flex flex-col gap-[10px] font-semibold overflow-hidden">
                {/* Stad */}
                <div className="flex items-center gap-[10px]">
                  <img
                    className="w-[30px] h-[30px] object-contain"
                    src={stadImg}
                    alt="Team"
                  />
                  <p className="text-white">Rams Park</p>
                </div>

                {/* Ref */}
                <div>
                  <div className="flex items-center gap-[10px]">
                    <img
                      className="w-[30px] h-[30px] object-contain"
                      src={refreeImg}
                      alt="Team"
                    />
                    <p className="text-white">Team B</p>
                  </div>
                </div>
              </div>
              <span className="block w-[400px] h-[.1px] bg-gray-400" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LiveMatches;
