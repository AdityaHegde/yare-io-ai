import {Runner} from "./Runner";
import {addInstanceToGlobal, getSpiritWrapper, globals} from "../globals/globals";
import {Role, RoleType} from "../role/Role";
import {TargetPoolType} from "../role/target/TargetPool";
import {EnergyTargetPool} from "../role/target/EnergyTargetPool";
import {EnergyStorageTargetPool} from "../role/target/EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "../role/target/EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "../role/target/EnemySpiritTargetPool";
import {TaskType} from "../role/task/Task";
import {BasicChargeTask} from "../role/task/BasicChargeTask";
import {BasicDischargeTask} from "../role/task/BasicDischargeTask";
import {RallyTask} from "../role/task/RallyTask";
import {moveToPoint} from "../utils/GridUtils";
import {RallyRole} from "../role/RallyRole";
import {Log} from "../utils/Logger";

type RoleRunnerConfig = {
  maxAttackers: number;
  maxDefenders: number;
}

@Log
export class RoleRunner extends Runner<RoleRunnerConfig> {
  protected initCore() {
    globals.targetPools = {
      [TargetPoolType.Energy]: addInstanceToGlobal(new EnergyTargetPool(`${TargetPoolType.Energy}`)),
      [TargetPoolType.EnergyStorage]: addInstanceToGlobal(new EnergyStorageTargetPool(`${TargetPoolType.EnergyStorage}`)),
      [TargetPoolType.EnemyBase]: addInstanceToGlobal(new EnemyBaseTargetPool(`${TargetPoolType.EnemyBase}`)),
      [TargetPoolType.EnemySpirit]: addInstanceToGlobal(new EnemySpiritTargetPool(`${TargetPoolType.EnemySpirit}`)),
    };

    globals.tasks = {
      [TaskType.Charge]: addInstanceToGlobal(new BasicChargeTask(`${TaskType.Charge}`, {
        type: TaskType.Charge,
        targetPool: globals.targetPools[TargetPoolType.Energy],
      })),
      [TaskType.Store]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.Store}`, {
        type: TaskType.Store,
        targetPool: globals.targetPools[TargetPoolType.EnergyStorage],
      })),
      [TaskType.BaseDefend]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BaseDefend}`, {
        type: TaskType.BaseDefend,
        targetPool: globals.targetPools[TargetPoolType.EnemySpirit] as any,
      })),
      [TaskType.Rally]: addInstanceToGlobal(new RallyTask(`${TaskType.Rally}`, {
        type: TaskType.Rally,
        rallyPoint: moveToPoint(base.position, enemy_base.position, 50),
        attackInRange: false,
      })),
      [TaskType.BaseAttack]: addInstanceToGlobal(new RallyTask(`${TaskType.BaseAttack}`, {
        type: TaskType.Rally,
        rallyPoint: moveToPoint(enemy_base.position, base.position, 50),
        attackInRange: true,
      })),
    }

    globals.roles = {
      [RoleType.Harvester]: addInstanceToGlobal(new Role(`${RoleType.Harvester}`, {
        type: RoleType.Harvester,
        tasks: [globals.tasks[TaskType.Charge], globals.tasks[TaskType.Store]],
        startFromScratch: false,
        maxSpirits: -1,
      })),
      [RoleType.Defender]: addInstanceToGlobal(new Role(`${RoleType.Defender}`, {
        type: RoleType.Defender,
        tasks: [globals.tasks[TaskType.Charge], globals.tasks[TaskType.BaseDefend]],
        startFromScratch: false,
        maxSpirits: this.config.maxDefenders,
      })),
      [RoleType.Attacker]: addInstanceToGlobal(new RallyRole(`${RoleType.Attacker}`, {
        type: RoleType.Attacker,
        tasks: [globals.tasks[TaskType.Rally], globals.tasks[TaskType.BaseAttack]],
        startFromScratch: true,
        maxSpirits: this.config.maxAttackers,
      })),
    };
  }

  protected firstTimeInitCore() {
    Object.values(globals.targetPools).forEach(targetPool => targetPool.init());
  }

  protected runCore() {
    for (const spirit of my_spirits) {
      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.entity.hp <= 0) {
        // this.logger.log(`${spiritWrapper.entity.id} has died.`);
        if (spiritWrapper.role) {
          globals.roles[spiritWrapper.role].removeSpirit(spiritWrapper);
        }
        spiritWrapper.destroy();
        return;
      }

      if (spiritWrapper.role === RoleType.Free) {
        // this.logger.log(`${spiritWrapper.entity.id} is free.`);
        this.assigner.assign(spiritWrapper);
      }

      if (spiritWrapper.role in globals.roles) {
        globals.roles[spiritWrapper.role].processSpirit(spiritWrapper);
      }
    }
  }
}
