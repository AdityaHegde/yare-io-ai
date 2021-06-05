import {Task} from "./Task";
import {StructureWrapper} from "../../wrappers/StructureWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {EnergyWrapper} from "../../wrappers/EnergyWrapper";

export class BasicDischargeTask extends Task<Base, StructureWrapper> {
  protected processSpiritCore(spirit: SpiritWrapper, target: EnergyWrapper): boolean {
    if (spirit.isEmpty()) {
      return false;
    }
    spirit.energize(spirit.entity);
    return true;
  }
}
