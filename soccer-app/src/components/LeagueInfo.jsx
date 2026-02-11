import React, { useState, useEffect } from "react";
import LeagueSelection from "./LeagueSelection";
import SelectionSeason from "./SelectionSeason";
import { IoIosStarOutline } from "react-icons/io";
import { league_info, ranksdata } from "../datas/apiDatas";
import Ranks from "./Ranks";
import { useNavigate } from "react-router-dom";

function LeagueInfo({ initialLeagueId, initialLeagueSeason, syncUrl = true }) {
  const [selectLeagueId, setSelectLeagueId] = useState(initialLeagueId || 39);
  const [selectSeason, setSelectSeason] = useState(initialLeagueSeason || 2023);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [teamRanks, setTeamRanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectLeagueId || !selectSeason) return;

    setLeagueInfo(league_info);
    setTeamRanks(ranksdata);

    if (syncUrl) {
      navigate(`/league/${selectLeagueId}/${selectSeason}`, { replace: true });
    }
  }, [selectLeagueId, selectSeason]);

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
            <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
            <LeagueSelection
              selectedLeague={selectLeagueId}
              setLeague={setSelectLeagueId}
            />
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
