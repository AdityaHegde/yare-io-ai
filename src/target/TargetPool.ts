import {BaseClass} from "../BaseClass";
import {Memory} from "../memory/Memory";
import {BaseWrapper} from "../wrappers/BaseWrapper";
import {MemorySet} from "../memory/MemorySet";

export type TargetPoolTag = ("Energy" | "EnergyStorage" | "EnemyBase" | "EnemySpirit");

@Memory("targetPools")
export class TargetPool<EntityType extends Intractable, WrapperType extends BaseWrapper<EntityType>> extends BaseClass {
  public targets: MemorySet<WrapperType>;
  public static tag: TargetPoolTag;

  public init() {
    this.getInitialTargets().forEach(target => this.targets.add(target));
  }

  public hasTargets() {
    return this.targets.size > 0;
  }

  public getNextTarget() {
    return this.targets.values()[0];
  }

  protected getInitialTargets() {
    return [];
  }
}
