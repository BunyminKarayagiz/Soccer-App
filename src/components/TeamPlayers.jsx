import { useNavigate } from "react-router-dom";
import { IoIosStarOutline } from "react-icons/io";
import { xteamPlayers } from "../datas/apiDatas.js";
function TeamPlayers() {
  const grouped = xteamPlayers.players.reduce((acc, player) => {
      const pos = player.position;

      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(player);

      return acc;
    }, {});

  const navigate = useNavigate();

  return (
    <div className="">
      {Object.entries(grouped).map(([position, list]) => (
        <div key={position} className="mb-6">
          {/* POSITION TITLE */}
          <h2 className="mb-2 text-2xl font-bold text-ink">{position}</h2>

          {/* PLAYERS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((player) => (
              <div
                onClick={() => {
                  navigate(`/player/${player.id}`);
                }}
                key={player.id}
                className="row min-w-0 p-2 text-ink sm:p-3"
              >
                <IoIosStarOutline className="size-7 cursor-pointer" />
                <img
                  src={player.photo}
                  className="mx-auto size-12 rounded-full object-cover sm:size-14"
                />

                <p className="mt-2 truncate text-center text-sm font-semibold sm:text-base">{player.name}</p>

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
