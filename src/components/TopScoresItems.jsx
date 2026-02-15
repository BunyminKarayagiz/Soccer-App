import React from "react";
import { useNavigate } from "react-router-dom";

function TopScoresItems({ topScores, index }) {

  const navigate = useNavigate();
  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:grid grid-cols-[40px_minmax(120px,1fr)_minmax(140px,1fr)_50px_50px_50px]
                      px-2 gap-3 py-1.5 items-center bg-[#240046] rounded-lg mb-1
                      border border-gray-700 hover:bg-[#5A189A] transition">
        <p className="text-white text-sm text-start font-bold">{index + 1}</p>
        <div
          onClick={() => navigate(`/player/${topScores.player.id}`)}
          className="flex items-center gap-2 cursor-pointer min-w-0"
        >
          <img
            className="w-[25px] h-[25px] rounded-md object-contain flex-shrink-0"
            src={topScores.player.photo}
            alt="Player"
          />
          <p className="text-white text-sm truncate">{topScores.player.name}</p>
        </div>
        <div
          onClick={() => navigate(`/team/${topScores.team.id}/2023`)}
          className="flex items-center gap-2 cursor-pointer min-w-0"
        >
          <img
            className="w-[25px] h-[25px] object-contain flex-shrink-0"
            src={topScores.team.logo}
            alt="Team"
          />
          <p className="text-white text-sm truncate">{topScores.team.name}</p>
        </div>
        <p className="text-white text-sm text-center">{topScores.stat.appearances}</p>
        <p className="text-white text-sm text-center">{topScores.stat.goals}</p>
        <p className="text-white text-sm text-center">{topScores.stat.assists}</p>
      </div>

      {/* Mobile View */}
      <div className="grid sm:hidden grid-cols-[35px_minmax(100px,1fr)_40px_40px_40px]
                      px-2 gap-2 py-2 items-center bg-[#240046] rounded-md mb-1
                      border border-gray-700 hover:bg-[#5A189A] transition">
        <p className="text-white text-xs text-start font-bold">{index + 1}</p>
        <div
          onClick={() => navigate(`/player/${topScores.player.id}`)}
          className="flex items-center gap-1.5 cursor-pointer min-w-0"
        >
          <img
            className="w-[20px] h-[20px] rounded-md object-contain flex-shrink-0"
            src={topScores.player.photo}
            alt="Player"
          />
          <p className="text-white text-xs truncate">{topScores.player.name}</p>
        </div>
        <p className="text-white text-xs text-center">{topScores.stat.appearances}</p>
        <p className="text-white text-xs text-center">{topScores.stat.goals}</p>
        <p className="text-white text-xs text-center">{topScores.stat.assists}</p>
      </div>
    </>
  );
}

export default TopScoresItems;
