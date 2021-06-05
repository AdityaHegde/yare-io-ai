import {BaseClass} from "../BaseClass";
import {Memory} from "../memory/Memory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {globals} from "../globals/globals";
import {RoleType} from "./Role";
import {MAX_HARVESTERS} from "../constants";
import {Log} from "../utils/Logger";

@Log
@Memory("roleAssigner")
export class RoleAssigner extends BaseClass {
  public assign(spirit: SpiritWrapper) {
    if (globals.roles[RoleType.BasicHarvester].spiritsCount >= MAX_HARVESTERS) {
      this.logger.log(`${spirit.id} was assigned to "BasicAttacker"`);
      globals.roles[RoleType.BasicAttacker].addSpirit(spirit);
    } else {
      this.logger.log(`${spirit.id} was assigned to "BasicHarvester"`);
      globals.roles[RoleType.BasicHarvester].addSpirit(spirit);
    }
  }
}
