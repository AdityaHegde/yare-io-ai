import {
  getBaseGroupAssignerConfig,
  getBaseGroupRunnerConfig,
  getHarvesterOnlyGroupAssignerConfig
} from "../runner/groupRunnerFactory";
import {GroupRunner} from "../runner/GroupRunner";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";

new GroupRunner(
  "one",
  new GroupAssigner(
    "one",
    {
      ...getBaseGroupAssignerConfig(),
      enableMiddleHarvesting: false, enableHarasser: false, enableAttack: false,
    },
  ),
  getBaseGroupRunnerConfig(),
).run();
