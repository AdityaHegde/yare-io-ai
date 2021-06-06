import {Task} from "./Task";
import {EnergyWrapper} from "../../wrappers/EnergyWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {Log} from "../../utils/Logger";

@Log
export class BasicChargeTask extends Task<Energy, EnergyWrapper> {
  protected processSpiritCore(spirit: SpiritWrapper, target: EnergyWrapper) {
    spirit.energize(spirit.entity);
  }

  protected taskIsComplete(spirit: SpiritWrapper, target: EnergyWrapper): boolean {
    return spirit.isFull();
  }
}
