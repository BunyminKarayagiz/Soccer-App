import React from "react";

function PlayerStatistics({ data }) {

  console.log("STAT COMPONENT DATA:", data);

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-ink">Oyuncu Verisi Bulunamadı</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        
        {/* MATCHES */}
        <div className="row p-4">
          <h3 className="font-bold mb-3">Matches</h3>
          <p>Appearances: {data.appearences}</p>
          <p>Starting XI: {data.lineups}</p>
          <p>Minutes: {data.minutes}</p>

          <p>
            Minutes per game:{" "}
            {Math.floor(data.minutes / (data.appearences || 1))}
          </p>
        </div>

        {/* ATTACK */}
        <div className="row p-4">
          <h3 className="font-bold mb-3">Attacking</h3>
          <p>Goals: {data.goals}</p>
          <p>Assists: {data.assists}</p>
          <p>Shots: {data.shots}</p>
          <p>Penalty: {data.penalty}</p>
        </div>

        {/* OTHER */}
        <div className="row p-4">
          <h3 className="font-bold mb-3">Others</h3>
          <p>Yellow: {data.yellow}</p>
          <p>Red: {data.red}</p>
          <p>Fouls: {data.fouls}</p>
          <p>Interceptions: {data.interceptions}</p>
          <p>Key passes: {data.keyPass}</p>
        </div>

      </div>
    </div>
  );
}

export default PlayerStatistics;
