import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {Assigner} from "./Assigner";
import {Log} from "../../utils/Logger";
import {SpiritGroup} from "../../group/SpiritGroup";
import {SpiritGroupType} from "../../group/SpiritGroupType";
import {GroupsMapType} from "../../group/GroupsMapType";

export type GroupAssignerConfig = {
  harvesterSentryRatio: number;
  harvesterDefenderRatio: number;
  harvesterHarasserRatio: number;

  attackThreshold: number;
  attackerCount: number;

  enableAttack?: boolean;
  enableSentry?: boolean;
  enableDefence?: boolean;
  enableHarasser?: boolean;
  enableMiddleHarvesting?: boolean;
}

export class GroupAssigner extends Assigner<GroupAssignerConfig> {
  public groups: GroupsMapType;

  public preTick() {
    this.reassignToAttack();
    this.reassignToDefence();
  }

  public assign(spiritWrapper: SpiritWrapper) {
    const harvesterGroup = this.groups[SpiritGroupType.Harvester];
    const midStarHarvesterGroup = this.groups[SpiritGroupType.MidStarHarvester];
    const harasser = this.groups[SpiritGroupType.Harasser];
    const baseAttack = this.groups[SpiritGroupType.BaseAttackArmy];

    if (harvesterGroup.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, harvesterGroup);
      return;
    }

    if (this.config.enableMiddleHarvesting && midStarHarvesterGroup.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, midStarHarvesterGroup);
      return;
    }

    if (this.config.enableHarasser && harasser.hasSpace() &&
        this.checkRatio(harvesterGroup, harasser, this.config.harvesterHarasserRatio)) {
      this.assignSpiritToGroup(spiritWrapper, harasser);
      return;
    }

    if (this.config.enableAttack && baseAttack.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, baseAttack);
      return;
    }
  }

  public postTick() {
    this.reassignToHarvest();
  }

  private assignSpiritToGroup(spiritWrapper: SpiritWrapper, selectedGroup: SpiritGroup) {
    // console.log(`${spiritWrapper.id} assigned to ${selectedGroup.id}`);
    selectedGroup.addSpirit(spiritWrapper);
  }

  private reassignToDefence() {
    if (!this.config.enableDefence || !memory.underAttack ||
        this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount >= memory.uniqueEnemies.length) {
      return;
    }

    this.reassignFromGroup(
      this.groups[SpiritGroupType.Harvester],
      this.groups[SpiritGroupType.BaseDefenceArmy],
      Math.min(memory.uniqueEnemies.length * 1.25, this.groups[SpiritGroupType.Harvester].totalSpiritCount),
    );
  }

  private reassignToHarvest() {
    if (memory.underAttack || this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount === 0) {
      return;
    }

    this.reassignFromGroup(
      this.groups[SpiritGroupType.BaseDefenceArmy],
      this.groups[SpiritGroupType.Harvester],
      this.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount,
    );
  }

  private reassignToAttack() {
    if (!this.config.enableAttack ||
        this.groups[SpiritGroupType.Harvester].totalSpiritCount < this.config.attackThreshold) {
      return;
    }

    // console.log(`Reassigning to attack`);

    this.reassignFromGroup(
      this.groups[SpiritGroupType.Harvester],
      this.groups[SpiritGroupType.BaseAttackArmy],
      Math.min(this.groups[SpiritGroupType.Harvester].totalSpiritCount, this.config.attackerCount),
    );
  }

  private reassignFromGroup(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, count: number) {
    sourceGroup.removeSpirits(count).forEach(spiritWrapper => targetGroup.addSpirit(spiritWrapper));
  }

  private checkRatio(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, ratio: number) {
    return sourceGroup.totalSpiritCount / (targetGroup.totalSpiritCount + 1) >= ratio;
  }
}
