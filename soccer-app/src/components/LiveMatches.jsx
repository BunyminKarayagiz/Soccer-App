import React, { useEffect, useState } from "react";
import { IoIosStarOutline } from "react-icons/io";
import flagImg from "../assets/flag.png";
import teamImg from "../assets/team.png";
import refreeImg from "../assets/refree.png";
import stadImg from "../assets/stadium.png";
import { liveMatchesDatas } from "../datas/apiDatas";

function LiveMatches() {
  const [groupedMatchs, setGroupedMatchs] = useState({});

  useEffect(() => {
    const grouped = liveMatchesDatas.reduce((acc, match) => {
      const leagueId = match.league.league_id;

      if (!acc[leagueId]) {
        acc[leagueId] = {
          league: match.league,
          matches: [],
        };
      }

      acc[leagueId].matches.push(match);
      return acc;
    }, {});
    setGroupedMatchs(grouped);
  }, []);

  return (
    <div className="custom-scroll overflow-y-auto scrollbar flex-1
  scrollbar-thumb-[#974CE0]
  scrollbar-track-transparent
  p-[2px]" >
      {Object.values(groupedMatchs).map((group) => (
        <div key={group.league.league_id}>
          <div
            className="flex bg-[#5A189A] rounded-[12px] mt-[25px] p-[5px] gap-[15px] items-center"
          >
            <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
            <img
              className="w-[30px] h-[30px] object-contain"
              src={group.league.league_logo}
              alt="Flag"
            />
            <h1 className="text-white font-bold text-[15px]">
              {group.league.league_name}
            </h1>
          </div>
          {group.matches.map((match) => (
            
            <div key={match.fixture_id} className="flex px-[27px] py-[8px] items-center gap-[10px] grid grid-cols-[25px_20px_1fr_20px_25px_120px]">
              <IoIosStarOutline className="text-white text-2xl cursor-pointer" />
              <p className="text-red-600 font-bold">{match.elapsed}</p>
              {/* Teams */}
              <div className=" flex flex-col gap-[10px] font-semibold overflow-hidden">
                {/* Home Team */}
                <div className="flex items-center gap-[10px]">
                  <img
                    className="w-[30px] h-[30px] object-contain"
                    src={match.home_team.logo}
                    alt={match.home_team.name}
                  />
                  <p className="text-white">{match.home_team.name}</p>
                </div>

                {/* Away Team */}
                <div>
                  <div className="flex items-center gap-[10px]">
                    <img
                      className="w-[30px] h-[30px] object-contain"
                      src={match.away_team.logo}
                      alt={match.away_team.name}
                    />
                    <p className="text-white">{match.away_team.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[18px] text-red-600 font-bold justify-center items-center">
                <p>{match.home_team.goal}</p>
                <p>{match.away_team.goal}</p>
              </div>
              <span className="mx-6 h-15 w-[1px] bg-white/70" />

              <div className=" flex flex-col gap-[10px] font-semibold overflow-hidden">
                {/* Stad */}
                <div className="flex items-center gap-[10px]">
                  <img
                    className="w-[30px] h-[30px] object-contain"
                    src={stadImg}
                    alt="Team"
                  />
                  <p className="text-white">Rams Park</p>
                </div>

                {/* Ref */}
                <div>
                  <div className="flex items-center gap-[10px]">
                    <img
                      className="w-[30px] h-[30px] object-contain"
                      src={refreeImg}
                      alt="Team"
                    />
                    <p className="text-white">Team B</p>
                  </div>
                </div>
              </div>
              <span className="block w-[400px] h-[.1px] bg-gray-400" />
            </div>
            
          ))}
          
        </div>
      ))}
    </div>
  );
}

export default LiveMatches;
