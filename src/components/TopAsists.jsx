import React, { useEffect, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import { GoGoal } from "react-icons/go";
import { topAssistsData } from "../datas/apiDatas.js";
import { useNavigate } from "react-router-dom";
//import { getTopAssists } from "../services/apiServices.js";

function TopAsists({ id, season }) {
  const [topAssist, setTopAssist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //async function fetchData() {
    //  const players = await getTopAssists(id, season);
    //  console.log(players)
    //  setTopAssist(players)
    //}
    //fetchData();
    setTopAssist(topAssistsData);
  }, [id, season]);
  return (
    <div className="card flex h-full flex-col overflow-hidden p-3 sm:p-4">
      <div>
        <h1 className="mb-3 text-lg font-bold text-ink sm:text-xl md:text-2xl">Top Assists</h1>
        
        {/* Desktop Header */}
        <div
          className="hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(80px,auto)_50px_50px]
           px-2 gap-3 mt-2 border-b border-line pb-1 items-center
           text-muted text-sm font-semibold"
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
           px-2 gap-2 mt-2 border-b border-line pb-1 items-center
           text-muted text-xs font-semibold"
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
scrollbar-thumb-accent
scrollbar-track-transparent"
      >
        {topAssist.map((goaler, index) => (
          <div key={goaler.player.id}>
            {/* Desktop View */}
            <div
              className="row hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(80px,auto)_50px_50px]
               px-2 gap-3 py-1.5 items-center mb-1"
            >
              <p className="text-muted font-normal text-sm text-start">{index + 1}</p>
              <div
                onClick={() => navigate(`/player/${goaler.player.id}`)}
                className="flex min-w-0 cursor-pointer gap-2 font-normal text-ink"
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
                <p className="truncate text-sm text-ink">{goaler.team.name}</p>
              </div>
              <p className="text-center text-sm text-ink">{goaler.statistics.appearences}</p>
              <p className="text-center text-sm text-ink">{goaler.statistics.goal}</p>
            </div>

            {/* Mobile View */}
            <div
              className="row grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_40px_40px]
               px-2 gap-2 py-2 items-center mb-1"
            >
              <p className="text-muted font-normal text-xs text-start">{index + 1}</p>
              <div
                onClick={() => navigate(`/player/${goaler.player.id}`)}
                className="flex min-w-0 cursor-pointer gap-1.5 font-normal text-ink"
              >
                <img
                  src={goaler.player.photo}
                  alt={goaler.player.name}
                  className="h-[20px] w-[20px] object-contain rounded-md flex-shrink-0"
                />
                <p className="text-xs truncate">{goaler.player.name}</p>
              </div>
              <p className="text-center text-xs text-ink">{goaler.statistics.appearences}</p>
              <p className="text-center text-xs text-ink">{goaler.statistics.goal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopAsists;
