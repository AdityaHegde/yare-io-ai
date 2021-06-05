import {globals} from "./globals";

export function initMemory() {
  memory.init = true;
  memory.ids = {};

  for (const targetPoolTag in globals.targetPools) {
    globals.targetPools[targetPoolTag].init();
  }
}
