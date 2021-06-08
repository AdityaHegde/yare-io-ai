import {initGlobals} from "../globals/initGlobals";
import {initMemory} from "../globals/initMemory";
import {GroupRunner} from "../runner/GroupRunner";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";

initGlobals();

const runner = new GroupRunner("one", new GroupAssigner("one"));

if (!("tick" in memory)) {
  initMemory();
  runner.init();
}

runner.run();
