import {inMemory} from "../memory/inMemory";
import {getSpiritWrapper, globals} from "../globals/globals";
import {ACTION_DISTANCE, ACTION_DISTANCE_SQUARED, HARVEST_LINK_BUFFER} from "../constants";
import {atPosition, getDistance, moveToPoint} from "../utils/GridUtils";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Log} from "../utils/Logger";
import {SlottedGroup} from "./SlottedGroup";

/**
 * Forms a chain of spirits to drop off energy
 */
@Log
export class HarvestChain extends SlottedGroup {
  @inMemory()
  public slots: Array<Position>;

  @inMemory()
  public spiritCountBySlot: Array<number>;

  @inMemory()
  public spiritIdsBySlot: Array<Array<string>>;
  // cursor to "this.spirits" of free spirit per slot in the chain
  @inMemory()
  public freeCursorBySlot: Array<number>;

  public run() {
    // spirits near star
    this.spiritIdsBySlot[0].forEach(spiritId => this.handleSpirit(spiritId, 0, "handleSpiritsNearStar"));

    // spirits in the middle of the chain
    for (let i = 1; i < this.spiritIdsBySlot.length - 1; i++) {
      this.spiritIdsBySlot[i].forEach(spiritId => this.handleSpirit(spiritId, i, "handleSpiritsInTheMiddle"));
    }

    // spirits near the base
    this.spiritIdsBySlot[this.spiritIdsBySlot.length - 1]
      .forEach(spiritId => this.handleSpirit(spiritId, this.spiritIdsBySlot.length - 1, "handleSpiritsNearBase"));
  }

  protected getSlots(): Array<Position> {
    const steps = Math.sqrt(getDistance(base, globals.baseStar) / ACTION_DISTANCE_SQUARED);
    const slots = new Array<Position>();

    let prevPos = globals.baseStar.position;
    for (let i = 0; i < steps - 1; i++) {
      prevPos = moveToPoint(prevPos, base.position, ACTION_DISTANCE);
      slots.push(prevPos);
    }

    return slots;
  }

  private assignTarget(spirit: SpiritWrapper): boolean {
    const nextLink = spirit.task + 1;
    // last link wont have any targets
    if (nextLink === this.slots.length) {
      return true;
    }

    // if there is no target assigned or the target is dead
    if (!spirit.targetId || !spirits[spirit.targetId]) {
      // no spirit to target
      if (this.spiritIdsBySlot[nextLink].length <= this.freeCursorBySlot[nextLink]) {
        return false;
      }
      spirit.targetId = this.spiritIdsBySlot[nextLink][this.freeCursorBySlot[nextLink]];
      this.freeCursorBySlot[nextLink]++;
    }
    return true;
  }

  private handleSpirit(
    spiritId: string, slotIdx: number,
    forwardMethod: ("handleSpiritsNearStar" | "handleSpiritsNearBase" | "handleSpiritsInTheMiddle"),
  ) {
    const spiritWrapper = getSpiritWrapper(spiritId);
    if (!this.checkAlive(spiritWrapper)) {
      return;
    }

    if (atPosition(spiritWrapper.entity, this.slots[slotIdx])) {
      if (!this.assignTarget(spiritWrapper)) {
        return;
      }
      this[forwardMethod](spiritWrapper);
    } else {
      spiritWrapper.move(this.slots[slotIdx]);
    }
  }

  private handleSpiritsNearStar(spirit: SpiritWrapper) {
    if (spirit.entity.energy > HARVEST_LINK_BUFFER) {
      spirit.energize(spirits[spirit.targetId]);
    } else {
      spirit.energize(spirit.entity);
    }
  }

  private handleSpiritsNearBase(spirit: SpiritWrapper) {
    if (spirit.entity.energy > HARVEST_LINK_BUFFER) {
      spirit.energize(base);
    }
  }

  private handleSpiritsInTheMiddle(spirit: SpiritWrapper) {
    if (spirit.entity.energy > HARVEST_LINK_BUFFER) {
      spirit.energize(spirits[spirit.targetId]);
    }
  }
}
