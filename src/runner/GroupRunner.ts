import {Runner} from "./Runner";
import {addInstanceToGlobal, getSpiritWrapper, globals} from "../globals/globals";
import {RoleType} from "../role/Role";
import {HARVEST_LINK_BUFFER, UNDER_ATTACK_BUFFER} from "../constants";
import {SpiritGroupType} from "../group/SpiritGroupType";
import {InitialGroup} from "../group/InitialGroup";
import {HarvestChain} from "../group/HarvestChain";
import {SentryLine} from "../group/SentryLine";
import {PatrolArmy} from "../group/PatrolArmy";
import {PatrolPointsReference} from "../data/getPatrolPoints";
import {Log} from "../utils/Logger";

type GroupRunnerConfig = {
  harvestLinkBuffer: number;
  underAttackBuffer: number;

  sentryCount: number;
  sentryDistance: number;
}

@Log
export class GroupRunner extends Runner<GroupRunnerConfig> {
  protected initCore() {
    globals.groups = {
      [SpiritGroupType.InitialGroup]: addInstanceToGlobal(new InitialGroup(`${SpiritGroupType.InitialGroup}`)),
      [SpiritGroupType.HarvestChain]: addInstanceToGlobal(new HarvestChain(`${SpiritGroupType.HarvestChain}`, {
        energyBuffer: this.config.harvestLinkBuffer,
        armySupportType: SpiritGroupType.BaseDefenceArmy,
      })),
      [SpiritGroupType.SentryLine]: addInstanceToGlobal(new SentryLine(`${SpiritGroupType.SentryLine}`, {
        sentryCount: this.config.sentryCount, sentryDistance: this.config.sentryDistance,
      })),
      [SpiritGroupType.BaseDefenceArmy]: addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseDefenceArmy}`,
        {pointsReference: PatrolPointsReference.BaseDefence, emitEnemies: true})),
      [SpiritGroupType.BaseAttackArmy]: addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseAttackArmy}`,
        {pointsReference: PatrolPointsReference.BaseAttack, emitEnemies: false})),
    };
  }

  protected firstTimeInitCore() {
    Object.values(globals.groups).forEach(group => group.init());
  }

  protected runCore() {
    this.assigner.preTick();

    Object.values(globals.groups).forEach(group => group.run());

    my_spirits.forEach((spirit) => {
      if (spirit.hp <= 0) {
        return;
      }

      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.role === RoleType.Free) {
        this.assigner.assign(spiritWrapper);
      }
    });

    if (globals.enemySeen) {
      memory.underAttack = true;
      memory.lastSeenTick = memory.tick;
      memory.uniqueEnemies = [...globals.uniqueEnemiesSeen];
    } else if (memory.tick - memory.lastSeenTick > this.config.underAttackBuffer) {
      memory.underAttack = false;
      memory.uniqueEnemies = [];
    }

    this.assigner.postTick();
  }
}
