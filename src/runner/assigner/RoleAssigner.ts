import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {globals} from "../../globals/globals";
import {RoleType} from "../../role/Role";
import {Log} from "../../utils/Logger";
import {Assigner} from "./Assigner";

@Log
export class RoleAssigner extends Assigner {
  public assign(spiritWrapper: SpiritWrapper) {
    const roleOrder = [
      globals.roles[RoleType.BasicHarvester],
      globals.roles[RoleType.BasicDefender],
      globals.roles[RoleType.BasicAttacker],
    ];

    for (let i = 0; i < roleOrder.length; i++) {
      if (roleOrder[i].maxSpirits === -1 || roleOrder[i].spiritsCount < roleOrder[i].maxSpirits) {
        this.logger.log(`${spiritWrapper.id} was assigned to "${roleOrder[i].type}"`);
        roleOrder[i].addSpirit(spiritWrapper);
        break;
      }
    }
  }
}
