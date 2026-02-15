import React from "react";
import Matches from "../components/Matches.jsx";
import LeagueInfo from "../components/LeagueInfo.jsx";
import TopScores from "../components/TopScores.jsx";
function Home() {
  return (
    <div
      className="h-full grid grid-cols-1 lg:grid-cols-12 grid-rows-1 lg:grid-rows-6 gap-4">
      <div className="lg:col-span-4 lg:row-span-6 h-[400px] lg:h-auto">
        <Matches />
      </div>
      <div className="lg:col-span-8 lg:row-span-3 h-[400px] lg:h-auto">
        <LeagueInfo syncUrl={false} />
      </div>
      <div className="lg:col-span-8 lg:row-span-3 h-[400px] lg:h-auto">
        <TopScores />
      </div>
    </div>
  );
}

export default Home;
