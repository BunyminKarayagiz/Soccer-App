import { topLeagues } from "../datas/apiDatas.js";
import LeagueItems from "../components/LeagueItems.jsx";
import SearchingBar from "../components/SearchingBar.jsx";
function Leagues() {
  const leagues = topLeagues;
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)]">
      <div
        className="order-last grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:order-first xl:grid-cols-4"
      >
        {leagues.map((league) => (
          <LeagueItems key={league.id} league={league} />
        ))}
      </div>
      <div className="order-first min-w-0 lg:order-last">
        <SearchingBar type ={"leagues"}/>
      </div>
    </div>
  );
}

export default Leagues;
