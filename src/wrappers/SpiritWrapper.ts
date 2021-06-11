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
  public entropy: number;

  constructor(entity: Spirit) {
    super(entity);

    this.freshSpirit = memory.spirits && !(entity.id in memory.spirits);
    this.entropy = entity.energy;
  }

  // Aliases
  public move(position: Position) {
    this.entity.move(position);
  }
  public energize(target: Intractable) {
    this.entity.energize(target);
    if (this.entity !== target) {
      this.removePotentialEnergy(this);
    }
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

  public hasSpaceForEnergy(source: SpiritWrapper) {
    return this.entropy + source.entity.size <= (this.entity.energy_capacity - this.entity.size);
  }

  public addPotentialEnergy(source: SpiritWrapper) {
    this.entropy += source.entity.size;
  }

  public hasEntropy() {
    return this.entropy >= 0;
  }

  public removePotentialEnergy(source: SpiritWrapper, isAttack = false) {
    this.entropy -= source.entity.size * (isAttack ? 2 : 1);
  }

  public entropyIsAboveThreshold(threshold: number) {
    return this.entropy / this.entity.energy_capacity >= threshold;
  }

  // Misc
  public static getInstanceById(id: string): SpiritWrapper {
    return new this(spirits[id]);
  }
}
