import {AssignTargetType, HarvestChainLink} from "./HarvestChainLink";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";

export class HarvestChainMiddleLink extends HarvestChainLink {
  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    const targetSpiritWrapper = assignTarget(spiritWrapper);

    if (spiritWrapper.entropyIsAboveThreshold(this.energyBuffer) && targetSpiritWrapper) {
      spiritWrapper.energize(targetSpiritWrapper.entity);
      targetSpiritWrapper.addPotentialEnergy(spiritWrapper);
    }
  }
}
