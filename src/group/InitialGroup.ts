import {getSpiritWrapper} from "../globals/globals";
import {isWithinRange} from "../utils/GridUtils";
import {Log} from "../utils/Logger";
import {SingleGroup} from "./SingleGroup";

/**
 * Initial group of spirits that need to drop off energy to base.
 * Any newly created spirit assigned to harvester will go here.
 */
@Log
export class InitialGroup extends SingleGroup {
  public run() {
    this.spiritIds.forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);

      if (!this.checkAlive(spiritWrapper)) {
        return;
      }

      if (spiritWrapper.isEmpty()) {
        this.removeSpirit(spiritWrapper);
      } else {
        if (isWithinRange(spiritWrapper.entity, base)) {
          spiritWrapper.energize(base);
        } else {
          spiritWrapper.move(base.position);
        }
      }
    });
  }
}
