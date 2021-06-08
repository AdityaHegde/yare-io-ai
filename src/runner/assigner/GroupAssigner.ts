import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {globals} from "../../globals/globals";
import {Assigner} from "./Assigner";
import {Log} from "../../utils/Logger";
import {SpiritGroup, SpiritGroupType} from "../../group/SpiritGroup";
import {InitialGroup} from "../../group/InitialGroup";
import {HarvestChain} from "../../group/HarvestChain";
import {SentryLine} from "../../group/SentryLine";
import {PatrolArmy} from "../../group/PatrolArmy";
import {HARVESTER_DEFENDER_RATIO, SENTRY_ACTIVATION_POINT} from "../../constants";

@Log
export class GroupAssigner extends Assigner {
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
    if (!memory.underAttack && harvesterGroup.totalSpiritCount >= SENTRY_ACTIVATION_POINT &&
        sentryLine.hasSpace()) {
      this.assignSpiritToGroup(spiritWrapper, sentryLine);
      return;
    }

    if (memory.underAttack && (baseDefenceArmy.totalSpiritCount === 0 ||
        harvesterGroup.totalSpiritCount / baseDefenceArmy.totalSpiritCount > HARVESTER_DEFENDER_RATIO)) {
      this.assignSpiritToGroup(spiritWrapper, baseDefenceArmy);
      return;
    }

    this.assignSpiritToGroup(spiritWrapper, harvesterGroup);
  }

  public postTick() {
    this.reassignToAttack();
  }

  private reassignToDefence() {
    if (!memory.underAttack || globals.groups[SpiritGroupType.HarvestChain].totalSpiritCount <=
        globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount * HARVESTER_DEFENDER_RATIO) {
      return;
    }

    this.reassignFromGroup(
      globals.groups[SpiritGroupType.HarvestChain],
      globals.groups[SpiritGroupType.BaseDefenceArmy],
      globals.groups[SpiritGroupType.HarvestChain].totalSpiritCount -
        globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount * HARVESTER_DEFENDER_RATIO,
    );
  }

  private assignSpiritToGroup(spiritWrapper: SpiritWrapper, selectedGroup: SpiritGroup) {
    // this.logger.log(`${spiritWrapper.id} assigned to ${selectedGroup.id}`);
    selectedGroup.addSpirit(spiritWrapper);
  }

  private reassignToAttack() {
    if (memory.underAttack || globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount === 0) {
      return;
    }

    this.reassignFromGroup(
      globals.groups[SpiritGroupType.BaseDefenceArmy],
      globals.groups[SpiritGroupType.BaseAttackArmy],
      globals.groups[SpiritGroupType.BaseDefenceArmy].totalSpiritCount,
    );
  }

  private reassignFromGroup(sourceGroup: SpiritGroup, targetGroup: SpiritGroup, count: number) {
    sourceGroup.removeSpirits(count).forEach(spiritWrapper => targetGroup.addSpirit(spiritWrapper));
  }
}
