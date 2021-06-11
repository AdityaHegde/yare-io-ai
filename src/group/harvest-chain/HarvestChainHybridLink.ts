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
    // console.log(spiritWrapper.id, spiritWrapper.subTask, spiritWrapper.entropy);

    const switchTaskConditions = [
      () => spiritWrapper.entropy <= this.moveOutThreshold * spiritWrapper.entity.size,
      () => spiritWrapper.entropy <= 0 || atPosition(spiritWrapper.entity, this.slot),
      () => spiritWrapper.entropy === spiritWrapper.entity.energy_capacity,
      () => atPosition(spiritWrapper.entity, this.secondarySlot),
    ];

    if (switchTaskConditions[spiritWrapper.subTask]()) {
      spiritWrapper.subTask = (spiritWrapper.subTask + 1) % switchTaskConditions.length;
    }

    const moveToSlots = [
      this.secondarySlot, this.slot, this.slot, this.secondarySlot
    ];

    if (!atPosition(spiritWrapper.entity, moveToSlots[spiritWrapper.subTask])) {
      spiritWrapper.move(moveToSlots[spiritWrapper.subTask]);
    }
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    let targetSpiritWrapper: SpiritWrapper;
    switch (spiritWrapper.subTask) {
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

    // console.log(spiritWrapper.id, spiritWrapper.subTask, targetSpiritWrapper && targetSpiritWrapper.id);
    if (targetSpiritWrapper) {
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.addPotentialEnergy(spiritWrapper);
    }
  }
}
