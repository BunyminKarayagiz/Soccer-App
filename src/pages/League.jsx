import React from "react";
import LeagueInfo from "../components/LeagueInfo.jsx";
import { useParams } from "react-router-dom";
import TopGoalers from "../components/TopGoalers.jsx";
import TopAsists from "../components/TopAsists.jsx";
function League() {
  const { id, season } = useParams();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 h-full">
      <div className="lg:col-span-7 lg:row-span-6 h-[500px] lg:h-auto">
        <LeagueInfo
          initialLeagueId={Number(id)}
          initialLeagueSeason={Number(season)}
          syncUrl={true}
        />
      </div>

      <div className="flex flex-col lg:row-span-3 lg:col-span-4 lg:col-end-13 gap-4 h-[400px] lg:h-auto">
        <TopGoalers id={id} season={season} />
      </div>
      <div className="flex flex-col lg:row-span-3 lg:col-span-4 lg:col-end-13 gap-4 h-[400px] lg:h-auto">
        <TopAsists id={id} season={season} />
      </div>
    </div>
  );
}

export default League;
