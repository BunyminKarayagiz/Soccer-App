import React,{useState,useEffect} from "react";
import TeamItem from "../components/TeamItem.jsx";
import { xTeamsData } from "../datas/apiDatas.js";
import SearchingBar from "../components/SearchingBar.jsx";
function Teams() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const data = xTeamsData.slice(0, 12);
    setTeamData(data);
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4">
      <div
        className="lg:col-span-8 lg:row-span-6 
      grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 gap-4"
      >
        {teamData.map((team) => (
          <TeamItem key={team.teams.id} team={team} />
        ))}
      </div>
      <div className="lg:col-span-2">
        <SearchingBar type={"teams"} />
      </div>
    </div>
  );
}

export default Teams;
