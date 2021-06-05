import {initMemory} from "./globals/initMemory";
import {initGlobals} from "./globals/initGlobals";
import {globals} from "./globals/globals";

initGlobals();

if (!memory.init) {
  initMemory();
}

globals.runner.run();
