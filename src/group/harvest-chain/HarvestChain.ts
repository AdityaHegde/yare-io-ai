import {inMemory} from "../../memory/inMemory";
import {getSpiritWrapper} from "../../globals/globals";
import {
  ACTION_DISTANCE,
  ACTION_DISTANCE_SQUARED,
  MOVE_DISTANCE,
} from "../../constants";
import {getDistanceBetweenPos, moveToPoint} from "../../utils/GridUtils";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {Log} from "../../utils/Logger";
import {SlottedGroup} from "../SlottedGroup";
import {PatrolArmy} from "../PatrolArmy";
import {Position} from "@adityahegde/yare-io-local/dist/globals/gameTypes";
import {HarvestChainHybridLink} from "./HarvestChainHybridLink";
import {HarvestChainLink, HarvestChainLinkOpts} from "./HarvestChainLink";
import {HarvestChainStarLink} from "./HarvestChainStarLink";
import {HarvestChainMiddleLink} from "./HarvestChainMiddleLink";

export type HarvestChainOpts = {
  energyBufferMin: number;
  energyBufferMax: number;
  energyBufferScale: number;

  armySupportGroup: PatrolArmy;

  starPosition: Position;
  supplyPosition: Position;

  forceNonHybrid: boolean;
}
const SPIRIT_COMPARE_SIZE = 10;

/**
 * Forms a chain of spirits to drop off energy
 */
export class HarvestChain extends SlottedGroup {
  @inMemory(() => false)
  public isHybrid: boolean;

  @inMemory()
  public finalStep: Position;

  @inMemory()
  // steps to secondary slot
  public secondarySlotSteps: number;

  // cursor to "this.spiritIdsBySlot" of spirit with energy capacity per slot
  public freeCursorBySlot: Array<number>;

  // configs
  private readonly energyBuffer: number;

  private readonly armySupportGroup: PatrolArmy;

  private readonly starPosition: Position;
  private readonly supplyPosition: Position;

  private readonly forceNonHybrid: boolean;
  // configs end

  constructor(id: string, {
    energyBufferMin, energyBufferMax, energyBufferScale,
    armySupportGroup,
    starPosition, supplyPosition,
    forceNonHybrid,
  }: HarvestChainOpts) {
    super(id);

    this.energyBuffer = Math.min(
      energyBufferMax,
      energyBufferMin + (energyBufferMax - energyBufferMin) * memory.tick * energyBufferScale,
    );

    this.armySupportGroup = armySupportGroup;

    this.starPosition = starPosition;
    this.supplyPosition = supplyPosition;

    this.forceNonHybrid = forceNonHybrid;
  }

  public run() {
    this.freeCursorBySlot = this.slots.map(_ => 0);

    const links = this.createChainLinks();

    for (let slotIdx = this.slots.length - 1; slotIdx >= 0; slotIdx--) {
      this.spiritIdsBySlot[slotIdx].forEach(spiritId => links[slotIdx].processSpirit(spiritId,
        (spiritWrapper, skipLink) => this.assignTarget(spiritWrapper, slotIdx, skipLink)))
    }
  }

  protected getSlots(): Array<Position> {
    const slots = new Array<Position>();

    const finalStep = moveToPoint(this.starPosition, this.supplyPosition, ACTION_DISTANCE);

    let step = this.supplyPosition;
    let distToFinalStep = getDistanceBetweenPos(step, finalStep);

    while (distToFinalStep >= ACTION_DISTANCE_SQUARED) {
      step = moveToPoint(step, finalStep, ACTION_DISTANCE);
      slots.push(step);

      distToFinalStep = getDistanceBetweenPos(step, finalStep);
    }

    this.secondarySlotSteps = Math.ceil(Math.sqrt(distToFinalStep) / MOVE_DISTANCE) - 1;
    this.isHybrid = (2 * this.secondarySlotSteps <= SPIRIT_COMPARE_SIZE) && !this.forceNonHybrid;

    if (!this.isHybrid) {
      slots.push(finalStep);
    } else {
      this.finalStep = finalStep;
    }

    return slots.reverse();
  }

  protected getSpiritRatios(): Array<number> {
    return this.slots.map((_, idx) => {
      if (idx === 0) {
        return this.isHybrid ? 2 * (SPIRIT_COMPARE_SIZE + 2 * this.secondarySlotSteps) : 2 * SPIRIT_COMPARE_SIZE;
      }
      return SPIRIT_COMPARE_SIZE;
    });
  }

  private createChainLinks(): Array<HarvestChainLink> {
    return this.slots.map((slot, idx) => {
      const opts: HarvestChainLinkOpts = {
        slot,
        energyBuffer: this.energyBuffer,
        armySupportGroup: this.armySupportGroup,
      };
      if (idx === this.slots.length - 1) {
        return new HarvestChainLink(opts);
      }
      if (idx === 0) {
        return this.isHybrid ?
          new HarvestChainHybridLink(opts, {
            secondarySlot: this.finalStep,
          }):
          new HarvestChainStarLink(opts);
      }
      return new HarvestChainMiddleLink(opts);
    });
  }

  private assignTarget(spiritWrapper: SpiritWrapper, slotIdx: number, skipLink?: boolean): SpiritWrapper {
    const nextLink = slotIdx + (skipLink ? 2 : 1);
    // last link wont have any targets
    if (nextLink >= this.slots.length || this.spiritIdsBySlot[nextLink].length === 0) {
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
}
