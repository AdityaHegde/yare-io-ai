import React from "react";
import ReactDOM from "react-dom";
import {Game, GameRunner, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {SideBar} from "@adityahegde/yare-io-local/dist/react-components"
import {BoardRenderer} from "@adityahegde/yare-io-local/dist/renderer/graphics";
import {IframeRunner} from "@adityahegde/yare-io-local/dist/runner/IframeRunner";

const div = document.createElement("div");
document.body.appendChild(div);

const game = new Game([SpiritType.Circle, SpiritType.Circle]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    new IframeRunner("http://localhost:8001/yare.js"),
    new IframeRunner("http://localhost:8000/yare.js"),
  ]),
  new BoardRenderer(game, div),
  { runIntervalInMs: 50 },
);

setTimeout(() => {
  yare.init().then(() => yare.resume());
});

ReactDOM.render(
  <SideBar game={game} yare={yare} />,
  div,
);
