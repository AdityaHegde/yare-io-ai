import {globals} from "./globals";
import {initBaseStar} from "./initGlobals";
import {getDistance} from "../utils/GridUtils";

export function initMemory() {
  memory.tick = memory.lastSeenTick = 0;
  memory.ids = {};
  memory.baseStar = getDistance(base, star_a1c) > getDistance(base, star_zxq) ? "star_zxq" : "star_a1c";
  initBaseStar();

  // Object.values(globals.targetPools).forEach(targetPool => targetPool.init());

  Object.values(globals.groups).forEach(group => group.init());
}
