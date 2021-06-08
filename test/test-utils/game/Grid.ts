import {Game} from "./Game";
import {isWithinRange} from "../../../src/utils/GridUtils";
import {ORIGINAL_VISUAL_DISTANCE} from "./gameConstants";

export class Grid {
  public readonly game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public tick() {}

  public postTick() {
    this.game.players.forEach(player => player.base.resetSight());

    const spiritImpls = Object.values(this.game.spirits);

    spiritImpls.forEach(spiritImpl => spiritImpl.resetSight());
    spiritImpls.forEach((spiritImpl, i) => {
      for (let j = i + 1; j < spiritImpls.length; j++) {
        const spiritCheckImpl = spiritImpls[j];
        if (isWithinRange(spiritImpl, spiritCheckImpl, ORIGINAL_VISUAL_DISTANCE)) {
          spiritImpl.addSpiritToSight(spiritCheckImpl);
        }
      }

      this.game.players.forEach((player) => {
        if (isWithinRange(spiritImpl, player.base, ORIGINAL_VISUAL_DISTANCE)) {
          player.base.addSpiritToSight(spiritImpl);
        }
      });
    });

    // spiritImpls.filter(spiritImpl => spiritImpl.sight.enemies.length > 0)
    //   .forEach(spiritImpl => console.log(spiritImpl.id, JSON.stringify(spiritImpl.sight)));
  }
}
