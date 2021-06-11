import {AssignTargetType, HarvestChainLink} from "./HarvestChainLink";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";

export class HarvestChainStarLink extends HarvestChainLink {
  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    if (spiritWrapper.entropyIsAboveThreshold(this.energyBuffer)) {
      const targetSpiritWrapper = assignTarget(spiritWrapper);
      if (!targetSpiritWrapper) {
        return;
      }
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.addPotentialEnergy(spiritWrapper);
    } else {
      spiritWrapper.energize(spiritWrapper.entity);
    }
  }
}
