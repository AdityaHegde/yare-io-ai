import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {globals} from "../../globals/globals";
import {RoleType} from "../../role/Role";
import {Log} from "../../utils/Logger";
import {Assigner} from "./Assigner";

type RoleAssignerConfig = {
  harvestersThreshold: number;
}

@Log
export class RoleAssigner extends Assigner<RoleAssignerConfig> {
  public assign(spiritWrapper: SpiritWrapper) {
    if (globals.roles[RoleType.Harvester].spiritsCount < this.config.harvestersThreshold) {
      globals.roles[RoleType.Harvester].addSpirit(spiritWrapper);
      return;
    }

    const roleOrder = [
      globals.roles[RoleType.Defender],
      globals.roles[RoleType.Attacker],
      globals.roles[RoleType.Harvester],
    ];

    for (let i = 0; i < roleOrder.length; i++) {
      if (roleOrder[i].hasSpace()) {
        // this.logger.log(`${spiritWrapper.id} was assigned to "${roleOrder[i].type}"`);
        roleOrder[i].addSpirit(spiritWrapper);
        break;
      }
    }
  }
}
