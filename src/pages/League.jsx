import React from "react";
import LeagueInfo from "../components/LeagueInfo.jsx";
import { useParams } from "react-router-dom";
import TopGoalers from "../components/TopGoalers.jsx";
import TopAsists from "../components/TopAsists.jsx";
function League() {
  const { id, season } = useParams();

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:min-h-[calc(100dvh-10rem)] xl:grid-cols-12 xl:grid-rows-2">
      <div className="h-[32rem] min-h-0 xl:col-span-7 xl:row-span-2 xl:h-[calc(100dvh-10rem)]">
        <LeagueInfo
          initialLeagueId={Number(id)}
          initialLeagueSeason={Number(season)}
          syncUrl={true}
        />
      </div>

      <div className="h-[26rem] min-h-0 sm:h-[30rem] xl:col-span-5 xl:h-[calc(50dvh-5rem)]">
        <TopGoalers id={id} season={season} />
      </div>
      <div className="h-[26rem] min-h-0 sm:h-[30rem] xl:col-span-5 xl:h-[calc(50dvh-5rem)]">
        <TopAsists id={id} season={season} />
      </div>
    </div>
  );
}

export default League;
