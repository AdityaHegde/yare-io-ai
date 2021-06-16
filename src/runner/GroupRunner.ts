import {Runner} from "./Runner";
import {addInstanceToGlobal, getSpiritWrapper, globals} from "../globals/globals";
import {SpiritGroupType} from "../group/SpiritGroupType";
import {HarvestChain} from "../group/harvest-chain/HarvestChain";
import {SentryLine} from "../group/SentryLine";
import {PatrolArmy} from "../group/PatrolArmy";
import {PatrolPointsReference} from "../data/getPatrolPoints";
import {Log} from "../utils/Logger";
import {GroupsMapType} from "../group/GroupsMapType";
import {GroupAssigner} from "./assigner/GroupAssigner";
import {Harasser} from "../group/Harasser";
import {SimpleHarvester} from "../group/SimpleHarvester";
import {ATTACKER_COUNT} from "../constants";

export type GroupRunnerConfig = {
  harvestLinkBufferMin: number;
  harvestLinkBufferMax: number;
  harvestLinkBufferScale: number;

  underAttackBuffer: number;

  sentryCount: number;
  sentryDistance: number;
}

export class GroupRunner extends Runner<GroupRunnerConfig> {
  protected groups: GroupsMapType;

  protected initCore() {
    this.groups = {
      [SpiritGroupType.Harvester]: addInstanceToGlobal(new HarvestChain(`${SpiritGroupType.Harvester}`, {
        energyBufferMin: this.config.harvestLinkBufferMin, energyBufferMax: this.config.harvestLinkBufferMax,
        energyBufferScale: this.config.harvestLinkBufferScale,
        star: globals.baseStar, supply: base,
      })),
      [SpiritGroupType.MidStarHarvester]: addInstanceToGlobal(new HarvestChain(`${SpiritGroupType.MidStarHarvester}`, {
        energyBufferMin: this.config.harvestLinkBufferMin, energyBufferMax: this.config.harvestLinkBufferMax,
        energyBufferScale: this.config.harvestLinkBufferScale,
        star: star_p89, supply: base,
      })),
      [SpiritGroupType.SentryLine]: addInstanceToGlobal(new SentryLine(`${SpiritGroupType.SentryLine}`, {
        sentryCount: this.config.sentryCount, sentryDistance: this.config.sentryDistance,
      })),
      [SpiritGroupType.BaseDefenceArmy]: addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseDefenceArmy}`,
        {
          pointsReference: PatrolPointsReference.BaseDefence, emitEnemies: true,
          waitForFill: false, waitForRally: false,
          maxSpirits: -1,
        })),
      [SpiritGroupType.BaseAttackArmy]: addInstanceToGlobal(new PatrolArmy(`${SpiritGroupType.BaseAttackArmy}`,
        {
          pointsReference: PatrolPointsReference.BaseAttack, emitEnemies: false,
          waitForFill: false, waitForRally: false,
          maxSpirits: ATTACKER_COUNT,
        })),
      [SpiritGroupType.Harasser]: addInstanceToGlobal(new Harasser(`${SpiritGroupType.Harasser}`)),
    };
    (this.assigner as GroupAssigner).groups = this.groups;
    // this.enemyArmyDetection = addInstanceToGlobal(new AngleBasedDetection("one"));
  }

  protected firstTimeInitCore() {
    Object.values(this.groups).forEach(group => group.init());
  }

  protected runCore() {
    Object.values(this.groups).forEach(group => group.filterDeadSpirits());

    this.assigner.preTick();

    my_spirits.forEach((spirit) => {
      if (spirit.hp <= 0) {
        return;
      }

      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.freshSpirit) {
        this.assigner.assign(spiritWrapper);
      }
    });

    Object.values(this.groups).forEach(group => group.run());

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
