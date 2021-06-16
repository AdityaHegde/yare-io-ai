import {SingleGroup} from "./SingleGroup";
import {getSpiritWrapper, globals} from "../globals/globals";
import {attackInRange} from "../utils/SpiritUtils";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {isWithinRange} from "../utils/GridUtils";

export class SimpleHarvester extends SingleGroup {
  public run() {
    this.spiritIds.forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);

      if (!attackInRange(spiritWrapper)) {
        this.takeAction(spiritWrapper);
      }

      this.moveSpirit(spiritWrapper);
    });
  }

  /**
   * 0 - Deposit into base
   * 1 - Moving towards star.
   * 2 - Mine star
   * 3 - Move towards final link.
   */
  private moveSpirit(spiritWrapper: SpiritWrapper) {
    const switchTaskConditions = [
      () => !spiritWrapper.hasEntropy(),
      () => isWithinRange(spiritWrapper.entity, globals.baseStar),
      () => spiritWrapper.isEntropyFull(),
      () => isWithinRange(spiritWrapper.entity, base),
    ];

    if (switchTaskConditions[spiritWrapper.task]()) {
      spiritWrapper.task = (spiritWrapper.task + 1) % switchTaskConditions.length;
    }

    const moveToSlots = [
      globals.baseStar, globals.baseStar, base, base,
    ];

    if (!isWithinRange(spiritWrapper.entity, moveToSlots[spiritWrapper.task])) {
      spiritWrapper.move(moveToSlots[spiritWrapper.task].position);
    }
  }

  private takeAction(spiritWrapper: SpiritWrapper) {
    switch (spiritWrapper.task) {
      case 0:
        spiritWrapper.energize(spiritWrapper.entity);
        break;
      case 2:
        spiritWrapper.energize(base);
        break;
    }
  }
}
