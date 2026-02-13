import React, { useState } from "react";
import { topLeagues } from "../datas/apiDatas";
import LeagueItems from "../components/LeagueItems";
import SearchingBar from "../components/SearchingBar";
function Leagues() {
  const [leagues, setLeagues] = useState(topLeagues);
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4">
      <div
        className="col-span-8 row-span-6 
      grid grid-cols-4 grid-rows-3 gap-4"
      >
        {leagues.map((league) => (
          <LeagueItems key={league.id} league={league} />
        ))}
      </div>
      <div className="col-span-2">
        <SearchingBar type ={"leagues"}/>
      </div>
    </div>
  );
}

export default Leagues;
