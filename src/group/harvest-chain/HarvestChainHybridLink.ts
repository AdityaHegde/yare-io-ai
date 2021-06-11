import {AssignTargetType, HarvestChainLink, HarvestChainLinkOpts} from "./HarvestChainLink";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {atPosition} from "../../utils/GridUtils";

export type HarvestChainHybridLinkOpts = {
  secondarySlot: Position;
  moveOutThreshold: number;
}

export class HarvestChainHybridLink extends HarvestChainLink {
  protected readonly secondarySlot: Position;
  protected readonly moveOutThreshold: number;

  constructor(opts: HarvestChainLinkOpts, {
    secondarySlot, moveOutThreshold,
  }: HarvestChainHybridLinkOpts) {
    super(opts);
    this.secondarySlot = secondarySlot;
    this.moveOutThreshold = moveOutThreshold;
  }

  /**
   * 0 - Passing on energy to next link
   * 1 - Moving towards star. Optionally pass on energy to smaller link.
   * 2 - Mine star
   * 3 - Move towards smaller link. Optionally pass on energy to smaller link.
   * this.slot = link near star
   * this.secondarySlot = smaller link
   */
  protected moveSpirit(spiritWrapper: SpiritWrapper) {
    // console.log(spiritWrapper.id, spiritWrapper.task, spiritWrapper.entropy);

    const switchTaskConditions = [
      () => spiritWrapper.entropy <= this.moveOutThreshold * spiritWrapper.entity.size,
      () => spiritWrapper.entropy <= 0 || atPosition(spiritWrapper.entity, this.slot),
      () => spiritWrapper.entropy === spiritWrapper.entity.energy_capacity,
      () => atPosition(spiritWrapper.entity, this.secondarySlot),
    ];

    if (switchTaskConditions[spiritWrapper.task]()) {
      spiritWrapper.task = (spiritWrapper.task + 1) % switchTaskConditions.length;
    }

    const moveToSlots = [
      this.secondarySlot, this.slot, this.slot, this.secondarySlot
    ];

    if (!atPosition(spiritWrapper.entity, moveToSlots[spiritWrapper.task])) {
      spiritWrapper.move(moveToSlots[spiritWrapper.task]);
    }
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    let targetSpiritWrapper: SpiritWrapper;
    switch (spiritWrapper.task) {
      case 0:
        targetSpiritWrapper = assignTarget(spiritWrapper, this.moveOutThreshold === 0);
        break;
      case 1:
      case 3:
        if (this.moveOutThreshold > 0) {
          targetSpiritWrapper = assignTarget(spiritWrapper);
        }
        break;
      case 2:
        targetSpiritWrapper = spiritWrapper;
        break;
    }

    // console.log(spiritWrapper.id, spiritWrapper.task, targetSpiritWrapper && targetSpiritWrapper.id);
    if (targetSpiritWrapper) {
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.addPotentialEnergy(spiritWrapper);
    }
  }
}
