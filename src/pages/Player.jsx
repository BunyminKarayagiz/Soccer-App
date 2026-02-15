import React from "react";
import PlayerContainer from "../components/PlayerContainer.jsx";
import { useParams } from "react-router-dom";

function Player() {
  const { id } = useParams();

  /* request player istatistic */
  return (
    <div className="h-full">
      <PlayerContainer id={Number(id)} />
    </div>
  );
}

export default Player;
