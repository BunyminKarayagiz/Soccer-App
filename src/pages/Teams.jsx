import TeamItem from "../components/TeamItem.jsx";
import { xTeamsData } from "../datas/apiDatas.js";
import SearchingBar from "../components/SearchingBar.jsx";
function Teams() {
  const teamData = xTeamsData.slice(0, 12);
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)]">
      <div
        className="order-last grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:order-first xl:grid-cols-4"
      >
        {teamData.map((team) => (
          <TeamItem key={team.teams.id} team={team} />
        ))}
      </div>
      <div className="order-first min-w-0 lg:order-last">
        <SearchingBar type={"teams"} />
      </div>
    </div>
  );
}

export default Teams;
