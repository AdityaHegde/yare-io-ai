import {GroupRunner} from "../runner/GroupRunner";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";
import {getBaseGroupAssignerConfig, getBaseGroupRunnerConfig} from "../runner/factory/groupRunnerFactory";

new GroupRunner(
  "one",
  new GroupAssigner(
    "one",
    getBaseGroupAssignerConfig(),
  ),
  {
    ...getBaseGroupRunnerConfig(),
    forceHarvesterNonHybrid: true,
  },
).run();
