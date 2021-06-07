import {Runner} from "./Runner";
import {getSpiritWrapper, globals} from "../globals/globals";
import {RoleType} from "../role/Role";

export class RoleRunner extends Runner {
  public runCore() {
    for (const spirit of my_spirits) {
      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (!spiritWrapper.checkAlive()) {
        // this.logger.log(`${spiritWrapper.entity.id} has died.`);
        if (spiritWrapper.role) {
          globals.roles[spiritWrapper.role].removeSpirit(spiritWrapper);
        }
        return;
      }

      if (spiritWrapper.role === RoleType.Free) {
        // this.logger.log(`${spiritWrapper.entity.id} is free.`);
        this.assigner.assign(spiritWrapper);
      }

      if (spiritWrapper.role in globals.roles) {
        globals.roles[spiritWrapper.role].processSpirit(spiritWrapper);
      }
    }
  }
}
