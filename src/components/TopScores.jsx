import React, { useState } from "react";
import { TbPlayFootball } from "react-icons/tb";
import { GoGoal } from "react-icons/go";
import LeagueSelection from "./LeagueSelection.jsx";
import { useEffect } from "react";
import TopScoresItems, { SCORE_GRID } from "./TopScoresItems.jsx";
import assistIcon from "../assets/assistIcon.png";
import SelectionSeason from "./SelectionSeason.jsx";
import { DEFAULT_SEASON } from "../config.js";
//import { getTopScoresData } from "../services/apiServices.js";
import {topScoresDataRes} from "../datas/apiDatas.js"


function TopScores() {
  const [selectLeagueId, setSelectLeagueId] = useState(39);
  const [selectSeason, setSelectSeason] = useState(DEFAULT_SEASON);
  const [topScores, setTopScores] = useState([]);
  useEffect(() => {
    /* Buraya lig id'sine göre top skorların alınacak olan api çağırısı yazılacak */
    
    //async function fetchData() {
    //  try {
    //    const topScoresDataRes = await getTopScoresData(
    //      selectLeagueId,
    //      selectSeason,
    //    );
    //    console.log("dasf",topScoresDataRes)
    //    if (!topScoresDataRes) {
    //      // servisten boş döndüyse
    //      setTopScores({});
    //    } else {
    //      setTopScores(topScoresDataRes);
    //    }
    //  } catch (error) {
    //    console.error("getLeaugue error:", error);
    //    setTopScores([]);
    //  } 
    //} 
    //fetchData();
    setTopScores(topScoresDataRes);
  }, [selectLeagueId,selectSeason]);

  return (
    <section className="card flex h-full min-h-0 flex-col p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold sm:text-2xl">Gol Krallığı</h2>
        <div className="flex flex-wrap items-center gap-2">
          <LeagueSelection
            selectedLeague={selectLeagueId}
            setLeague={setSelectLeagueId}
          />
          <SelectionSeason season={selectSeason} setSeason={setSelectSeason} />
        </div>
      </div>

      {/* Başlık satırı: satırlarla aynı sütun düzeni */}
      <div
        className={`${SCORE_GRID} border-b border-line px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted`}
      >
        <span>#</span>
        <span>Oyuncu</span>
        <span className="hidden sm:block">Takım</span>
        <span className="text-center" title="Maç">
          <TbPlayFootball className="inline" size={16} aria-label="Maç" />
        </span>
        <span className="text-center" title="Gol">
          <GoGoal className="inline" size={16} aria-label="Gol" />
        </span>
        <span className="text-center" title="Asist">
          <img className="inline size-4 opacity-70" src={assistIcon} alt="Asist" />
        </span>
      </div>

      <div className="custom-scroll mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
        {topScores.map((score, index) => (
          <TopScoresItems key={score.player.id} topScores={score} index={index} />
        ))}
      </div>
    </section>
  );
}

export default TopScores;
