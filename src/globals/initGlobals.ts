import {EnergyTargetPool} from "../target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../target/EnemySpiritTargetPool";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {Role, RoleType} from "../role/Role";
import {RoleAssigner} from "../role/RoleAssigner";
import {addInstanceToGlobal, globals} from "./globals";
import { Runner } from "../runner/Runner";

export function initGlobals() {
  [
    EnergyTargetPool, EnergyStorageTargetPool,
    EnemyBaseTargetPool, EnemySpiritTargetPool,
  ].forEach(
    TargetPoolClass => globals.targetPools[TargetPoolClass.tag] = addInstanceToGlobal(new TargetPoolClass(TargetPoolClass.tag)) as any
  );

  globals.tasks = {
    [TaskType.BasicCharge]: addInstanceToGlobal(new BasicChargeTask(`${TaskType.BasicCharge}`, {
      type: TaskType.BasicCharge,
      targetPool: globals.targetPools.Energy,
    })),
    [TaskType.BasicStore]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BasicStore}`, {
      type: TaskType.BasicStore,
      targetPool: globals.targetPools.EnergyStorage,
    })),
    [TaskType.BasicBaseAttack]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BasicStore}`, {
      type: TaskType.BasicBaseAttack,
      targetPool: globals.targetPools.EnemyBase,
    })),
  }

  globals.roles = {
    [RoleType.BasicHarvester]: addInstanceToGlobal(new Role(`${RoleType.BasicHarvester}`, {
      type: RoleType.BasicHarvester,
      tasks: [globals.tasks[TaskType.BasicCharge], globals.tasks[TaskType.BasicStore]],
    })),
    [RoleType.BasicAttacker]: addInstanceToGlobal(new Role(`${RoleType.BasicHarvester}`, {
      type: RoleType.BasicAttacker,
      tasks: [globals.tasks[TaskType.BasicCharge], globals.tasks[TaskType.BasicBaseAttack]],
    })),
  }

  globals.assigner = addInstanceToGlobal(new RoleAssigner("one"));

  globals.runner = addInstanceToGlobal(new Runner("one"));
}
