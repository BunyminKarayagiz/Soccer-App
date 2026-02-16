import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { IoIosStarOutline } from "react-icons/io";
import { getTeamPlayers } from "../services/apiServices.js";
import { xteamPlayers } from "../datas/apiDatas.js";
function TeamPlayers({id}) {
  const [players, setPlayers] = useState(xteamPlayers);

  const grouped = xteamPlayers.players.reduce((acc, player) => {
      const pos = player.position;

      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(player);

      return acc;
    }, {});

  if (!players) return <div>Players Verisi Yok</div>;

  const navigate = useNavigate();

  useEffect(() => {
    {
      /* Takımdaki oyuncular verisi gelecek. Player squads kısmında*/
    }

    const fetchTeamPlayers = async () => {
      try {
        const dataRes = await getTeamPlayers(id);
        // örnek: premier league + laliga + bundesliga

        if (dataRes) {
          setPlayers(dataRes);
          console.log(dataRes);
        }
      } catch (err) {
        console.log("live match çekme hata:", err);
      }
    };
    //fetchTeamPlayers
    setPlayers(grouped);
  }, []);

  console.log(players);
  return (
    <div className="">
      {Object.entries(players).map(([position, list]) => (
        <div key={position} className="mb-6">
          {/* POSITION TITLE */}
          <h2 className="text-white text-2xl font-bold mb-2">{position}</h2>

          {/* PLAYERS */}
          <div className="grid grid-cols-4 gap-3">
            {list.map((player) => (
              <div
                onClick={() => {
                  navigate(`/player/${player.id}`);
                }}
                key={player.id}
                className="bg-[#5A189A] p-3 rounded-xl text-white hover:bg-[#7B2CBF]"
              >
                <IoIosStarOutline className="size-7 cursor-pointer" />
                <img
                  src={player.photo}
                  className="w-[60px] h-[60px] rounded-full mx-auto"
                />

                <p className="text-center font-semibold mt-2">{player.name}</p>

                <p className="text-center text-sm opacity-70">
                  #{player.number}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamPlayers;
