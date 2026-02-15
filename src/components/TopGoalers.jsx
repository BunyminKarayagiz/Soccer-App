import React, { useEffect, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import { GoGoal } from "react-icons/go";
import { topGoalData } from "../datas/apiDatas.js";
import { useNavigate } from "react-router-dom";

function TopGoalers({ id, season }) {
  const [topGoal, setTopGoal] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    //async function fetchData() {
    //  const players = await getTopScores(id, season);
    //  console.log(players)
    //  setTopGoal(players)
    //}
    //fetchData();

    setTopGoal(topGoalData);
  }, [id, season]);
  return (
    <div className="bg-[#3C096C] p-3 sm:p-4 rounded-xl h-full overflow-hidden flex flex-col">
      <div>
        <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-3">Top Goals</h1>
        
        {/* Desktop Header */}
        <div
          className="hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(80px,auto)_50px_50px]
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
        </div>

        {/* Mobile Header */}
        <div
          className="grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_40px_40px]
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
        </div>
      </div>

      <div
        className="flex-1 
mt-2
overflow-y-auto 
scrollbar
scrollbar-thumb-[#974CE0]
scrollbar-track-transparent"
      >
        {topGoal.map((goaler, index) => (
          <div key={goaler.player.id}>
            {/* Desktop View */}
            <div
              className="hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(80px,auto)_50px_50px]
               px-2 gap-3 py-1.5 items-center bg-[#240046] rounded-lg mb-1
               border border-gray-700 hover:bg-[#5A189A] transition"
            >
              <p className="text-white/80 font-normal text-sm text-start">{index + 1}</p>
              <div
                onClick={() => navigate(`/player/${goaler.player.id}`)}
                className="flex gap-2 text-white font-normal cursor-pointer min-w-0"
              >
                <img
                  src={goaler.player.photo}
                  alt={goaler.player.name}
                  className="h-[25px] w-[25px] object-contain rounded-md flex-shrink-0"
                />
                <p className="text-sm truncate">{goaler.player.name}</p>
              </div>
              <div className="flex gap-2 items-center min-w-0">
                <img
                  onClick={() => navigate(`/team/${goaler.team.id}/2023`)}
                  src={goaler.team.logo}
                  alt={goaler.team.name}
                  className="h-[25px] w-[25px] object-contain cursor-pointer flex-shrink-0"
                />
                <p className="text-white text-sm truncate">{goaler.team.name}</p>
              </div>
              <p className="text-white text-sm text-center">{goaler.statistics.appearences}</p>
              <p className="text-white text-sm text-center">{goaler.statistics.goal}</p>
            </div>

            {/* Mobile View */}
            <div
              className="grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_40px_40px]
               px-2 gap-2 py-2 items-center bg-[#240046] rounded-md mb-1
               border border-gray-700 hover:bg-[#5A189A] transition"
            >
              <p className="text-white/80 font-normal text-xs text-start">{index + 1}</p>
              <div
                onClick={() => navigate(`/player/${goaler.player.id}`)}
                className="flex gap-1.5 text-white font-normal cursor-pointer min-w-0"
              >
                <img
                  src={goaler.player.photo}
                  alt={goaler.player.name}
                  className="h-[20px] w-[20px] object-contain rounded-md flex-shrink-0"
                />
                <p className="text-xs truncate">{goaler.player.name}</p>
              </div>
              <p className="text-white text-xs text-center">{goaler.statistics.appearences}</p>
              <p className="text-white text-xs text-center">{goaler.statistics.goal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopGoalers;
