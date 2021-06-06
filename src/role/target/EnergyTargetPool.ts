import {TargetPool, TargetPoolType} from "./TargetPool";
import {EnergyWrapper} from "../../wrappers/EnergyWrapper";
import {getDistance} from "../../utils/getDistance";
import {instanceSetInMemory} from "../../memory/instanceSetInMemory";
import {MemorySet} from "../../memory/MemorySet";

export class EnergyTargetPool extends TargetPool<Energy, EnergyWrapper> {
  @instanceSetInMemory(EnergyWrapper)
  public targets: MemorySet<EnergyWrapper>;

  public static tag = TargetPoolType.Energy;

  protected getInitialTargets() {
    if (getDistance(base, star_a1c) > getDistance(base, star_zxq)) {
      return [new EnergyWrapper(star_zxq)];
    } else {
      return [new EnergyWrapper(star_a1c)];
    }
  }
}
