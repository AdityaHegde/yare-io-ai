import {inMemory} from "../../memory/inMemory";
import {getSpiritWrapper} from "../../globals/globals";
import {
  ACTION_DISTANCE,
  ACTION_DISTANCE_SQUARED,
  MOVE_DISTANCE, STAR_CONSTANT_REGEN, STAR_MAX_ENERGY, STAR_PERCENT_REGEN,
} from "../../constants";
import {getDistanceBetweenPos, moveToPoint} from "../../utils/GridUtils";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {SlottedGroup} from "../SlottedGroup";
import {Position} from "@adityahegde/yare-io-local/dist/globals/gameTypes";
import {HarvestChainHybridLink} from "./HarvestChainHybridLink";
import {HarvestChainLink, HarvestChainLinkOpts} from "./HarvestChainLink";
import {HarvestChainStarLink} from "./HarvestChainStarLink";
import {HarvestChainMiddleLink} from "./HarvestChainMiddleLink";
import {HarvestChainSupplyLink} from "./HarvestChainSupplyLink";

export type HarvestChainOpts = {
  energyBufferMin: number;
  energyBufferMax: number;
  energyBufferScale: number;

  star: Energy;
  supply: EnergySupply;
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

  private readonly star: Energy;
  private readonly supply: EnergySupply;
  // configs end

  constructor(id: string, {
    energyBufferMin, energyBufferMax, energyBufferScale,
    star, supply,
  }: HarvestChainOpts) {
    super(id);

    this.energyBuffer = Math.min(
      energyBufferMax,
      energyBufferMin + (energyBufferMax - energyBufferMin) * memory.tick * energyBufferScale,
    );

    this.star = star;
    this.supply = supply;
  }

  public run() {
    this.freeCursorBySlot = this.slots.map(_ => 0);

    const links = this.createChainLinks();

    for (let slotIdx = this.slots.length - 1; slotIdx >= 0; slotIdx--) {
      this.spiritIdsBySlot[slotIdx].forEach(spiritId => links[slotIdx].processSpirit(spiritId,
        (spiritWrapper) => this.assignTarget(spiritWrapper, slotIdx)))
    }
  }

  public hasSpace() {
    if (this.star.energy === 0) {
      return false;
    }

    const starRegen = STAR_CONSTANT_REGEN + Math.floor(this.star.energy * STAR_PERCENT_REGEN);
    const maxDepositors = STAR_CONSTANT_REGEN + Math.floor(this.star.energy * STAR_PERCENT_REGEN /
      ((this.star.energy + starRegen) >= STAR_MAX_ENERGY ? 1 : 2));
    const depositorRatio = this.spiritRatios[this.spiritRatios.length - 1];
    const maxSpirits = Math.floor(this.spiritRatios.reduce((spiritCount, ratio) =>
      spiritCount + ratio * maxDepositors / depositorRatio, 0));

    return this.totalSpiritCount < maxSpirits;
  }

  protected getSlots(): Array<Position> {
    const slots = new Array<Position>();

    const finalStep = moveToPoint(this.star.position, this.supply.position, ACTION_DISTANCE);

    let step = this.supply.position;
    let distToFinalStep = getDistanceBetweenPos(step, finalStep);

    while (distToFinalStep >= ACTION_DISTANCE_SQUARED) {
      step = moveToPoint(step, finalStep, ACTION_DISTANCE);
      slots.push(step);

      distToFinalStep = getDistanceBetweenPos(step, finalStep);
    }

    this.secondarySlotSteps = Math.ceil(Math.sqrt(distToFinalStep) / MOVE_DISTANCE) - 1;
    this.isHybrid = (2 * this.secondarySlotSteps) <= SPIRIT_COMPARE_SIZE;

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
        return 2 * SPIRIT_COMPARE_SIZE + (this.isHybrid ? 2 * this.secondarySlotSteps : 0);
      }
      return SPIRIT_COMPARE_SIZE;
    });
  }

  private createChainLinks(): Array<HarvestChainLink> {
    return this.slots.map((slot, idx) => {
      const opts: HarvestChainLinkOpts = {
        slot,
        energyBuffer: this.energyBuffer,
      };
      if (idx === this.slots.length - 1) {
        return new HarvestChainSupplyLink(opts, this.supply);
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

  private assignTarget(spiritWrapper: SpiritWrapper, slotIdx: number): SpiritWrapper {
    const nextLink = slotIdx + 1;
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
