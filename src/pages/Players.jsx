import PlayerItem from "../components/PlayerItem.jsx";
import SearchingBar from "../components/SearchingBar.jsx";
import { topScoresDataRes } from "../datas/apiDatas.js";
function Players() {
  const playersData = topScoresDataRes.slice(0, 12);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)]">
      <div
        className="order-last grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:order-first xl:grid-cols-3"
      >
        {playersData.map((player) => (
          <PlayerItem key={player.player.id} player={player} />
        ))}
      </div>
      <div className="order-first min-w-0 lg:order-last">
        <SearchingBar type ={"players"}/>
      </div>
    </div>
  );
}

export default Players;
