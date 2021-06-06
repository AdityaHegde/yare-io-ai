import React, {useState} from "react";
import ReactDOM from "react-dom";
import {Game} from "../test-utils/game/Game";
import {GameInfo} from "./GameInfo";
import {YareIO} from "../test-utils/game/YareIO";

const game = new Game();
const yareio = new YareIO(game);

export function App() {
  const [paused, setPaused] = useState<boolean>(false);

  const pause = () => {
    if (paused) {
      yareio.resume();
      setPaused(false);
    } else {
      yareio.pause();
      setPaused(true);
    }
  }

  return (<div style={{position: "absolute", right: "0px", width: "500px"}}>
    <button onClick={pause}>{paused ? "Resume" : "Pause"}</button>
    <GameInfo game={game} />
  </div>);
}

const div = document.createElement("div");
document.body.appendChild(div);
setTimeout(() => {
  yareio.init(div);
});

ReactDOM.render(
  <App />,
  div,
);
