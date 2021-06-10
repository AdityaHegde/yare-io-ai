import {TargetPoolType} from "./TargetPool";
import {EnergyTargetPool} from "./EnergyTargetPool";
import {EnergyStorageTargetPool} from "./EnergyStorageTargetPool";
import {EnemyBaseTargetPool} from "./EnemyBaseTargetPool";
import {EnemySpiritTargetPool} from "./EnemySpiritTargetPool";

export type TargetPoolsMapType = {
  [TargetPoolType.Energy]: EnergyTargetPool;
  [TargetPoolType.EnergyStorage]: EnergyStorageTargetPool;
  [TargetPoolType.EnemyBase]: EnemyBaseTargetPool;
  [TargetPoolType.EnemySpirit]: EnemySpiritTargetPool;
}
