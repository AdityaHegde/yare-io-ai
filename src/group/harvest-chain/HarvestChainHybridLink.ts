import {AssignTargetType, HarvestChainLink, HarvestChainLinkOpts} from "./HarvestChainLink";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {atPosition} from "../../utils/GridUtils";

export type HarvestChainHybridLinkOpts = {
  secondarySlot: Position;
}

export class HarvestChainHybridLink extends HarvestChainLink {
  protected readonly secondarySlot: Position;

  constructor(opts: HarvestChainLinkOpts, {
    secondarySlot,
  }: HarvestChainHybridLinkOpts) {
    super(opts);
    this.secondarySlot = secondarySlot;
  }

  /**
   * 0 - Passing on energy to next link
   * 1 - Moving towards star.
   * 2 - Mine star
   * 3 - Move towards final link.
   * this.slot = final link
   * this.secondarySlot = slot near star
   */
  protected moveSpirit(spiritWrapper: SpiritWrapper) {
    // console.log(spiritWrapper.id, spiritWrapper.subTask, spiritWrapper.entropy);

    const switchTaskConditions = [
      () => !spiritWrapper.hasEntropy(),
      () => atPosition(spiritWrapper.entity, this.secondarySlot),
      () => spiritWrapper.isEntropyFull(),
      () => atPosition(spiritWrapper.entity, this.slot),
    ];

    if (switchTaskConditions[spiritWrapper.subTask]()) {
      spiritWrapper.subTask = (spiritWrapper.subTask + 1) % switchTaskConditions.length;
    }

    const moveToSlots = [
      this.slot, this.secondarySlot, this.secondarySlot, this.slot,
    ];

    if (!atPosition(spiritWrapper.entity, moveToSlots[spiritWrapper.subTask])) {
      spiritWrapper.move(moveToSlots[spiritWrapper.subTask]);
    }
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    let targetSpiritWrapper: SpiritWrapper;
    switch (spiritWrapper.subTask) {
      case 0:
        targetSpiritWrapper = assignTarget(spiritWrapper);
        break;
      case 2:
        targetSpiritWrapper = spiritWrapper;
        break;
      default: return true;
    }

    // console.log(spiritWrapper.id, spiritWrapper.subTask, targetSpiritWrapper && targetSpiritWrapper.id);
    if (!targetSpiritWrapper) {
      return false;
    }

    spiritWrapper.energize(targetSpiritWrapper.entity);
    targetSpiritWrapper.addPotentialEnergy(spiritWrapper);
    return true;
  }
}
