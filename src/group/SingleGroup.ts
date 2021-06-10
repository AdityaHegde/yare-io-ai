import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {RoleType} from "../role/Role";
import {SpiritGroup} from "./SpiritGroup";
import {getSpiritWrapper} from "../globals/globals";

/**
 * Abstraction for groups where all spirits work together.
 */
export class SingleGroup extends SpiritGroup {
  @inMemory(() => [])
  public spiritIds: Array<string>;

  public maxSpirits: number;

  public addSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = RoleType.Group;
    this.spiritIds.push(spiritWrapper.id);
    this.totalSpiritCount++;
  }

  public removeSpirit(spiritWrapper: SpiritWrapper) {
    this.spiritIds.splice(this.spiritIds.indexOf(spiritWrapper.id), 1);
    this.totalSpiritCount--;

    spiritWrapper.role = RoleType.Free;
    spiritWrapper.task = 0;
  }

  public removeMissingSpirit(spiritId: string) {
    const idx = this.spiritIds.indexOf(spiritId);
    if (idx >= 0) {
      this.spiritIds.splice(idx, 1);
      this.totalSpiritCount--;
    }
  }

  public removeSpirits(count: number): Array<SpiritWrapper> {
    const removedSpiritWrapper: Array<SpiritWrapper> = [];

    for (let i = 0; i < count && i < this.spiritIds.length; i++) {
      const spiritId = this.spiritIds[i];

      if (spirits[spiritId].hp <= 0) {
        continue;
      }

      const spiritWrapper = getSpiritWrapper(spiritId);
      removedSpiritWrapper.push(spiritWrapper);
      this.removeSpirit(spiritWrapper);
    }

    return removedSpiritWrapper;
  }

  public hasSpace() {
    return this.maxSpirits !== -1 && this.totalSpiritCount < this.maxSpirits;
  }
}
