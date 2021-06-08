import {initGlobals} from "../globals/initGlobals";
import {initMemory} from "../globals/initMemory";
import {RoleRunner} from "../runner/RoleRunner";
import {RoleAssigner} from "../runner/assigner/RoleAssigner";

initGlobals();

const runner = new RoleRunner("one", new RoleAssigner("one"));

if (!("tick" in memory)) {
  initMemory();
  runner.init();
}

runner.run();
