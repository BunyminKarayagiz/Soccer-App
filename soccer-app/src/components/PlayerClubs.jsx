import React from "react";
import { useNavigate } from "react-router-dom";

function PlayerClubs({ data }) {
  const navigate = useNavigate();
  if (!data || data.length === 0) return null;

  // 🔥 yıl bazlı grupla
  const yearMap = {};

  data.forEach((club) => {
    club.seasons.forEach((year) => {
      if (!yearMap[year]) yearMap[year] = [];

      yearMap[year].push({
        id: club.team.id,
        name: club.team.name,
        logo: club.team.logo,
      });
    });
  });

  // yılları büyükten küçüğe sırala
  const sortedYears = Object.keys(yearMap)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-3">
      {sortedYears.map((year) => (
        <div
          key={year}
          className="flex items-center gap-5 bg-[#5A189A] p-3 rounded-xl"
        >
          {/* yıl */}
          <div className="text-white font-bold text-lg w-[60px]">{year}</div>

          {/* logolar */}
          <div className="flex gap-3 flex-wrap">
            {yearMap[year].map((team) => (
              <img
                onClick={() => {
                  navigate(`/team/${team.id}/2023`);
                }}
                key={team.id}
                src={team.logo}
                alt={team.name}
                title={team.name}
                className="w-8 h-8 object-contain bg-white rounded-full p-1"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayerClubs;
