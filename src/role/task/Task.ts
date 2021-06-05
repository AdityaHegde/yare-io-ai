import {BaseClass} from "../../BaseClass";
import {TargetPool} from "../../target/TargetPool";
import {BaseWrapper} from "../../wrappers/BaseWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {getDistance} from "../../utils/getDistance";
import {DISTANCE} from "../../constants";

export enum TaskType {
  BasicCharge,
  BasicStore,
  BasicBaseAttack,
}

export class Task<EntityType extends Intractable, WrapperType extends BaseWrapper<EntityType>> extends BaseClass {
  public type: TaskType;
  public clearTarget = true;

  public targetPool: TargetPool<EntityType, WrapperType>;

  constructor(id: string, {
    type, targetPool,
  }: {
    type: TaskType,
    targetPool: TargetPool<EntityType, WrapperType>,
  }) {
    super(id);
    this.targetPool = targetPool;
  }

  public processSpirit(spirit: SpiritWrapper): boolean {
    if (!spirit.targetId) {
      if (!this.targetPool.hasTargets()) {
        return false;
      }

      spirit.targetId = this.targetPool.getNextTarget();
    }

    const target = this.targetPool.targets.get(spirit.targetId);

    if (!target) {
      spirit.targetId = null;
      return false;
    }

    if (getDistance(spirit.entity, target.entity) <= DISTANCE) {
      const done = this.processSpiritCore(spirit, target);
      if (done && this.clearTarget) {
        spirit.targetId = null;
      }
      return done;
    } else {
      spirit.move(target.entity.position);
    }

    return false;
  }

  protected processSpiritCore(spirit: SpiritWrapper, target: WrapperType): boolean {
    return false;
  }
}
