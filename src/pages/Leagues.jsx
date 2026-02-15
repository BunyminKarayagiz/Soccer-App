import React, { useState } from "react";
import { topLeagues } from "../datas/apiDatas.js";
import LeagueItems from "../components/LeagueItems.jsx";
import SearchingBar from "../components/SearchingBar.jsx";
function Leagues() {

  const [leagues, setLeagues] = useState(topLeagues);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4">
      <div
        className="lg:col-span-8 lg:row-span-6 
      grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 gap-4"
      >
        {leagues.map((league) => (
          <LeagueItems key={league.id} league={league} />
        ))}
      </div>
      <div className="lg:col-span-2">
        <SearchingBar type ={"leagues"}/>
      </div>
    </div>
  );
}

export default Leagues;
