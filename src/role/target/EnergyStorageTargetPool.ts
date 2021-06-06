import {TargetPool, TargetPoolType} from "./TargetPool";
import {StructureWrapper} from "../../wrappers/StructureWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {instanceSetInMemory} from "../../memory/instanceSetInMemory";
import {MemorySet} from "../../memory/MemorySet";

export class EnergyStorageTargetPool extends TargetPool<Base, StructureWrapper> {
  @instanceSetInMemory(StructureWrapper)
  public targets: MemorySet<StructureWrapper>;

  public static tag = TargetPoolType.EnergyStorage;

  protected getInitialTargets() {
    return [new StructureWrapper(base)];
  }
}