import {EnergyTargetPool} from "../role/target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../role/target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../role/target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../role/target/EnemySpiritTargetPool";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {Role, RoleType} from "../role/Role";
import {RoleAssigner} from "../role/RoleAssigner";
import {addInstanceToGlobal, globals} from "./globals";
import {Runner} from "../runner/Runner";
import {TargetPoolType} from "../role/target/TargetPool";
import {MAX_DEFENDERS, MAX_HARVESTERS} from "../constants";

export function initGlobals() {
  globals.targetPools = {
    [TargetPoolType.Energy]: addInstanceToGlobal(new EnergyTargetPool(`${TargetPoolType.Energy}`)),
    [TargetPoolType.EnergyStorage]: addInstanceToGlobal(new EnergyStorageTargetPool(`${TargetPoolType.EnergyStorage}`)),
    [TargetPoolType.EnemyBase]: addInstanceToGlobal(new EnemyBaseTargetPool(`${TargetPoolType.EnemyBase}`)),
    [TargetPoolType.EnemySpirit]: addInstanceToGlobal(new EnemySpiritTargetPool(`${TargetPoolType.EnemySpirit}`)),
  };

  globals.tasks = {
    [TaskType.BasicCharge]: addInstanceToGlobal(new BasicChargeTask(`${TaskType.BasicCharge}`, {
      type: TaskType.BasicCharge,
      targetPool: globals.targetPools[TargetPoolType.Energy],
    })),
    [TaskType.BasicStore]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BasicStore}`, {
      type: TaskType.BasicStore,
      targetPool: globals.targetPools[TargetPoolType.EnergyStorage],
    })),
    [TaskType.BasicBaseDefend]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BasicBaseDefend}`, {
      type: TaskType.BasicBaseDefend,
      targetPool: globals.targetPools[TargetPoolType.EnemySpirit] as any,
    })),
    [TaskType.BasicBaseAttack]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BasicBaseAttack}`, {
      type: TaskType.BasicBaseAttack,
      targetPool: globals.targetPools[TargetPoolType.EnemyBase],
    })),
  }

  globals.roles = {
    [RoleType.BasicHarvester]: addInstanceToGlobal(new Role(`${RoleType.BasicHarvester}`, {
      type: RoleType.BasicHarvester,
      tasks: [globals.tasks[TaskType.BasicCharge], globals.tasks[TaskType.BasicStore]],
      maxSpirits: MAX_HARVESTERS,
    })),
    [RoleType.BasicDefender]: addInstanceToGlobal(new Role(`${RoleType.BasicDefender}`, {
      type: RoleType.BasicDefender,
      tasks: [globals.tasks[TaskType.BasicCharge], globals.tasks[TaskType.BasicBaseDefend]],
      maxSpirits: MAX_DEFENDERS,
    })),
    [RoleType.BasicAttacker]: addInstanceToGlobal(new Role(`${RoleType.BasicAttacker}`, {
      type: RoleType.BasicAttacker,
      tasks: [globals.tasks[TaskType.BasicCharge], globals.tasks[TaskType.BasicBaseAttack]],
      maxSpirits: -1,
    })),
  }

  globals.assigner = addInstanceToGlobal(new RoleAssigner("one"));

  globals.runner = addInstanceToGlobal(new Runner("one"));
}
