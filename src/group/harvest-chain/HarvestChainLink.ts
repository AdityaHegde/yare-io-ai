import {getSpiritWrapper} from "../../globals/globals";
import {attackInRange} from "../../utils/SpiritUtils";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {atPosition, isWithinRange} from "../../utils/GridUtils";

export type AssignTargetType = (spiritWrapper: SpiritWrapper) => SpiritWrapper;
export type HarvestChainLinkOpts = {
  slot: Position;
  energyBuffer: number;
}

export class HarvestChainLink {
  protected readonly slot: Position;
  protected readonly energyBuffer: number;

  constructor({
    slot, energyBuffer,
  }: HarvestChainLinkOpts) {
    this.slot = slot;
    this.energyBuffer = energyBuffer;
  }

  public processSpirit(spiritId: string, assignTarget: AssignTargetType) {
    const spiritWrapper = getSpiritWrapper(spiritId);

    // defend self, else take normal action
    if (!attackInRange(spiritWrapper)) {
      this.takeSpiritAction(spiritWrapper, assignTarget);
    }

    this.moveSpirit(spiritWrapper);
  }

  protected moveSpirit(spiritWrapper: SpiritWrapper) {
    if (!atPosition(spiritWrapper.entity, this.slot)) {
      spiritWrapper.move(this.slot);
    }
  }

  protected takeSpiritAction(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    if (isWithinRange(spiritWrapper.entity, base) &&
        spiritWrapper.entropyIsAboveThreshold(this.energyBuffer)) {
      spiritWrapper.energize(base);
      return true;
    }

    return this.takeSpiritActionCore(spiritWrapper, assignTarget);
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    return false;
  }
}
