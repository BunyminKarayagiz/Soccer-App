import React from "react";
import PlayerContainer from "../components/PlayerContainer";
import { useParams } from "react-router-dom";

function Player() {
  const { id } = useParams();

  /* request player istatistic */
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
      <div className="col-span-12 row-span-6">
        <PlayerContainer id={Number(id)} />
      </div>
    </div>
  );
}

export default Player;
