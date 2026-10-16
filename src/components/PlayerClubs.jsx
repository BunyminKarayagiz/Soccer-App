import React from "react";
import { useNavigate } from "react-router-dom";

function PlayerClubs({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) return <div className="text-center text-xl font-bold text-muted sm:text-2xl">Veri Alınamadı</div>;

  // 🔥 array değilse array yap
  //const clubsArray = Array.isArray(xPlayerClubsData) ? xPlayerClubsData : Object.values(xPlayerClubsData);


  // tüm sezonları çıkar
  const allYears = [
    ...new Set(data[5].flatMap((club) => club.seasons || [])),
  ].sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-3">
      {allYears.map((year) => {
        const teamsThisYear = data[5].filter((club) =>
          club.seasons?.includes(year),
        );

        return (
          <div
            key={year}
            className="row flex min-w-0 flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-5"
          >
            <div className="w-14 shrink-0 font-bold">{year}</div>

            <div className="flex gap-3 flex-wrap">
              {teamsThisYear.map((club) => (
                <img
                  key={club.team.id}
                  src={club.team.logo}
                  alt={club.team.name}
                  title={club.team.name}
                  className="w-8 h-8 bg-white rounded-full p-1 cursor-pointer"
                  onClick={() => navigate(`/team/${club.team.id}/2023`)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayerClubs;
