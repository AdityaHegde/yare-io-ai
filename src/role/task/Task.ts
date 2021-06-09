import {BaseClass} from "../../BaseClass";
import {TargetPool} from "../target/TargetPool";
import {BaseWrapper} from "../../wrappers/BaseWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {isWithinRange} from "../../utils/GridUtils";

export enum TaskType {
  Charge,
  Store,
  BaseDefend,
  BaseAttack,
  Rally,
}

export class Task<EntityType extends Intractable, WrapperType extends BaseWrapper<EntityType>> extends BaseClass {
  public type: TaskType;

  public targetPool: TargetPool<EntityType, WrapperType>;

  constructor(id: string, {
    type, targetPool,
  }: {
    type: TaskType,
    targetPool: TargetPool<EntityType, WrapperType>,
  }) {
    super(id);
    this.type = type;
    this.targetPool = targetPool;
  }

  public processSpirit(spiritWrapper: SpiritWrapper): boolean {
    let target;

    if (!spiritWrapper.targetId) {
      if (!this.targetPool.hasTargets()) {
        return true;
      }

      target = this.targetPool.getNextTarget();
      spiritWrapper.targetId = target && target.entity && target.entity.id;
    } else {
      target = this.targetPool.targets.get(spiritWrapper.targetId);
    }

    if (!target) {
      spiritWrapper.targetId = "";
      return false;
    }

    if (this.taskIsComplete(spiritWrapper, target)) {
      return true;
    }
    if (isWithinRange(spiritWrapper.entity, target.entity)) {
      this.processSpiritCore(spiritWrapper, target);
    } else {
      spiritWrapper.move(target.entity.position);
    }

    return this.taskIsComplete(spiritWrapper, target);
  }

  protected processSpiritCore(spirit: SpiritWrapper, target: WrapperType) {}

  protected taskIsComplete(spirit: SpiritWrapper, target: WrapperType): boolean {
    return false;
  }
}
