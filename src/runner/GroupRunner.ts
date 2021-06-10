import {Runner} from "./Runner";
import {addInstanceToGlobal, getSpiritWrapper, globals} from "../globals/globals";
import {RoleType} from "../role/Role";
import {SpiritGroupType} from "../group/SpiritGroupType";
import {InitialGroup} from "../group/InitialGroup";
import {HarvestChain} from "../group/HarvestChain";
import {SentryLine} from "../group/SentryLine";
import {PatrolArmy} from "../group/PatrolArmy";
import {PatrolPointsReference} from "../data/getPatrolPoints";
import {Log} from "../utils/Logger";
import {GroupsMapType} from "../group/GroupsMapType";
import {GroupAssigner} from "./assigner/GroupAssigner";

export type GroupRunnerConfig = {
  harvestLinkBufferMin: number;
  harvestLinkBufferMax: number;
  harvestLinkBufferScale: number;

  underAttackBuffer: number;

  sentryCount: number;
  sentryDistance: number;
}

@Log
export class GroupRunner extends Runner<GroupRunnerConfig> {
  protected groups: GroupsMapType;

  protected initCore() {
    const baseDefenceArmy = addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseDefenceArmy}`,
      {pointsReference: PatrolPointsReference.BaseDefence, emitEnemies: true}));
    this.groups = {
      [SpiritGroupType.InitialGroup]: addInstanceToGlobal(new InitialGroup(`${SpiritGroupType.InitialGroup}`)),
      [SpiritGroupType.HarvestChain]: addInstanceToGlobal(new HarvestChain(`${SpiritGroupType.HarvestChain}`, {
        energyBufferMin: this.config.harvestLinkBufferMin, energyBufferMax: this.config.harvestLinkBufferMax,
        energyBufferScale: this.config.harvestLinkBufferScale,
        armySupportGroup: baseDefenceArmy,
      })),
      [SpiritGroupType.SentryLine]: addInstanceToGlobal(new SentryLine(`${SpiritGroupType.SentryLine}`, {
        sentryCount: this.config.sentryCount, sentryDistance: this.config.sentryDistance,
      })),
      [SpiritGroupType.BaseDefenceArmy]: baseDefenceArmy,
      [SpiritGroupType.BaseAttackArmy]: addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseAttackArmy}`,
        {pointsReference: PatrolPointsReference.BaseAttack, emitEnemies: false})),
    };
    (this.assigner as GroupAssigner).groups = this.groups;
  }

  protected firstTimeInitCore() {
    Object.values(this.groups).forEach(group => group.init());
  }

  protected runCore() {
    this.assigner.preTick();

    Object.values(this.groups).forEach(group => group.run());

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
    } else if ((globals.uniqueEnemiesSeen.size === 0 && memory.uniqueEnemies.length === 0) ||
               memory.uniqueEnemies.every(enemyId => !spirits[enemyId]) ||
               memory.tick - memory.lastSeenTick > this.config.underAttackBuffer) {
      memory.underAttack = false;
      memory.uniqueEnemies = [];
    }

    this.assigner.postTick();
  }
}
