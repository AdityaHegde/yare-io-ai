import {getSpiritWrapper} from "../../globals/globals";
import {attackInRange} from "../../utils/SpiritUtils";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {atPosition, isWithinRange} from "../../utils/GridUtils";
import {SOLDIER_ENERGY_THRESHOLD} from "../../constants";
import {PatrolArmy} from "../PatrolArmy";

export type AssignTargetType = (spiritWrapper: SpiritWrapper, skipLink?: boolean) => SpiritWrapper;
export type HarvestChainLinkOpts = {
  slot: Position;
  energyBuffer: number;
  armySupportGroup: PatrolArmy;
}

export class HarvestChainLink {
  protected readonly slot: Position;
  protected readonly energyBuffer: number;
  protected readonly armySupportGroup: PatrolArmy;

  constructor({
    slot, energyBuffer, armySupportGroup
  }: HarvestChainLinkOpts) {
    this.slot = slot;
    this.energyBuffer = energyBuffer;
    this.armySupportGroup = armySupportGroup;
  }

  public processSpirit(spiritId: string, assignTarget: AssignTargetType) {
    const spiritWrapper = getSpiritWrapper(spiritId);

    if (this.supplyArmy(spiritWrapper)) {
      return;
    }

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
      return;
    }

    this.takeSpiritActionCore(spiritWrapper, assignTarget);
  }

  protected takeSpiritActionCore(spiritWrapper: SpiritWrapper, assignTarget: AssignTargetType) {}

  private supplyArmy(spiritWrapper: SpiritWrapper): boolean {
    for (let i = 0; i < this.armySupportGroup.spiritIds.length; i++) {
      const soldier = getSpiritWrapper(this.armySupportGroup.spiritIds[i]);
      if (isWithinRange(spiritWrapper.entity, soldier.entity) &&
          soldier.hasSpaceForEnergy(spiritWrapper) && soldier.entity.energy <= SOLDIER_ENERGY_THRESHOLD)  {
        soldier.addPotentialEnergy(spiritWrapper);
        spiritWrapper.energize(soldier.entity);
        return true;
      }
    }

    return false;
  }
}
