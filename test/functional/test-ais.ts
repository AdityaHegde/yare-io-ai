import {BlankRenderer, Game, GameRunner, LocalAIRunner, Logger, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {Player} from "@adityahegde/yare-io-local/dist/Player";
import {getBasicGroupRunner} from "../../src/runner/factory/groupRunnerFactory";
import {getBasicRoleRunner} from "../../src/runner/factory/roleRunnerFactory";

const logger = new Logger("Test");
const game = new Game([SpiritType.Circle, SpiritType.Circle]);
const yare = new Yare(
  game,
  new GameRunner(game, [
    new LocalAIRunner(() => {
      getBasicGroupRunner().run();
    }), new LocalAIRunner(() => {
      getBasicRoleRunner().run();
    }),
  ]),
  new BlankRenderer(game),
  { runIntervalInMs: 5 },
);
function playerEndCondition(player: Player) {
  return player.base.hp <= 0 || player.base.hasReachedMaxSpirits();
}
yare.init().then(async () => {
  while(game.players.every(player => !playerEndCondition(player))) {
    await yare.tick();
  }
  logger.log(`Final Tally.`);
  game.players.forEach(player => logger.log(`SpiritCount=${player.spirits.length}`));
});
