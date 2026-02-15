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
    /*async function fetchData() {
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
    }*/
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
py-[5px] px-[20px] 
bg-[#3C096C] 
rounded-[12px] 
overflow-hidden 
h-full
flex flex-col
"
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white gap-[2px]">
            <h2
              onClick={() => {
                navigate(`/league/${leagueInfo.id}/${initialLeagueSeason}`);
              }}
              className="cursor-pointer text-[32px] font-bold flex items-center gap-[10px]"
            >
              {leagueInfo.league_name}
            </h2>
            <div className="flex gap-[10px] items-center">
              <img
                src={leagueInfo.logo}
                alt="League Logo"
                className="w-[35px] h-[35px] object-contain"
              />
              <h3 className="text-[20px] font-sans">{leagueInfo.country}</h3>
              <h5 className="text-[15px] text-gray-300">
                {selectSeason} - {selectSeason + 1}
              </h5>
            </div>
          </div>

          <div className="flex gap-[15px] items-center mt-[-20px]">
            {isFavLeague ? (
              <IoIosStar
                onClick={toggleLeagueFav}
                className="size-8 ml-[15px] text-yellow-400 cursor-pointer"
              />
            ) : (
              <IoIosStarOutline
                onClick={toggleLeagueFav}
                className="size-8 ml-[15px] text-white cursor-pointer"
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
          className="grid grid-cols-[50px_1fr_60px_30px_65px_25px_60px_30px_150px] text-center 
                        text-gray-400 mt-[5px] text-[1.5vh] font-semibold border-b border-b-[.1vh] border-gray-600"
        >
          <p className="text-start">#</p>
          <p className="text-start">Team</p>
          <p>P</p>
          <p>W</p>
          <p>D</p>
          <p>L</p>
          <p>GD</p>
          <p>PTS</p>
          <p>FORM</p>
        </div>
      </div>

      <div
        className="
flex-1 
mt-[5px] 
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
