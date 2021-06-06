import {Task} from "./Task";
import {StructureWrapper} from "../../wrappers/StructureWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {Log} from "../../utils/Logger";

@Log
export class BasicDischargeTask extends Task<Base, StructureWrapper> {
  protected processSpiritCore(spirit: SpiritWrapper, target: SpiritWrapper | StructureWrapper) {
    spirit.energize(target.entity);
  }

  protected taskIsComplete(spirit: SpiritWrapper, target: SpiritWrapper | StructureWrapper): boolean {
    return spirit.isEmpty();
  }
}
