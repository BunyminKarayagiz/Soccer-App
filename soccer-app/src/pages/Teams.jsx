import React,{useState,useEffect} from "react";
import TeamItem from "../components/TeamItem";
import { xTeamsData } from "../datas/apiDatas";
import SearchingBar from "../components/SearchingBar";
function Teams() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const data = xTeamsData.slice(0, 12);
    setTeamData(data);
  }, []);
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4">
      <div
        className="col-span-8 row-span-6 
      grid grid-cols-4 grid-rows-3 gap-4"
      >
        {teamData.map((team) => (
          <TeamItem key={team.teams.id} team={team} />
        ))}
      </div>
      <div className="col-span-2">
        <SearchingBar type={"teams"} />
      </div>
    </div>
  );
}

export default Teams;
