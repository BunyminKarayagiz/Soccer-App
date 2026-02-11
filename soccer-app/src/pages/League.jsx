import React from "react";
import LeagueInfo from "../components/LeagueInfo";
import { useParams } from "react-router-dom";
import TopGoalers from "../components/TopGoalers";
import TopAsists from "../components/TopAsists";
function League() {
  const { id, season } = useParams();

  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
      <div className="col-span-7 row-span-6">
        <LeagueInfo
          initialLeagueId={Number(id)}
          initialLeagueSeason={Number(season)}
          syncUrl={true}
        />
      </div>

      <div className="flex flex-col row-span-3 col-span-4 col-end-13 gap-4">
        <TopGoalers />
      </div>
      <div className="flex flex-col row-span-3 col-span-4 col-end-13 gap-4">
        <TopAsists />
      </div>
    </div>
  );
}

export default League;
