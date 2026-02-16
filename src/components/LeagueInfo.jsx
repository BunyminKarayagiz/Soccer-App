import React, { useState, useEffect } from "react";
import LeagueSelection from "./LeagueSelection.jsx";
import SelectionSeason from "./SelectionSeason.jsx";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { league_info, ranksdata } from "../datas/apiDatas.js";
import Ranks from "./Ranks.jsx";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getLeaugueRanksAndInfo } from "../services/apiServices.js";

function LeagueInfo({
  initialLeagueId,
  initialLeagueSeason,
  syncUrl = true,
  hideSelectors = false,
}) {
  const [selectLeagueId, setSelectLeagueId] = useState(initialLeagueId || 39);
  const [selectSeason, setSelectSeason] = useState(initialLeagueSeason || 2023);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [teamRanks, setTeamRanks] = useState([]);
  const [favLeagues, setFavLeagues] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  console.log(selectLeagueId,selectSeason)
  const toggleLeagueFav = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const current = data.favorites?.leagues || [];

    const exists = current.some((l) => l.id === leagueInfo.id);

    let updated;

    if (exists) {
      // ❌ kaldır
      updated = current.filter((l) => l.id !== leagueInfo.id);
    } else {
      // ⭐ ekle
      const newLeague = {
        id: leagueInfo.id,
        league_name: leagueInfo.league_name,
        logo: leagueInfo.logo,
      };

      updated = [...current, newLeague];
    }

    await updateDoc(ref, {
      "favorites.leagues": updated,
    });

    setFavLeagues(updated);
  };

  const isFavLeague = favLeagues.some((l) => l.id === leagueInfo.id);

  useEffect(() => {
    if (!selectLeagueId || !selectSeason) return;
    const fetchFavLeagues = async () => {
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setFavLeagues(data.favorites?.leagues || []);
      }
    };
    async function fetchData() {
      try {
        const [leagueRes, teamRes] = await getLeaugueRanksAndInfo(
          selectLeagueId,
          selectSeason,
        );
        if (!leagueRes) {
          // servisten boş döndüyse
          setLeagueInfo({});
          setTeamRanks([]);
        } else {
          setLeagueInfo(leagueRes);
          setTeamRanks(teamRes || []);
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
        setLeagueInfo({});
        setTeamRanks([]);
      }
    }
    //fetchData();
    setLeagueInfo(league_info || []);
    setTeamRanks(ranksdata || []);
    fetchFavLeagues();
    if (syncUrl) {
      navigate(`/league/${selectLeagueId}/${selectSeason}`, { replace: true });
    }
  }, [selectLeagueId, selectSeason, currentUser, navigate]);

  return (
    <div
      className="
py-3 sm:py-4 px-3 sm:px-5 
bg-[#3C096C] 
rounded-xl
overflow-hidden 
h-full
flex flex-col
"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col text-white gap-1">
            <h2
              onClick={() => {
                navigate(`/league/${leagueInfo.id}/${initialLeagueSeason}`);
              }}
              className="cursor-pointer text-xl sm:text-2xl lg:text-3xl font-bold hover:text-purple-300 transition"
            >
              {leagueInfo.league_name}
            </h2>
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
              <img
                src={leagueInfo.logo}
                alt="League Logo"
                className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] object-contain"
              />
              <h3 className="text-sm sm:text-base lg:text-lg font-sans">{leagueInfo.country}</h3>
              <h5 className="text-xs sm:text-sm text-gray-300">
                {selectSeason} - {selectSeason + 1}
              </h5>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
            {isFavLeague ? (
              <IoIosStar
                onClick={toggleLeagueFav}
                className="size-6 sm:size-7 text-yellow-400 cursor-pointer hover:scale-110 transition"
              />
            ) : (
              <IoIosStarOutline
                onClick={toggleLeagueFav}
                className="size-6 sm:size-7 text-white cursor-pointer hover:scale-110 transition"
              />
            )}
            {!hideSelectors && (
              <>
                <LeagueSelection
                  selectedLeague={selectLeagueId}
                  setLeague={setSelectLeagueId}
                />
              </>
            )}
            <SelectionSeason
              season={selectSeason}
              setSeason={setSelectSeason}
            />
          </div>
        </div>

        <div
          className="hidden sm:grid grid-cols-[40px_minmax(150px,1fr)_50px_40px_50px_30px_50px_40px_140px]
                        text-gray-400 mt-2 text-sm font-semibold border-b border-gray-600 pb-1 px-2"
        >
          <p className="text-start">#</p>
          <p className="text-start">Team</p>
          <p className="text-center">P</p>
          <p className="text-center">W</p>
          <p className="text-center">D</p>
          <p className="text-center">L</p>
          <p className="text-center">GD</p>
          <p className="text-center">PTS</p>
          <p className="text-center">FORM</p>
        </div>
        
        {/* Mobile Header */}
        <div className="grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_45px_90px]
                        text-gray-400 mt-2 text-xs font-semibold border-b border-gray-600 pb-1 px-2 gap-1">
          <p className="text-start">#</p>
          <p className="text-start">Team</p>
          <p className="text-center">PTS</p>
          <p className="text-end">FORM</p>
        </div>
      </div>

      <div
        className="
flex-1 
mt-2
overflow-y-auto 
scrollbar
scrollbar-thumb-[#974CE0]
scrollbar-track-transparent
"
      >
        {teamRanks.map((teams) => (
          <Ranks key={teams.teams.id} teams={teams} />
        ))}
      </div>
    </div>
  );
}

export default LeagueInfo;
