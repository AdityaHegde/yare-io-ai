import {TargetPool, TargetPoolTag} from "./TargetPool";
import {StructureWrapper} from "../wrappers/StructureWrapper";
import {MemorySet} from "../memory/MemorySet";
import {instanceSetInMemory} from "../memory/instanceSetInMemory";

export class EnemyBaseTargetPool extends TargetPool<Base, StructureWrapper> {
  @instanceSetInMemory(StructureWrapper)
  public targets: MemorySet<StructureWrapper>;

  public static tag: TargetPoolTag = "EnemyBase";

  protected getInitialTargets() {
    return [new StructureWrapper(enemy_base)];
  }
}
