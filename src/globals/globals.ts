import {EnergyTargetPool} from "../role/target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../role/target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../role/target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../role/target/EnemySpiritTargetPool";
import {Role, RoleType} from "../role/Role";
import {BaseClass} from "../BaseClass";
import {BaseWrapper} from "../wrappers/BaseWrapper";
import {RoleAssigner} from "../runner/assigner/RoleAssigner";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {Runner} from "../runner/Runner";
import {TargetPoolType} from "../role/target/TargetPool";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {SpiritGroup, SpiritGroupType} from "../group/SpiritGroup";
import {GroupAssigner} from "../runner/assigner/GroupAssigner";
import {InitialGroup} from "../group/InitialGroup";
import {HarvestChain} from "../group/HarvestChain";
import {SentryLine} from "../group/SentryLine";
import {PatrolArmy} from "../group/PatrolArmy";

export const globals: {
  targetPools?: {
    [TargetPoolType.Energy]: EnergyTargetPool;
    [TargetPoolType.EnergyStorage]: EnergyStorageTargetPool;
    [TargetPoolType.EnemyBase]: EnemyBaseTargetPool;
    [TargetPoolType.EnemySpirit]: EnemySpiritTargetPool;
  };
  tasks?: {
    [TaskType.BasicCharge]: BasicChargeTask,
    [TaskType.BasicStore]: BasicDischargeTask,
    [TaskType.BasicBaseDefend]: BasicDischargeTask,
    [TaskType.BasicBaseAttack]: BasicDischargeTask,
  };
  roles?: {
    [RoleType.BasicHarvester]: Role,
    [RoleType.BasicDefender]: Role,
    [RoleType.BasicAttacker]: Role,
  };
  groups?: {
    [SpiritGroupType.InitialGroup]: InitialGroup,
    [SpiritGroupType.HarvestChain]: HarvestChain,
    [SpiritGroupType.SentryLine]: SentryLine,
    [SpiritGroupType.BaseDefenceArmy]: PatrolArmy,
    [SpiritGroupType.BaseAttackArmy]: PatrolArmy,
  };
  baseStar?: Energy;
  enemyStar?: Energy;
  enemySeen: boolean;
  instances: Record<string, Record<string, BaseClass>>;
} = {
  enemySeen: false,
  instances: {},
};

export function addInstanceToGlobal<T extends BaseClass>(instance: T): T {
  const BaseClazz: typeof BaseClass = instance.constructor as typeof BaseClass;
  if (!globals.instances[BaseClazz.memoryName]) {
    globals.instances[BaseClazz.memoryName] = {};
  }

  if (!globals.instances[BaseClazz.memoryName][instance.id]) {
    globals.instances[BaseClazz.memoryName][instance.id] = instance;
  }

  return instance;
}

export function getInstance<ReturnClass extends BaseClass>(BaseClazz: typeof BaseClass, id: string): ReturnClass {
  return addInstanceToGlobal(BaseClazz.getInstanceById(id)) as ReturnClass;
}

export function getWrapperInstance<EntityType extends Intractable>(
  BaseWrapperClazz: typeof BaseWrapper, entity: EntityType,
): BaseWrapper<EntityType> {
  return addInstanceToGlobal(BaseWrapperClazz.getInstanceByEntity(entity)) as BaseWrapper<EntityType>;
}

export function getSpiritWrapper(spiritId: string): SpiritWrapper {
  return getWrapperInstance(SpiritWrapper as any, spirits[spiritId]) as SpiritWrapper;
}
