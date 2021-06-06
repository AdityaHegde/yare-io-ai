import {Player} from "./Player";
import {EnergyImpl} from "./impl/EnergyImpl";
import {SpiritImpl} from "./impl/SpiritImpl";

export class Game {
  public players: Array<Player>;
  public star_zxq: EnergyImpl;
  public star_a1c: EnergyImpl;

  public spirits: {
    [k in string]: Spirit
  } = {};

  constructor() {
    this.players = [
      new Player("one", this),
      new Player("two", this),
    ];
  }

  public init() {
    this.star_zxq = new EnergyImpl("star_zxq", [500, 750]);
    this.star_a1c = new EnergyImpl("star_a1c", [1500, 1750]);

    this.players.forEach((player, index) => {
      player.bootstrapData(index);
      player.spirits.forEach((spirit) => {
        this.spirits[spirit.id] = spirit;
      });
      player.on(Player.SPIRIT_CREATED, spirit => this.spirits[spirit.id] = spirit);
    });
  }

  public spiritDestroyed(spirit: SpiritImpl) {
    delete this.spirits[spirit.id];

    ((spirit as any).owner as Player).spiritDestroyed(spirit);
  }

  public getGlobalsForPlayer(index: number): Record<string, any> {
    const player = this.players[index];
    const enemyPlayer = this.players[(index + 1) % this.players.length];
    const globalAlias: Record<string, any> = {};

    globalAlias.spirits = this.spirits;
    globalAlias.my_spirits = player.spirits;
    globalAlias.base = player.base;
    globalAlias.enemy_base = enemyPlayer.base;
    globalAlias.star_zxq = this.star_zxq;
    globalAlias.star_a1c = this.star_a1c;
    globalAlias.memory = player.memory;

    return globalAlias;
  }
}
