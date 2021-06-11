import {SpiritGroup} from "./SpiritGroup";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {findInArray} from "../utils/MathUtils";
import {RoleType} from "../role/Role";
import {getSpiritWrapper} from "../globals/globals";

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

  @inMemory()
  public spiritRatios: Array<number>;

  public init() {
    this.slots = this.getSlots();
    this.spiritCountBySlot = this.slots.map(_ => 0);
    this.spiritIdsBySlot = this.slots.map(_ => []);
    this.spiritRatios = this.getSpiritRatios();
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
    this.spiritCountBySlot[spiritWrapper.task]--;
    this.totalSpiritCount--;
    const idx = this.spiritIdsBySlot[spiritWrapper.task].indexOf(spiritWrapper.id);
    this.spiritIdsBySlot[spiritWrapper.task].splice(idx, 1);

    spiritWrapper.role = RoleType.Free;
    spiritWrapper.task = 0;
  }

  public removeMissingSpirit(spiritId: string) {
    for (let slotIdx = 0; slotIdx < this.spiritIdsBySlot.length; slotIdx++) {
      const idx = this.spiritIdsBySlot[slotIdx].indexOf(spiritId);
      if (idx >= 0) {
        this.spiritIdsBySlot[slotIdx].splice(idx, 1);
        break;
      }
    }
  }

  public removeSpirits(count: number): Array<SpiritWrapper> {
    const removedSpiritWrapper: Array<SpiritWrapper> = [];

    for (let i = 0, slotIdx = 0; i < count && i < this.totalSpiritCount; i++) {
      const spiritId = this.spiritIdsBySlot[slotIdx][this.spiritIdsBySlot[slotIdx].length - 1];

      const spiritWrapper = getSpiritWrapper(spiritId);
      removedSpiritWrapper.push(spiritWrapper);
      this.removeSpirit(spiritWrapper);

      let newSlotIdx = (slotIdx + 1) % this.slots.length;
      while (newSlotIdx !== slotIdx && this.spiritIdsBySlot[newSlotIdx].length === 0) {
        newSlotIdx = (newSlotIdx + 1) % this.slots.length;
      }
      slotIdx = newSlotIdx;
    }

    return removedSpiritWrapper;
  }

  public filterDeadSpirits() {
    this.spiritIdsBySlot.forEach((spiritIdsInSlot) => {
      spiritIdsInSlot.forEach(spiritId => this.checkAlive(spiritId));
    });
  }

  protected getSlots(): Array<Position> {
    return [];
  }

  protected getSpiritRatios(): Array<number> {
    return this.slots.map(_ => 1);
  }

  protected getFreeSlot(): number {
    const [, idx] = findInArray(this.spiritCountBySlot,
      (a: number, idx: number) => a / this.spiritRatios[idx]);
    return idx;
  }
}
