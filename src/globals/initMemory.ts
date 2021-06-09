import {initBaseStar} from "./initGlobals";
import {getDistance} from "../utils/GridUtils";

export function initMemory() {
  memory.tick = memory.lastSeenTick = 0;
  memory.ids = {};
  memory.baseStar = getDistance(base, star_a1c) > getDistance(base, star_zxq) ? "star_zxq" : "star_a1c";
  memory.uniqueEnemies = [];
}
