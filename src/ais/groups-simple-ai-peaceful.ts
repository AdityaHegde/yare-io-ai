import {GroupRunner} from "../runner/GroupRunner";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";
import {getBaseGroupRunnerConfig, getHarvesterOnlyGroupAssignerConfig} from "../runner/factory/groupRunnerFactory";

new GroupRunner(
  "two",
  new GroupAssigner(
    "two",
    getHarvesterOnlyGroupAssignerConfig(),
  ),
  {
    ...getBaseGroupRunnerConfig(),
    forceHarvesterNonHybrid: true,
  },
).run();
