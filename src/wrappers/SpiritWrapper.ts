import {BaseWrapper} from "./BaseWrapper";
import {Memory} from "../memory/Memory";
import {inMemory} from "../memory/inMemory";

@Memory("spirits")
export class SpiritWrapper extends BaseWrapper<Spirit> {
  @inMemory(() => 0)
  public task: number;

  @inMemory(() => 0)
  public subTask: number;

  @inMemory(() => "")
  public targetId: string;

  @inMemory(() => null)
  public previousPos: Position;
  @inMemory(() => null)
  public previousAngle: number;
  public currentAngle: number;

  public freshSpirit: boolean;
  public entropy: number;

  public isFriendly: boolean;

  constructor(entity: Spirit) {
    super(entity);

    this.freshSpirit = !memory.spirits || !(entity.id in memory.spirits);
    // we need to go through enemy's hp. hence adding 1 to entropy
    this.entropy = entity.energy + (this.isFriendly ? 0 : 1);
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
  public shout(message: string) {
    this.entity.shout(message);
  }

  // Operations
  public hasSpaceForEnergy(source: SpiritWrapper) {
    return this.entropy + source.entity.size <= (this.entity.energy_capacity - this.entity.size);
  }

  public addPotentialEnergy(source: SpiritWrapper) {
    this.entropy += source.entity.size;
  }

  public hasEntropy() {
    return this.entropy > 0;
  }

  public removePotentialEnergy(source: SpiritWrapper, isAttack = false) {
    this.entropy -= source.entity.size * (isAttack ? 2 : 1);
  }

  public entropyIsAboveThreshold(threshold: number) {
    return this.entropy / this.entity.energy_capacity >= threshold;
  }

  public isEntropyFull() {
    return this.entropy === this.entity.energy_capacity;
  }

  // Misc
  public setIsFriendly(isFriendly: boolean): SpiritWrapper {
    this.isFriendly = isFriendly;
    if (this.isFriendly === undefined && !isFriendly) {
      // assume enemies will attack
      this.entropy -= this.entity.size;
    }
    return this;
  }

  public static getInstanceById(id: string): SpiritWrapper {
    return new this(spirits[id]);
  }
}
