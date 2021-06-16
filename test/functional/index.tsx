import React from "react";
import ReactDOM from "react-dom";
import {Game, GameRunner, MapData, MapGenerator, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {SideBar} from "@adityahegde/yare-io-local/dist/react-components"
import {BoardRenderer} from "@adityahegde/yare-io-local/dist/renderer/graphics";
import {IframeRunner} from "@adityahegde/yare-io-local/dist/runner/IframeRunner";

const div = document.createElement("div");
document.body.appendChild(div);

const opts: Record<string, string> = {};
location.search.replace(/^\?/, "").split("&").forEach((arg) => {
  const [key, value] = arg.split("=");
  opts[key] = value;
});

const playerOne = opts.one || "groups-ai";
const playerTwo = opts.two || "groups-ai-simple";

const game = new Game([SpiritType.Circle, SpiritType.Circle]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    new IframeRunner(`http://localhost:8000/${playerOne}.js`),
    new IframeRunner(`http://localhost:8000/${playerTwo}.js`),
  ]),
  new BoardRenderer(game, div),
  new MapGenerator(MapData.getBasicMapData()),
  { runIntervalInMs: 50, pauseOnError: true },
);

setTimeout(() => {
  yare.init().then(() => yare.resume());
});

ReactDOM.render(
  <SideBar game={game} yare={yare} />,
  div,
);
