import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {Assigner} from "./Assigner";
import {Log} from "../../utils/Logger";
import {SpiritGroup} from "../../group/SpiritGroup";
import {SpiritGroupType} from "../../group/SpiritGroupType";
import {GroupsMapType} from "../../group/GroupsMapType";

export type GroupAssignerConfig = {
  harvesterSentryRatio: number;
  harvesterDefenderRatio: number;

  attackThreshold: number;
  attackerCount: number;

  enableAttack?: boolean;
  enableSentry?: boolean;
  enableDefence?: boolean;
}

@Log
export class GroupAssigner extends Assigner<GroupAssignerConfig> {
  public groups: GroupsMapType;

  public preTick() {
    this.reassignToAttack();
    this.reassignToDefence();
  }

  public assign(spiritWrapper: SpiritWrapper) {
    // const initialGroup = this.groups[SpiritGroupType.InitialGroup];
    const harvesterGroup = this.groups[SpiritGroupType.HarvestChain];
    const sentryLine = this.groups[SpiritGroupType.SentryLine];
    const baseDefenceArmy = this.groups[SpiritGroupType.BaseDefenceArmy];

    // if (spiritWrapper.freshSpirit) {
    //   this.assignSpiritToGroup(spiritWrapper, initialGroup);
    //   return;
    // }

    // sentry line would be killed if there is an attack
    // do not assign until attack has been cleared
    if (this.config.enableSentry && !memory.underAttack &&
        this.checkRatio(harvesterGroup, sentryLine, this.config.harvesterSentryRatio) && sentryLine.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, sentryLine);
      return;
    }

    if (this.config.enableDefence && memory.underAttack &&
        this.checkRatio(harvesterGroup, baseDefenceArmy, this.config.harvesterSentryRatio)) {
      this.assignSpiritToGroup(spiritWrapper, baseDefenceArmy);
      return;
    }

    this.assignSpiritToGroup(spiritWrapper, harvesterGroup);
  }

  public postTick() {
    this.reassignToHarvest();
  }

  private assignSpiritToGroup(spiritWrapper: SpiritWrapper, selectedGroup: SpiritGroup) {
    // this.logger.log(`${spiritWrapper.id} assigned to ${selectedGroup.id}`);
    selectedGroup.addSpirit(spiritWrapper);
  }

  private reassignToDefence() {
    if (!this.config.enableDefence || !memory.underAttack ||
        this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount >= memory.uniqueEnemies.length) {
      return;
    }

    this.reassignFromGroup(
      this.groups[SpiritGroupType.HarvestChain],
      this.groups[SpiritGroupType.BaseDefenceArmy],
      Math.min(memory.uniqueEnemies.length * 1.25, this.groups[SpiritGroupType.HarvestChain].totalSpiritCount),
    );
  }

  private reassignToHarvest() {
    if (memory.underAttack || this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount === 0) {
      return;
    }

    this.reassignFromGroup(
      this.groups[SpiritGroupType.BaseDefenceArmy],
      this.groups[SpiritGroupType.HarvestChain],
      this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount,
    );
  }

  private reassignToAttack() {
    if (!this.config.enableAttack ||
        this.groups[SpiritGroupType.HarvestChain].totalSpiritCount < this.config.attackThreshold) {
      return;
    }

    // this.logger.log(`Reassigning to attack`);

    this.reassignFromGroup(
      this.groups[SpiritGroupType.HarvestChain],
      this.groups[SpiritGroupType.BaseAttackArmy],
      Math.min(this.groups[SpiritGroupType.HarvestChain].totalSpiritCount, this.config.attackerCount),
    );
  }

  private reassignFromGroup(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, count: number) {
    sourceGroup.removeSpirits(count).forEach(spiritWrapper => targetGroup.addSpirit(spiritWrapper));
  }

  private checkRatio(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, ratio: number) {
    return sourceGroup.totalSpiritCount / (targetGroup.totalSpiritCount + 1) >= ratio;
  }
}
