import {globals} from "./globals";
import {initBaseStar} from "./initGlobals";
import {getDistance} from "../utils/GridUtils";

export function initMemory() {
  memory.init = true;
  memory.ids = {};
  memory.base_star = getDistance(base, star_a1c) > getDistance(base, star_zxq) ? "star_zxq" : "star_a1c";
  initBaseStar();

  for (const targetPoolTag in globals.targetPools) {
    globals.targetPools[targetPoolTag].init();
  }

  globals.groups.forEach(group => group.init());
}
