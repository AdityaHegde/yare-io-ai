import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {globals} from "../../globals/globals";
import {Assigner} from "./Assigner";
import {Log} from "../../utils/Logger";
import {SpiritGroup} from "../../group/SpiritGroup";
import {SpiritGroupType} from "../../group/SpiritGroupType";

type GroupAssignerConfig = {
  harvesterSentryRatio: number;
  harvesterDefenderRatio: number;
}

@Log
export class GroupAssigner extends Assigner<GroupAssignerConfig> {
  public preTick() {
    this.reassignToDefence();
  }

  public assign(spiritWrapper: SpiritWrapper) {
    // const initialGroup = globals.groups[SpiritGroupType.InitialGroup];
    const harvesterGroup = globals.groups[SpiritGroupType.HarvestChain];
    const sentryLine = globals.groups[SpiritGroupType.SentryLine];
    const baseDefenceArmy = globals.groups[SpiritGroupType.BaseDefenceArmy];

    // if (spiritWrapper.freshSpirit) {
    //   this.assignSpiritToGroup(spiritWrapper, initialGroup);
    //   return;
    // }

    // sentry line would be killed if there is an attack
    // do not assign until attack has been cleared
    if (!memory.underAttack && this.checkRatio(harvesterGroup, sentryLine, this.config.harvesterSentryRatio) &&
        sentryLine.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, sentryLine);
      return;
    }

    if (memory.underAttack && this.checkRatio(harvesterGroup, baseDefenceArmy, this.config.harvesterSentryRatio)) {
      this.assignSpiritToGroup(spiritWrapper, baseDefenceArmy);
      return;
    }

    this.assignSpiritToGroup(spiritWrapper, harvesterGroup);
  }

  public postTick() {
    this.reassignToHarvest();
  }

  private reassignToDefence() {
    if (!memory.underAttack || globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount >= memory.uniqueEnemies.length) {
      return;
    }

    this.reassignFromGroup(
      globals.groups[SpiritGroupType.HarvestChain],
      globals.groups[SpiritGroupType.BaseDefenceArmy],
      Math.min(memory.uniqueEnemies.length * 1.5, globals.groups[SpiritGroupType.HarvestChain].totalSpiritCount),
    );
  }

  private assignSpiritToGroup(spiritWrapper: SpiritWrapper, selectedGroup: SpiritGroup) {
    // this.logger.log(`${spiritWrapper.id} assigned to ${selectedGroup.id}`);
    selectedGroup.addSpirit(spiritWrapper);
  }

  private reassignToHarvest() {
    if (memory.underAttack || globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount === 0) {
      return;
    }

    this.reassignFromGroup(
      globals.groups[SpiritGroupType.BaseDefenceArmy],
      globals.groups[SpiritGroupType.HarvestChain],
      globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount,
    );
  }

  private reassignFromGroup(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, count: number) {
    sourceGroup.removeSpirits(count).forEach(spiritWrapper => targetGroup.addSpirit(spiritWrapper));
  }

  private checkRatio(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, ratio: number) {
    return sourceGroup.totalSpiritCount / (targetGroup.totalSpiritCount + 1) >= ratio;
  }
}
