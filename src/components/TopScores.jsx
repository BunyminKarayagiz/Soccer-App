import React, { useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import { GoGoal } from "react-icons/go";
import LeagueSelection from "./LeagueSelection.jsx";
import { useEffect } from "react";
//import { topScoresData } from "../datas/apiDatas";
import TopScoresItems from "./TopScoresItems.jsx";
import assistIcon from "../assets/assistIcon.png";
import SelectionSeason from "./SelectionSeason.jsx";
import {topScoresDataRes} from "../datas/apiDatas.js"


function TopScores() {
  const [selectLeagueId, setSelectLeagueId] = useState(39);
  const [selectSeason, setSelectSeason] = useState(2023);
  const [topScores, setTopScores] = useState([]);
  useEffect(() => {
    /* Buraya lig id'sine göre top skorların alınacak olan api çağırısı yazılacak */
    
   /* async function fetchData() {
      try {
        const topScoresDataRes = await getTopScoresData(
          selectLeagueId,
          selectSeason,
        );
        console.log(topScoresDataRes)
        if (!topScoresDataRes) {
          // servisten boş döndüyse
          setTopScores({});
        } else {
          setTopScores(topScoresDataRes);
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
        setTopScores([]);
      }
    } */
    //fetchData();
    setTopScores(topScoresDataRes);
  }, [selectLeagueId,selectSeason]);

  return (
    <div
      className="bg-[#3C096C] rounded-xl h-full
flex flex-col p-3 sm:p-4"
    >
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h1 className="text-white text-xl sm:text-2xl font-semibold">Top Scores</h1>
          <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
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

        {/* Desktop Header */}
        <div
          className="hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(140px,1fr)_50px_50px_50px]
           px-2 gap-3 mt-2 border-b border-gray-600 pb-1 items-center
                      text-gray-400 text-sm font-semibold"
        >
          <p className="text-start">#</p>
          <p className="text-start">Player</p>
          <p className="text-start">Team</p>
          <p className="text-center">
            <TbPlayFootball className="inline" size={18} />
          </p>
          <p className="text-center">
            <GoGoal className="inline" size={18} />
          </p>
          <p className="text-center">
            <img
              className="w-[18px] h-[18px] inline"
              src={assistIcon}
              alt="Assist"
            />
          </p>
        </div>

        {/* Mobile Header */}
        <div
          className="grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_40px_40px_40px]
           px-2 gap-2 mt-2 border-b border-gray-600 pb-1 items-center
                      text-gray-400 text-xs font-semibold"
        >
          <p className="text-start">#</p>
          <p className="text-start">Player</p>
          <p className="text-center">
            <TbPlayFootball className="inline" size={16} />
          </p>
          <p className="text-center">
            <GoGoal className="inline" size={16} />
          </p>
          <p className="text-center">
            <img
              className="w-[14px] h-[14px] inline"
              src={assistIcon}
              alt="A"
            />
          </p>
        </div>
      </div>

      <div
        className="custom-scroll overflow-y-auto scrollbar flex-1 
  scrollbar-thumb-[#974CE0]
  scrollbar-track-transparent
  mt-2"
      >
        {topScores.map((score, index) => (
          <TopScoresItems
            key={score.player.id}
            topScores={score}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default TopScores;
