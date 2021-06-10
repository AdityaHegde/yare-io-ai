import {BaseClass} from "../BaseClass";
import {BaseWrapper} from "../wrappers/BaseWrapper";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";

export const globals: {
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
