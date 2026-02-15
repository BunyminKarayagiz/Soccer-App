import React, { useEffect, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import { GoGoal } from "react-icons/go";
import { topGoalData } from "../datas/apiDatas";
import { useNavigate } from "react-router-dom";
import { getTopScores } from "../services/apiServices";
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
    <div className="bg-[#3C096C] p-[15px] rounded-[12px] h-full overflow-hidden flex flex-col">
      <div>
        <h1 className="text-white font-bold text-[24px]">Top Goals</h1>
        <div
          className="grid px-[1vh] gap-5 grid-cols-[10px_1fr_38px_20px_42px]
                 mt-[10px] border-b border-b-[.1vh]  border-[#4B5563] items-center
                            text-[#9CA3AF] text-[2vh] sticky"
        >
          <p>#</p>
          <IoPersonSharp />
          <p className="text-[1.5vh]">Team</p>
          <TbPlayFootball />
          <GoGoal />
        </div>
      </div>

      <div
        className="flex-1 
overflow-y-auto 
scrollbar
scrollbar-thumb-[#974CE0]
scrollbar-track-transparent"
      >
        {topGoal.map((goaler, index) => (
          <div
            key={goaler.player.id}
            className="grid px-[1vh] gap-5 mt-[2px] grid-cols-[10px_1fr_35px_25px_25px] items-center"
          >
            <p className="text-white/80 font-normal">{index + 1}.</p>
            <div
              onClick={() => navigate(`/player/${goaler.team.id}`)}
              className="flex gap-2 text-white font-normal cursor-pointer"
            >
              <img
                src={goaler.player.photo}
                alt={goaler.player.photo}
                className="h-[30px] w-[30px] object-contain rounded-[5px]"
              />
              <p>{goaler.player.name}</p>
            </div>
            <div className="flex gap-[23px] text-white font-normal items-center">
              <img
                onClick={() => navigate(`/team/${goaler.team.id}/2023`)}
                src={goaler.team.logo}
                alt={goaler.team.name}
                className="h-[30px] w-[30px] object-contain cursor-pointer"
              />
              <p>{goaler.statistics.appearences}</p>
              <p>{goaler.statistics.goal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopGoalers;
