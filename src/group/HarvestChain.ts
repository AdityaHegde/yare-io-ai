import {inMemory} from "../memory/inMemory";
import {getSpiritWrapper, globals} from "../globals/globals";
import {ACTION_DISTANCE, ACTION_DISTANCE_SQUARED, SOLDIER_ENERGY_THRESHOLD} from "../constants";
import {atPosition, getDistance, isWithinRange, moveToPoint} from "../utils/GridUtils";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Log} from "../utils/Logger";
import {SlottedGroup} from "./SlottedGroup";
import {PatrolArmy} from "./PatrolArmy";
import {SpiritGroupType} from "./SpiritGroupType";
import {findInArray} from "../utils/MathUtils";

export type HarvestChainOpts = {
  armySupportType: SpiritGroupType;
  energyBuffer: number;
}

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
  // cursor to "this.spiritIdsBySlot" of spirit with energy capacity per slot
  public freeCursorBySlot: Array<number>;

  private readonly armySupportType: SpiritGroupType;
  private readonly energyBuffer: number;

  constructor(id: string, {
    armySupportType,
    energyBuffer,
  }: HarvestChainOpts) {
    super(id);
    this.armySupportType = armySupportType;
    this.energyBuffer = energyBuffer;
  }

  public run() {
    this.freeCursorBySlot = this.slots.map(_ => 0);

    this.spiritIdsBySlot.forEach((spiritIdsInSlot) => {
      this.filterDeadSpirits(spiritIdsInSlot);
    });

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

  protected getFreeSlot(): number {
    const [, idx] = findInArray(this.spiritCountBySlot,
      (a: number, idx: number) => idx === 0 ? a/2 : a);
    return idx;
  }

  private assignTarget(spiritWrapper: SpiritWrapper): SpiritWrapper {
    const nextLink = spiritWrapper.task + 1;
    // last link wont have any targets
    if (nextLink === this.slots.length || this.spiritIdsBySlot[nextLink].length === 0) {
      return null;
    }

    const curCursor = this.freeCursorBySlot[nextLink];
    let i = curCursor;
    do {
      i = (i + 1) % this.spiritIdsBySlot[nextLink].length;

      const targetSpiritWrapper = getSpiritWrapper(this.spiritIdsBySlot[nextLink][i]);

      if (targetSpiritWrapper.hasSpaceForEnergy(spiritWrapper)) {
        this.freeCursorBySlot[nextLink] = i;
        return targetSpiritWrapper;
      }
    } while(i !== curCursor);

    return null;
  }

  private handleSpirit(
    spiritId: string, slotIdx: number,
    forwardMethod: ("handleSpiritsNearStar" | "handleSpiritsNearBase" | "handleSpiritsInTheMiddle"),
  ) {
    const spiritWrapper = getSpiritWrapper(spiritId);
    if (!this.checkAlive(spiritWrapper)) {
      return;
    }

    if (this.supplyArmy(spiritWrapper)) {
      return;
    }

    if (!atPosition(spiritWrapper.entity, this.slots[slotIdx])) {
      spiritWrapper.move(this.slots[slotIdx]);
    }
    const targetSpiritWrapper = this.assignTarget(spiritWrapper);
    this[forwardMethod](spiritWrapper, targetSpiritWrapper);
  }

  private supplyArmy(spiritWrapper: SpiritWrapper): boolean {
    const armyGroup = globals.groups[this.armySupportType] as PatrolArmy;

    if (!armyGroup) {
      return false;
    }

    for (let i = 0; i < armyGroup.spiritIds.length; i++) {
      const soldier = getSpiritWrapper(armyGroup.spiritIds[i]);
      if (isWithinRange(spiritWrapper.entity, soldier.entity) &&
        soldier.hasSpaceForEnergy(spiritWrapper) && soldier.entity.energy <= SOLDIER_ENERGY_THRESHOLD)  {
        // this.logger.log(`${spiritWrapper.id} supplying ${soldier.id} (${soldier.entropy})`);
        soldier.addPotentialEnergy(spiritWrapper);
        spiritWrapper.energize(soldier.entity);
        return true;
      }
    }

    return false;
  }

  private handleSpiritsNearStar(spiritWrapper: SpiritWrapper, targetSpiritWrapper: SpiritWrapper) {
    if (spiritWrapper.entropyIsAboveThreshold(this.energyBuffer) && targetSpiritWrapper) {
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.removePotentialEnergy(spiritWrapper);
    } else {
      spiritWrapper.energize(spiritWrapper.entity);
    }
  }

  private handleSpiritsNearBase(spiritWrapper: SpiritWrapper, targetSpiritWrapper: SpiritWrapper) {
    if (spiritWrapper.entropyIsAboveThreshold(this.energyBuffer)) {
      spiritWrapper.energize(base);
    }
  }

  private handleSpiritsInTheMiddle(spiritWrapper: SpiritWrapper, targetSpiritWrapper: SpiritWrapper) {
    if (spiritWrapper.entropyIsAboveThreshold(this.energyBuffer) && targetSpiritWrapper) {
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.removePotentialEnergy(spiritWrapper);
    }
  }
}
