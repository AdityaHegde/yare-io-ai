import {BaseClass} from "../BaseClass";
import {Memory} from "../memory/Memory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {inMemory} from "../memory/inMemory";
import {getSpiritWrapper} from "../globals/globals";

@Memory("groups")
export class SpiritGroup extends BaseClass {
  @inMemory(() => 0)
  public totalSpiritCount: number;

  public init() {}

  public run() {}

  public addSpirit(spiritWrapper: SpiritWrapper) {}

  public removeSpirit(spiritWrapper: SpiritWrapper) {}

  public removeSpirits(count: number): Array<SpiritWrapper> {
    return [];
  }

  public hasSpace() {
    return true;
  }

  protected checkAlive(spiritWrapper: SpiritWrapper) {
    if (!spiritWrapper.checkAlive()) {
      this.removeSpirit(spiritWrapper);
      return false;
    }
    return true;
  }

  protected filterDeadSpirits(spiritIds: Array<string>) {
    return spiritIds.filter((spiritId) => {
      const spirit = spirits[spiritId];

      if (spirit.hp <= 0) {
        const spiritWrapper = getSpiritWrapper(spiritId);
        this.removeSpirit(spiritWrapper);
        spiritWrapper.destroy();
        return false;
      }

      return true;
    });
  }

  protected mergeSpirits(spiritIds: Array<string>, mergeCount: number) {
    if (spiritIds.length <= mergeCount) {
      return spiritIds;
    }
    const newIds = [];
    const lastIdx = Math.floor(spiritIds.length / mergeCount) * mergeCount;
    for (let i = 0, j = 0, k = 0; i < lastIdx; i++, j = (j + 1) % mergeCount) {
      if (j !== 0) {
        spirits[spiritIds[i]].merge(spirits[spiritIds[i - j]]);
      } else {
        newIds.push(spiritIds[i]);
      }
    }
    for (let i = lastIdx; i < spiritIds.length; i++) {
      newIds.push(spiritIds[i]);
    }

    return newIds;
  }
}
