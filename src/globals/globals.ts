import {EnergyTargetPool} from "../target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../target/EnemySpiritTargetPool";
import {Role, RoleType} from "../role/Role";
import {BaseClass} from "../BaseClass";
import {BaseWrapper} from "../wrappers/BaseWrapper";
import {RoleAssigner} from "../role/RoleAssigner";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {Runner} from "../runner/Runner";

export const globals: {
  targetPools?: {
    "Energy": EnergyTargetPool;
    "EnergyStorage": EnergyStorageTargetPool;
    "EnemyBase": EnemyBaseTargetPool;
    "EnemySpirit": EnemySpiritTargetPool;
  };
  tasks?: {
    [TaskType.BasicCharge]: BasicChargeTask,
    [TaskType.BasicStore]: BasicDischargeTask,
    [TaskType.BasicBaseAttack]: BasicDischargeTask,
  };
  roles?: {
    [RoleType.BasicHarvester]: Role,
    [RoleType.BasicAttacker]: Role,
  };
  assigner?: RoleAssigner;
  runner?: Runner;
  instances: Record<string, Record<string, BaseClass>>;
} = {
  instances: {},
};

export function addInstanceToGlobal<T extends BaseClass>(instance: T): T {
  const BaseClazz: typeof BaseClass = instance.constructor as typeof BaseClass;
  if (!this.globals.instances[BaseClazz.memoryName]) {
    this.globals.instances[BaseClazz.memoryName] = {};
  }

  if (!this.globals.instances[BaseClazz.memoryName][instance.id]) {
    this.globals.instances[BaseClazz.memoryName][instance.id] = instance;
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
