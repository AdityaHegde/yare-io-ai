import {TargetPool, TargetPoolType} from "./TargetPool";
import {EnergyWrapper} from "../../wrappers/EnergyWrapper";
import {instanceSetInMemory} from "../../memory/instanceSetInMemory";
import {MemorySet} from "../../memory/MemorySet";
import {globals} from "../../globals/globals";
import {getDistance} from "../../utils/GridUtils";

export class EnergyTargetPool extends TargetPool<Energy, EnergyWrapper> {
  @instanceSetInMemory(EnergyWrapper)
  public targets: MemorySet<EnergyWrapper>;

  public static tag = TargetPoolType.Energy;

  protected getInitialTargets() {
    return [globals.baseStar];
  }
}
