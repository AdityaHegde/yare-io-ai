import {SpiritGroup} from "./SpiritGroup";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {findInArray} from "../utils/MathUtils";
import {RoleType} from "../role/Role";

/**
 * Abstraction for groups with different slots that can fit spirits
 * Each slot works as different group.
 */
export class SlottedGroup extends SpiritGroup {
  @inMemory()
  public slots: Array<Position>;

  @inMemory()
  public spiritCountBySlot: Array<number>;

  @inMemory()
  public spiritIdsBySlot: Array<Array<string>>;

  public init() {
    this.slots = this.getSlots();
    this.spiritCountBySlot = this.slots.map(_ => 0);
    this.spiritIdsBySlot = this.slots.map(_ => []);
  }

  public addSpirit(spiritWrapper: SpiritWrapper) {
    const idx = this.getFreeSlot();
    if (idx === -1) {
      return;
    }

    spiritWrapper.role = RoleType.Group;
    spiritWrapper.task = idx;
    this.spiritCountBySlot[idx]++;
    this.totalSpiritCount++;
    this.spiritIdsBySlot[idx].push(spiritWrapper.id);
  }

  public removeSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = RoleType.Free;
    spiritWrapper.task = 0;
    this.spiritCountBySlot[spiritWrapper.task]--;
    this.totalSpiritCount--;
    const idx = this.spiritIdsBySlot[spiritWrapper.task].indexOf(spiritWrapper.id);
    this.spiritIdsBySlot[spiritWrapper.task].splice(idx, 1);
  }

  protected getSlots(): Array<Position> {
    return [];
  }

  protected getFreeSlot(): number {
    const [, idx] = findInArray(this.spiritCountBySlot);
    return idx;
  }
}
