import React from "react";
import { useNavigate } from "react-router-dom";

function LeagueItems({ league }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/league/${league.id}/2023`);
      }}
      className="bg-[#3C096C] rounded-[12px] p-[20px] hover:bg-[#7B2CBF] transition delay-75 cursor-pointer flex justify-center items-center"
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <img
          src={league.logo}
          alt=""
          className="h-[100px] w-[100px] object-contain"
        />
        <div className="flex gap-4">
          <img    
            src={league.flag}
            alt=""
            className="h-[30px] w-[30px] object-contain"
          />
          <p className="text-white font-normal text-[20px]">{league.name}</p>
        </div>
      </div>
    </div>
  );
}

export default LeagueItems;
