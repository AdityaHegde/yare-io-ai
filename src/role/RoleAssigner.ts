import {BaseClass} from "../BaseClass";
import {Memory} from "../memory/Memory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {globals} from "../globals/globals";
import {RoleType} from "./Role";
import {MAX_DEFENDERS, MAX_HARVESTERS} from "../constants";
import {Log} from "../utils/Logger";

@Log
@Memory("roleAssigner")
export class RoleAssigner extends BaseClass {
  public assign(spirit: SpiritWrapper) {
    const roleOrder = [
      globals.roles[RoleType.BasicHarvester],
      globals.roles[RoleType.BasicDefender],
      globals.roles[RoleType.BasicAttacker],
    ];

    for (let i = 0; i < roleOrder.length; i++) {
      if (roleOrder[i].maxSpirits === -1 || roleOrder[i].spiritsCount < roleOrder[i].maxSpirits) {
        this.logger.log(`${spirit.id} was assigned to "${roleOrder[i].type}"`);
        roleOrder[i].addSpirit(spirit);
        break;
      }
    }
  }
}
