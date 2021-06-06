import {Player} from "../Player";
import {isWithinRange} from "../../../../src/utils/getDistance";
import {MOVE_DISTANCE} from "../../../../src/constants";
import {Logger} from "ts-loader/dist/logger";
import {Log} from "../../../../src/utils/Logger";
import {moveAlongPoint} from "../../Grid";
import {BaseImpl} from "./BaseImpl";

const ORIGINAL_DISTANCE = 200 * 200;

@Log
export class SpiritImpl implements Spirit {
  public id: string;
  public hp = 1;
  public energy: number;
  public energy_capacity: number;
  public size: number;
  public position: Position;
  public sight: Sight;

  public owner: Player;

  private logger: Logger;

  constructor(
    id: string, energy_capacity: number,
    size: number, position: Position,
    owner: Player,
  ) {
    this.id = id;
    this.energy = this.energy_capacity = energy_capacity;
    this.size = size;
    this.position = position;
    this.owner = owner;
  }

  public divide(): void {
  }

  public energize(target: Intractable): void {
    if (target === this) {
      let star: Energy;
      if (isWithinRange(this, this.owner.game.star_a1c, ORIGINAL_DISTANCE)) {
        star = this.owner.game.star_a1c;
      } else if (isWithinRange(this, this.owner.game.star_zxq, ORIGINAL_DISTANCE)) {
        star = this.owner.game.star_zxq;
      }
      if (!star) {
        return;
      }
      this.energy = Math.min(this.energy + this.size, this.energy_capacity);
      return;
    }

    if (!isWithinRange(this, target, ORIGINAL_DISTANCE) || this.energy === 0) {
      return;
    }

    const targetOwner = (target as any).owner;
    const energyEntity: EnergyEntity = target as any;
    if (!energyEntity.energy_capacity) {
      return;
    }

    const transferEnergy = Math.min(this.size, this.energy);

    if (targetOwner === this.owner) {
      energyEntity.energy = Math.min(energyEntity.energy + transferEnergy, energyEntity.energy_capacity);
    } else {
      if (energyEntity.energy > 0) {
        energyEntity.energy = Math.max(energyEntity.energy - 2 * transferEnergy, 0);
      } else {
        energyEntity.hp = Math.max(0, energyEntity.hp - transferEnergy);
      }
    }

    this.energy -= transferEnergy;
  }

  public merge(target: Spirit): void {
  }

  public move(position: Position): void {
    this.position = moveAlongPoint(this.position, position, MOVE_DISTANCE);
    (enemy_base as BaseImpl).enemySpiritMoved(this);
  }
}
