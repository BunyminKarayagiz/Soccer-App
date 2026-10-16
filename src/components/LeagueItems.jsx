import React from "react";
import { useNavigate } from "react-router-dom";

function LeagueItems({ league }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/league/${league.id}/2023`);
      }}
      className="row flex min-w-0 cursor-pointer items-center justify-center p-3 sm:p-5"
    >
      <div className="flex min-w-0 flex-col items-center justify-center gap-3 sm:gap-4">
        <img
          src={league.logo}
          alt=""
          className="size-16 object-contain sm:size-20 lg:size-24"
        />
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img    
            src={league.flag}
            alt=""
            className="size-5 shrink-0 object-contain sm:size-6"
          />
          <p className="min-w-0 truncate text-center text-sm font-medium sm:text-base">{league.name}</p>
        </div>
      </div>
    </div>
  );
}

export default LeagueItems;
