import {BaseClass} from "../BaseClass";
import {getWrapperInstance, globals} from "../globals/globals";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {RoleType} from "../role/Role";
import {Log} from "../utils/Logger";

@Log
export class Runner extends BaseClass {
  public run() {
    for (const spirit of my_spirits) {
      const spiritWrapper = getWrapperInstance(SpiritWrapper as any, spirit) as SpiritWrapper;

      if (!spiritWrapper.checkAlive()) {
        this.logger.log(`${spiritWrapper.entity.id} has died.`);
        if (spiritWrapper.role) {
          globals.roles[spiritWrapper.role].removeSpirit(spiritWrapper);
        }
        return;
      }

      if (spiritWrapper.role === RoleType.Free) {
        this.logger.log(`${spiritWrapper.entity.id} is free.`);
        globals.assigner.assign(spiritWrapper);
      }

      globals.roles[spiritWrapper.role].processSpirit(spiritWrapper);
    }
  }
}
