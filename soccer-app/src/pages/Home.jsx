import React from "react";
import Matches from "../components/Matches.jsx";
import LeagueInfo from "../components/LeagueInfo.jsx";
import TopScores from "../components/TopScores.jsx";
import TopPlayers from "../components/TopPlayers.jsx";
function Home() {
  return (
    <div className="grid grid-cols-12 px-[120px] py-[50px] gap-4">
      <div className="col-span-4 row-span-3">
        <Matches />
      </div>

      <div className="col-span-8 row-span-2">
        <LeagueInfo />
      </div>

      <div className="col-span-8">
        <TopScores />
      </div>

    </div>
  );
}

export default Home;
