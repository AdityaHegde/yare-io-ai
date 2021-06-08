import {BaseClass} from "../../BaseClass";
import {Memory} from "../../memory/Memory";
import {BaseWrapper} from "../../wrappers/BaseWrapper";
import {MemorySet} from "../../memory/MemorySet";

export enum TargetPoolType {
  Energy,
  EnergyStorage,
  EnemyBase,
  EnemySpirit,
}

@Memory("targetPools")
export class TargetPool<EntityType extends Intractable, WrapperType extends BaseWrapper<EntityType>> extends BaseClass {
  public targets: MemorySet<WrapperType>;
  public static type: TargetPoolType;

  public init() {
    this.addTargets(this.getInitialTargets());
  }

  public hasTargets() {
    return this.targets.size > 0;
  }

  public getNextTarget() {
    return this.targets.values().next().value;
  }

  public updateTargets() {
    this.addTargets(this.getUpdatedTargets());
  }

  public addTarget(target: WrapperType) {
    this.targets.add(target);
  }
  public removeTarget(target: WrapperType) {
    this.targets.delete(target);
  }

  protected getInitialTargets() {
    return [];
  }

  protected getUpdatedTargets() {
    return [];
  }

  protected addTargets(targets: Array<WrapperType>) {
    targets.forEach(target => this.targets.add(target));
  }
}
