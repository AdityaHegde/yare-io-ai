import workerpool from "workerpool";
import {BlankRenderer, Game, GameRunner, LocalAIRunner, SpiritType, Yare} from "@adityahegde/yare-io-local";
import {
  getBaseGroupRunnerConfig,
  getHarvesterOnlyGroupAssignerConfig
} from "../../src/runner/factory/groupRunnerFactory";
import {Player} from "@adityahegde/yare-io-local/dist/Player";
import {RunResult} from "./types";
import {GroupRunner} from "../../src/runner/GroupRunner";
import {GroupAssigner} from "../../src/runner/assigner/GroupAssigner";

const MAX_TICK_COUNT = 2000;
function playerEndCondition(player: Player) {
  return player.base.hp <= 0;
}

function getResult(game: Game, yare: Yare): RunResult {
  console.log(game.players[0].spirits.length, game.players[1].spirits.length);

  const result: RunResult = {
    wonIdx: game.players[0].base.hp <= 0 ? 1 : (game.players[1].base.hp <= 0 ? 0 : -1),
    maxSpiritIdx: game.players[0].spirits.length > game.players[1].spirits.length ? 0 : 1,
    errorIdx: yare.errorFrom,
  };

  if (yare.errorFrom >= 0) {
    console.log(yare.errorFrom, yare.errorStack);
  }

  return result;
}

async function run() {
  const game = new Game([SpiritType.Circle, SpiritType.Circle]);
  const yare = new Yare(
    game,
    new GameRunner(game, [
      new LocalAIRunner(() => {
        new GroupRunner(
          "one",
          new GroupAssigner(
            "one",
            getHarvesterOnlyGroupAssignerConfig(),
          ),
          getBaseGroupRunnerConfig(),
        ).run();
      }),
      new LocalAIRunner(() => {
        new GroupRunner(
          "two",
          new GroupAssigner(
            "two",
            getHarvesterOnlyGroupAssignerConfig(),
          ),
          {
            ...getBaseGroupRunnerConfig(),
            forceHarvesterNonHybrid: true,
          },
        ).run();
      }),
    ]),
    new BlankRenderer(game),
    { runIntervalInMs: 5 },
  );

  await yare.init();

  for (
    let i = 0;
    i < MAX_TICK_COUNT && game.players.every(player => !playerEndCondition(player)) && yare.errorFrom === -1;
    i++
  ) {
    await yare.tick();
  }

  return getResult(game, yare);
}

workerpool.worker({
  run,
});
