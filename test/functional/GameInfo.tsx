import React from "react";
import {Game} from "../test-utils/game/Game";
import {PlayerInfo} from "./PlayerInfo";

export function GameInfo({game}: {game: Game}) {
  return (
    <div>
      {game?.players?.map(player => <PlayerInfo key={player.name} player={player} />)}
    </div>
  );
}
