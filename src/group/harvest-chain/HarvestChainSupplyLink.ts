import {AssignTargetType, HarvestChainLink, HarvestChainLinkOpts} from "./HarvestChainLink";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {supplyArmy} from "../../utils/SpiritUtils";
import {isWithinRange} from "../../utils/GridUtils";

export class HarvestChainSupplyLink extends HarvestChainLink {
  protected readonly supply: EnergySupply;

  constructor(opts: HarvestChainLinkOpts, supply: EnergySupply) {
    super(opts);
    this.supply = supply;
  }

  protected takeSpiritAction(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    if (supplyArmy(spiritWrapper)) {
      return true;
    }

    return this.takeSpiritActionCore(spiritWrapper, assignTarget);
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {
    if (isWithinRange(spiritWrapper.entity, this.supply) &&
        spiritWrapper.entropyIsAboveThreshold(this.energyBuffer)) {
      spiritWrapper.energize(this.supply);
      return true;
    }
  }
}
