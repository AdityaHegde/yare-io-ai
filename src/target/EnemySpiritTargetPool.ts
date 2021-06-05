import {TargetPool, TargetPoolTag} from "./TargetPool";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {instanceSetInMemory} from "../memory/instanceSetInMemory";
import {MemorySet} from "../memory/MemorySet";

export class EnemySpiritTargetPool extends TargetPool<Spirit, SpiritWrapper> {
  @instanceSetInMemory(SpiritWrapper)
  public targets: MemorySet<SpiritWrapper>;

  public static tag: TargetPoolTag = "EnemySpirit";
}
