import {initGlobals} from "./globals/initGlobals";
import {initMemory} from "./globals/initMemory";
import {globals} from "./globals/globals";

export function runLoop() {
  initGlobals();

  if (!memory.init) {
    initMemory();
  }

  globals.runner.run();
}