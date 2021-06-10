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
import {TasksMapType} from "../role/task/TasksMapType";
import {TargetPoolsMapType} from "../role/target/TargetPoolsMapType";
import {RolesMapType} from "../role/RolesMapType";
import {RoleAssigner} from "./assigner/RoleAssigner";

export type RoleRunnerConfig = {
  maxAttackers: number;
  maxDefenders: number;
}

@Log
export class RoleRunner extends Runner<RoleRunnerConfig> {
  protected targetPools: TargetPoolsMapType;
  protected tasks: TasksMapType;
  protected roles: RolesMapType;

  protected initCore() {
    this.targetPools = {
      [TargetPoolType.Energy]: addInstanceToGlobal(new EnergyTargetPool(`${TargetPoolType.Energy}`)),
      [TargetPoolType.EnergyStorage]: addInstanceToGlobal(new EnergyStorageTargetPool(`${TargetPoolType.EnergyStorage}`)),
      [TargetPoolType.EnemyBase]: addInstanceToGlobal(new EnemyBaseTargetPool(`${TargetPoolType.EnemyBase}`)),
      [TargetPoolType.EnemySpirit]: addInstanceToGlobal(new EnemySpiritTargetPool(`${TargetPoolType.EnemySpirit}`)),
    };

    this.tasks = {
      [TaskType.Charge]: addInstanceToGlobal(new BasicChargeTask(`${TaskType.Charge}`, {
        type: TaskType.Charge,
        targetPool: this.targetPools[TargetPoolType.Energy],
      })),
      [TaskType.Store]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.Store}`, {
        type: TaskType.Store,
        targetPool: this.targetPools[TargetPoolType.EnergyStorage],
      })),
      [TaskType.BaseDefend]: addInstanceToGlobal(new BasicDischargeTask(`${TaskType.BaseDefend}`, {
        type: TaskType.BaseDefend,
        targetPool: this.targetPools[TargetPoolType.EnemySpirit] as any,
      })),
      [TaskType.Rally]: addInstanceToGlobal(new RallyTask(`${TaskType.Rally}`, {
        type: TaskType.Rally,
        rallyPoint: moveToPoint(base.position, enemy_base.position, 250),
        attackInRange: false,
      })),
      [TaskType.BaseAttack]: addInstanceToGlobal(new RallyTask(`${TaskType.BaseAttack}`, {
        type: TaskType.Rally,
        // rallyPoint: moveToPoint(enemy_base.position, base.position, 50),
        rallyPoint: moveToPoint(enemy_base.position, (globals.enemyStar && globals.enemyStar.position) || [0, 0], 300),
        attackInRange: true,
      })),
    }

    this.roles = {
      [RoleType.Harvester]: addInstanceToGlobal(new Role(`${RoleType.Harvester}`, {
        type: RoleType.Harvester,
        tasks: [this.tasks[TaskType.Charge], this.tasks[TaskType.Store]],
        startFromScratch: false,
        maxSpirits: -1,
      })),
      [RoleType.Defender]: addInstanceToGlobal(new Role(`${RoleType.Defender}`, {
        type: RoleType.Defender,
        tasks: [this.tasks[TaskType.Charge], this.tasks[TaskType.BaseDefend]],
        startFromScratch: false,
        maxSpirits: this.config.maxDefenders,
      })),
      [RoleType.Attacker]: addInstanceToGlobal(new RallyRole(`${RoleType.Attacker}`, {
        type: RoleType.Attacker,
        tasks: [this.tasks[TaskType.Rally], this.tasks[TaskType.BaseAttack]],
        startFromScratch: true,
        maxSpirits: this.config.maxAttackers,
      })),
    };

    Object.values(this.targetPools).forEach(targetPool => targetPool.updateTargets());

    (this.assigner as RoleAssigner).roles = this.roles;
  }

  protected firstTimeInitCore() {
    Object.values(this.targetPools).forEach(targetPool => targetPool.init());
  }

  protected runCore() {
    for (const spirit of my_spirits) {
      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.entity.hp <= 0) {
        // this.logger.log(`${spiritWrapper.entity.id} has died.`);
        if (spiritWrapper.role) {
          this.roles[spiritWrapper.role].removeSpirit(spiritWrapper);
        }
        spiritWrapper.destroy();
        return;
      }

      if (spiritWrapper.role === RoleType.Free) {
        // this.logger.log(`${spiritWrapper.entity.id} is free.`);
        this.assigner.assign(spiritWrapper);
      }

      if (spiritWrapper.role in this.roles) {
        this.roles[spiritWrapper.role].processSpirit(spiritWrapper);
      }
    }
  }
}
