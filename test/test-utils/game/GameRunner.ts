import {Game} from "./Game";
import {Log, Logger} from "../../../src/utils/Logger";
import {runLoop} from "../../../src/runLoop";
import EventEmitter from "events";
import {SpiritImpl} from "./impl/SpiritImpl";
import {Player} from "./Player";

@Log
export class GameRunner extends EventEmitter {
  private logger: Logger;

  public game: Game;

  public static SPIRIT_DESTROYED = "spirit-destroyed";
  public static SPIRIT_CREATED = "spirit-created";
  public static BASE_DESTROYED = "base-destroyed";

  constructor(game: Game) {
    super();
    this.game = game;
  }

  public init() {
    this.game.init();
    this.game.players.forEach((player) => {
      player.on(Player.SPIRIT_CREATED, spirit => this.emit(GameRunner.SPIRIT_CREATED, spirit));
      player.on(Player.SPIRIT_DESTROYED, spirit => this.emit(GameRunner.SPIRIT_DESTROYED, spirit));
    });
  }

  public run() {
    this.tick();
    this.postTick();
  }

  private tick() {
    for (let i = 0; i < this.game.players.length; i++) {
      this.tickForPlayer(i);
    }
  }

  private postTick() {
    for (let i = 0; i < this.game.players.length; i++) {
      this.postTickForPlayer(i);
    }
  }

  private tickForPlayer(index: number) {
    // this.logger.log(`Tick player=${this.game.players[index].name} code`);
    const playerGlobal = this.game.getGlobalsForPlayer(index);

    for (const k in playerGlobal) {
      if (Object.prototype.hasOwnProperty.call(playerGlobal, k)) {
        global[k] = playerGlobal[k];
      }
    }

    runLoop();
  }

  private postTickForPlayer(index: number) {
    const player = this.game.players[index];
    // this.logger.log(`PostTick player=${player.name} code`);

    player.spirits
      .filter(spirit => spirit.hp === 0)
      .forEach(spirit => this.game.spiritDestroyed(spirit));

    if (player.base.hp === 0) {
      this.logger.log(`Base destroyed player=${player.name}`);
      this.emit(GameRunner.BASE_DESTROYED, player);
    }

    player.base.createSpiritIfEnoughEnergy();
  }
}
