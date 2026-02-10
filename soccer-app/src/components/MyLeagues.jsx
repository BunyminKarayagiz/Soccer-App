import React, { useEffect,useState } from "react";
import { liveMatchesDatas } from "../datas/apiDatas";
import { IoIosStarOutline } from "react-icons/io";


function MyLeagues() {
  const [favoriteLeagues, setFavoriteLeagues] = useState({});
  useEffect(() => {

    {/* Buraya oluşturduğum veri tabanından gelecek olan favorilerin lig kısmı gelecek  */}

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
    setFavoriteLeagues(grouped);
    console.log(grouped);
  }, []);
  return (
    <div className="flex flex-col p-[25px]  bg-[#3C096C] rounded-[12px]">
      <h1 className="text-[32px] font-bold text-white mb-[10px] border-b border-b-[.1vh] border-gray-600">
        My Leagues
      </h1>
      {Object.values(favoriteLeagues).map((group) => (
        <div
          key={group.league.league_id}
          className="flex bg-[#5A189A] rounded-[12px] mt-[5px] p-[5px] gap-[15px] items-center"
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
      ))}
    </div>
  );
}

export default MyLeagues;
