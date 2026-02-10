import React from "react";

function TopScoresItems({ topScores, index }) {
  return (
    <div className="grid px-[1vh] gap-5 mt-[2px] grid-cols-[35px_1fr_370px_25px_25px_34px] items-center">
      <p className="text-white">{index + 1}.</p>
      <div className="flex items-center gap-[10px]">
        <img
          className="w-[30px] h-[30px] rounded-xs object-contain"
          src={topScores.player.photo}
          alt="Player Photo"
        />
        <p className="text-white">{topScores.player.name}</p>
      </div>
      <div className="flex items-center gap-[10px]">
        <img
          className="w-[30px] h-[30px] object-contain"
          src={topScores.team.logo}
          alt="Team Logo"
        />
        <p className="text-white">{topScores.team.name}</p>
      </div>
      <p className="text-white">{topScores.statistics.appearences}</p>
      <p className="text-white">{topScores.statistics.goal}</p>
      <p className="text-white">{topScores.statistics.goal}</p>
    </div>
  );
}

export default TopScoresItems;
