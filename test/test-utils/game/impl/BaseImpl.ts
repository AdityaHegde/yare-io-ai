import {Player} from "../Player";
import {SpiritImpl} from "./SpiritImpl";
import {getDistance, isWithinRange} from "../../../../src/utils/getDistance";
import {SIGHT_RANGE} from "../../../../src/constants";

const SPIRIT_COST = 50;

export class BaseImpl implements Base {
  public id: string;
  public hp = 100;
  public energy = 0;
  public energy_capacity: number;
  public size = 40;
  public position: Position;
  public sight: Sight = {
    enemies: [],
    friends: [],
    structures: [],
  };
  public structure_type = "base";

  public owner: Player;

  private spiritIdx = -1;

  constructor(
    id: string, energy_capacity: number, position: Position,
    owner: Player,
  ) {
    this.id = id;
    this.energy_capacity = energy_capacity;
    this.position = position;
    this.owner = owner;
  }

  public createSpirit(position: Position) {
    this.spiritIdx++;
    return new SpiritImpl(
      `${this.owner.name}${this.spiritIdx}`, 10, 1, position, this.owner,
    );
  }

  public createSpiritIfEnoughEnergy() {
    while (this.energy >= SPIRIT_COST) {
      this.owner.addNewSpirit(this.createSpirit([
        this.position[0] + 5,
        this.position[1] + 5,
      ]));
      this.energy -= SPIRIT_COST;
    }
  }

  public enemySpiritMoved(spirit: SpiritImpl) {
    const idx = this.sight.enemies.indexOf(spirit.id);

    if (isWithinRange(this, spirit, SIGHT_RANGE)) {
      if (idx === -1) {
        this.sight.enemies.push(spirit.id);
      }
    } else {
      if (idx >= 0) {
        this.sight.enemies.splice(idx, 1);
      }
    }
  }
}
