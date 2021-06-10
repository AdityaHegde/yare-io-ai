import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {RoleType} from "../../role/Role";
import {Log} from "../../utils/Logger";
import {Assigner} from "./Assigner";
import {RolesMapType} from "../../role/RolesMapType";

export type RoleAssignerConfig = {
  harvestersThreshold: number;
}

@Log
export class RoleAssigner extends Assigner<RoleAssignerConfig> {
  public roles: RolesMapType;

  public assign(spiritWrapper: SpiritWrapper) {
    if (this.roles[RoleType.Harvester].spiritsCount < this.config.harvestersThreshold) {
      this.roles[RoleType.Harvester].addSpirit(spiritWrapper);
      return;
    }

    const roleOrder = [
      this.roles[RoleType.Defender],
      this.roles[RoleType.Attacker],
      this.roles[RoleType.Harvester],
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
