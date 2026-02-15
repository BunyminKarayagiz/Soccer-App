import React from "react";
import Matches from "../components/Matches.jsx";
import LeagueInfo from "../components/LeagueInfo.jsx";
import TopScores from "../components/TopScores.jsx";
function Home() {
  return (
    <div
      className="h-full grid grid-cols-12 grid-rows-6 gap-4">
      <div className="col-span-4 row-span-6">
        <Matches />
      </div>
      <div className="col-span-8 row-span-3">
        <LeagueInfo syncUrl={false} />
      </div>
      <div className="col-span-8 row-span-3">
        <TopScores />
      </div>
    </div>
  );
}

export default Home;
