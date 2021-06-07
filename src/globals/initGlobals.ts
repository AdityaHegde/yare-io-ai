import {EnergyTargetPool} from "../role/target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../role/target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../role/target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../role/target/EnemySpiritTargetPool";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {Role, RoleType} from "../role/Role";
import {addInstanceToGlobal, globals} from "./globals";
import {TargetPoolType} from "../role/target/TargetPool";
import {MAX_DEFENDERS, MAX_HARVESTERS} from "../constants";
import {InitialGroup} from "../group/InitialGroup";
import {HarvestChain} from "../group/HarvestChain";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";
import {GroupRunner} from "../runner/GroupRunner";
import {SentryLine} from "../group/SentryLine";
import {DefenceArmy} from "../group/DefenceArmy";

export function initGlobals() {
  initBaseStar();

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
  };

  globals.groups = [
    new InitialGroup("init", {maxSpirits: -1}),
    new HarvestChain("chain"),
    new SentryLine("sentry"),
    new DefenceArmy("defence", {maxSpirits: -1}),
  ];

  globals.runner = addInstanceToGlobal(new GroupRunner("one", new GroupAssigner("group")));
}

export function initBaseStar() {
  globals.base_star = {
    "star_zxq": star_zxq,
    "star_a1c": star_a1c,
  }[memory.base_star];
}
