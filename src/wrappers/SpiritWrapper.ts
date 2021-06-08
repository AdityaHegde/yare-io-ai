import {BaseWrapper} from "./BaseWrapper";
import {Memory} from "../memory/Memory";
import {inMemory} from "../memory/inMemory";
import {RoleType} from "../role/Role";

@Memory("spirits")
export class SpiritWrapper extends BaseWrapper<Spirit> {
  @inMemory(() => RoleType.Free)
  public role: RoleType;

  @inMemory(() => 0)
  public task: number;

  @inMemory(() => "")
  public targetId: string;

  public freshSpirit: boolean;
  public energyExcess: number;

  constructor(entity: Spirit) {
    super(entity);

    this.freshSpirit = memory.spirits && !(entity.id in memory.spirits);
    this.energyExcess = entity.energy;
  }

  // Aliases
  public move(position: Position) {
    this.entity.move(position);
  }
  public energize(target: Intractable) {
    this.entity.energize(target);
  }
  public merge(target: Spirit) {
    this.entity.merge(target);
  }
  public divide() {
    this.entity.divide();
  }
  public isFull() {
    return this.entity.energy === this.entity.energy_capacity;
  }
  public isEmpty() {
    return this.entity.energy <= 0;
  }

  // Operations
  public checkAlive(): boolean {
    if (this.entity.hp > 0) {
      return true;
    }
    this.destroy();
    return false;
  }

  // public getEnemyInRange(): Spirit {
  //   return this.entity.sight.enemies.find(enenmy => enenmy.)
  // }

  // Misc
  public static getInstanceById(id: string): SpiritWrapper {
    return new this(spirits[id]);
  }
}
