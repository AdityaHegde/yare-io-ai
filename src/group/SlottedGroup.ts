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
  // cursor to "this.spirits" of free spirit per slot
  @inMemory()
  public freeCursorBySlot: Array<number>;

  public init() {
    this.slots = this.getSlots();
    this.spiritCountBySlot = this.slots.map(_ => 0);
    this.spiritIdsBySlot = this.slots.map(_ => []);
    this.freeCursorBySlot = this.slots.map(_ => 0);
  }

  public addSpirit(spirit: SpiritWrapper) {
    const [, idx] = findInArray(this.spiritCountBySlot);
    if (idx === -1) {
      return;
    }

    spirit.role = RoleType.Group;
    spirit.task = idx;
    this.spiritCountBySlot[idx]++;
    this.totalSpiritCount++;
    this.spiritIdsBySlot[idx].push(spirit.id);
  }

  public removeSpirit(spirit: SpiritWrapper) {
    spirit.role = RoleType.Free;
    this.spiritCountBySlot[spirit.task]--;
    this.totalSpiritCount--;
    const idx = this.spiritIdsBySlot[spirit.task].indexOf(spirit.id);
    this.spiritIdsBySlot[spirit.task].splice(idx);
    // if removed spirit was behind cursor, decrement it
    if (idx < this.freeCursorBySlot[spirit.task]) {
      this.freeCursorBySlot[spirit.task]--;
    }
  }

  protected getSlots(): Array<Position> {
    return [];
  }
}
