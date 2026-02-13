import React, { useState } from "react";
import SelectionSeason from "./SelectionSeason";

function PlayerStatistics({ data }) {
  const [season, setSeason] = useState(2023);
  const [stats, setStats] = useState(null);
  if (!data || data.length === 0) return null;

  const statsArray = data[0].statistics;

  // 🔥 seçilen sezonun tüm liglerini filtrele
  const seasonStats = statsArray.filter((s) => s.league.season === season);

  // 🔥 TÜM LİGLERİ TOPLA
  const total = {
    appearences: 0,
    lineups: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    shots: 0,
    passes: 0,
    keyPass: 0,
    yellow: 0,
    red: 0,
    fouls: 0,
    interceptions: 0,
    penalty: "0/0",
  };

  let penaltyScored = 0;
  let penaltyMiss = 0;

  seasonStats.forEach((s) => {
    total.appearences += s.games.appearences || 0;
    total.lineups += s.games.lineups || 0;
    total.minutes += s.games.minutes || 0;

    total.goals += s.goals.total || 0;
    total.assists += s.goals.assists || 0;

    total.shots += s.shots.total || 0;

    total.passes += s.passes.total || 0;
    total.keyPass += s.passes.key || 0;

    total.yellow += s.cards.yellow || 0;
    total.red += s.cards.red || 0;

    total.fouls += s.fouls.committed || 0;
    total.interceptions += s.tackles.interceptions || 0;

    penaltyScored += s.penalty.scored || 0;
    penaltyMiss += s.penalty.missed || 0;
  });

  total.penalty = `${penaltyScored}/${penaltyScored + penaltyMiss}`;

  return (
    <div className="bg-[#4c0d82] p-6 rounded-xl text-white">
      {/* SEASON SELECT */}
      <div className="flex justify-center mb-6">
        <SelectionSeason season={season} setSeason={setSeason} />
      </div>

      {/* STAT BOXES */}
      <div className="grid grid-cols-3 gap-6">
        {/* MATCHES */}
        <div className="bg-[#6a1fb0] p-4 rounded-xl">
          <h3 className="font-bold mb-3">Matches</h3>
          <p>Appearances: {total.appearences}</p>
          <p>Starting XI: {total.lineups}</p>
          <p>Minutes: {total.minutes}</p>
          <p>
            Minutes per game:{" "}
            {Math.floor(total.minutes / (total.appearences || 1))}
          </p>
        </div>

        {/* ATTACK */}
        <div className="bg-[#6a1fb0] p-4 rounded-xl">
          <h3 className="font-bold mb-3">Attacking</h3>
          <p>Goals: {total.goals}</p>
          <p>Assists: {total.assists}</p>
          <p>Shots: {total.shots}</p>
          <p>Penalty: {total.penalty}</p>
        </div>

        {/* OTHER */}
        <div className="bg-[#6a1fb0] p-4 rounded-xl">
          <h3 className="font-bold mb-3">Others</h3>
          <p>Yellow: {total.yellow}</p>
          <p>Red: {total.red}</p>
          <p>Fouls: {total.fouls}</p>
          <p>Interceptions: {total.interceptions}</p>
          <p>Key passes: {total.keyPass}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerStatistics;
