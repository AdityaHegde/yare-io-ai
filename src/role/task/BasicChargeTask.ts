import {Task, TaskType} from "./Task";
import {EnergyWrapper} from "../../wrappers/EnergyWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";

export class BasicChargeTask extends Task<Energy, EnergyWrapper> {
  protected processSpiritCore(spirit: SpiritWrapper, target: EnergyWrapper): boolean {
    if (spirit.isFull()) {
      return false;
    }
    spirit.energize(spirit.entity);
    return true;
  }
}
