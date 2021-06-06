import {BaseClass} from "../../BaseClass";
import {TargetPool} from "../target/TargetPool";
import {BaseWrapper} from "../../wrappers/BaseWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {isWithinRange} from "../../utils/getDistance";

export enum TaskType {
  BasicCharge,
  BasicStore,
  BasicBaseDefend,
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
    let target;

    if (!spirit.targetId) {
      if (!this.targetPool.hasTargets()) {
        return true;
      }

      target = this.targetPool.getNextTarget();
      spirit.targetId = target.entity.id;
    } else {
      target = this.targetPool.targets.get(spirit.targetId);
    }

    // this.logger.log(`spirit.targetId=${spirit.targetId} target.entity.id=${target?.entity?.id}`);

    if (!target) {
      spirit.targetId = "";
      return false;
    }

    // this.logger.log(`source=${JSON.stringify(spirit.entity.position)} target=${JSON.stringify(target.entity.position)}`);
    if (this.taskIsComplete(spirit, target)) {
      return true;
    }
    if (isWithinRange(spirit.entity, target.entity)) {
      this.processSpiritCore(spirit, target);
    } else {
      spirit.move(target.entity.position);
    }

    return this.taskIsComplete(spirit, target);
  }

  protected processSpiritCore(spirit: SpiritWrapper, target: WrapperType) {}

  protected taskIsComplete(spirit: SpiritWrapper, target: WrapperType): boolean {
    return false;
  }
}
