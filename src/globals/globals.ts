import {EnergyTargetPool} from "../role/target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../role/target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../role/target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../role/target/EnemySpiritTargetPool";
import {Role, RoleType} from "../role/Role";
import {BaseClass} from "../BaseClass";
import {BaseWrapper} from "../wrappers/BaseWrapper";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {TargetPoolType} from "../role/target/TargetPool";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {InitialGroup} from "../group/InitialGroup";
import {HarvestChain} from "../group/HarvestChain";
import {SentryLine} from "../group/SentryLine";
import {PatrolArmy} from "../group/PatrolArmy";
import {RallyTask} from "../role/task/RallyTask";
import {SpiritGroupType} from "../group/SpiritGroupType";

export const globals: {
  targetPools?: {
    [TargetPoolType.Energy]: EnergyTargetPool;
    [TargetPoolType.EnergyStorage]: EnergyStorageTargetPool;
    [TargetPoolType.EnemyBase]: EnemyBaseTargetPool;
    [TargetPoolType.EnemySpirit]: EnemySpiritTargetPool;
  };
  tasks?: {
    [TaskType.Charge]: BasicChargeTask,
    [TaskType.Store]: BasicDischargeTask,
    [TaskType.BaseDefend]: BasicDischargeTask,
    [TaskType.Rally]: RallyTask,
    [TaskType.BaseAttack]: RallyTask,
  };
  roles?: {
    [RoleType.Harvester]: Role,
    [RoleType.Defender]: Role,
    [RoleType.Attacker]: Role,
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

  uniqueEnemiesSeen?: Set<string>;
  enemySeen?: boolean;

  enemiesTargeted?: Set<string>;

  instances?: Record<string, Record<string, BaseClass>>;
} = {};

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
