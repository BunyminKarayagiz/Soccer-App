import React from "react";
import { topLeagues } from "../datas/apiDatas.js";
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function LeagueSelection({ selectedLeague, setLeague }) {
  const navigate = useNavigate();

  const current =
    topLeagues.find((l) => l.id === Number(selectedLeague)) || topLeagues[0];

  return (
    <div className="relative w-fit">
      <div
        className="flex items-center gap-[1vh] bg-white/5 px-[2vh] py-[1vh] rounded-xl 
        backdrop-blur-md shadow-sm hover:bg-white/10 transition pr-[2vh]"
      >
        {/* FLAG */}
        <img
          onClick={() => navigate(`/league/${current?.id}/2023`)}
          src={current?.flag}
          className="cursor-pointer w-[2.5vh] h-[2.5vh] rounded-md shadow"
        />

        <select
          value={current?.id || ""}
          onChange={(e) => setLeague(Number(e.target.value))}
          className="bg-transparent text-white outline-none cursor-pointer text-[1.5vh]
          appearance-none w-full"
          style={{ colorScheme: "dark" }}
        >
          {topLeagues.map((league) => (
            <option key={league.id} value={league.id} className="bg-[#5A189A]">
              {league.name}
            </option>
          ))}
        </select>

        <IoChevronDown className="absolute text-[1.7vh] right-[2vh] top-1/2 -translate-y-1/2 text-white pointer-events-none" />
      </div>
    </div>
  );
}

export default LeagueSelection;
