import React, { useEffect } from "react";
import PlayerItem from "../components/PlayerItem";
import { useState } from "react";
import SearchingBar from "../components/SearchingBar";
import { topScoresDataRes } from "../datas/apiDatas";
import { getTopScoresData } from "../services/apiServices.js"
function Players() {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    
      /*async function fetchData() {
      try {
        const topScoresDataRes = await getTopScoresData(
          39,
          2023,
        );
        console.log(topScoresDataRes)
        if (!topScoresDataRes) {
          // servisten boş döndüyse
          setPlayersData({});
        } else {
          setPlayersData(topScoresDataRes);
        }
      } catch (error) {
        console.error("getLeaugue error:", error);
        setPlayersData([]);
      }
    }
    fetchData(); */

    const data = topScoresDataRes.slice(0, 12);
    setPlayersData(data);
  }, []);
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4">
      <div
        className="col-span-8 row-span-6 
      grid grid-cols-4 grid-rows-3 gap-4"
      >
        {playersData.map((player) => (
          <PlayerItem key={player.player.id} player={player} />
        ))}
      </div>
      <div className="col-span-2">
        <SearchingBar type ={"players"}/>
      </div>
    </div>
  );
}

export default Players;
