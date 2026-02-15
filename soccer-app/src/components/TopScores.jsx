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
      className="bg-[#3C096C] rounded-[12px] h-full
flex flex-col p-[10px]"
    >
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-white text-[3vh] font-semibold">Top Scores</h1>
          <div className="flex gap-[15px] items-center">
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
          className="grid px-[1vh] gap-5 grid-cols-[50px_1fr_350px_25px_25px_55px]
           mt-[10px] border-b border-b-[.1vh]  border-[#4B5563] items-center
                      text-[#9CA3AF] text-[2vh] sticky"
        >
          <p>#</p>
          <IoPersonSharp />
          <p className="text-[1.5vh]">Team</p>
          <TbPlayFootball />
          <GoGoal />
          <img
            className="w-[25px] h-[25px] "
            src={assistIcon}
            alt="Assist Icon"
          />
        </div>
      </div>

      <div
        className="custom-scroll overflow-y-auto scrollbar flex-1 
  scrollbar-thumb-[#974CE0]
  scrollbar-track-transparent
  p-[5px]"
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
