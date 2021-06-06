import {GameRunner} from "./GameRunner";
import {BoardRenderer} from "./graphics/BoardRenderer";
import {Game} from "./Game";

const RUN_INTERVAL = 50;

export class YareIO {
  private readonly gameRunner: GameRunner;
  private readonly boardRenderer: BoardRenderer;

  private runInterval: any;
  private ended = false;

  constructor(game: Game) {
    this.gameRunner = new GameRunner(game);
    this.boardRenderer = new BoardRenderer(game);
  }

  public init(div: HTMLElement) {
    this.gameRunner.init();
    this.boardRenderer.init(div);

    this.gameRunner.on(GameRunner.SPIRIT_CREATED, spirit => this.boardRenderer.spiritCreated(spirit));
    this.gameRunner.on(GameRunner.SPIRIT_DESTROYED, spirit => this.boardRenderer.spiritDestroyed(spirit));
    this.gameRunner.on(GameRunner.BASE_DESTROYED, () => {
      this.ended = true;
      this.pause();
    });

    this.resume();
  }

  public resume() {
    if (this.runInterval || this.ended) {
      return;
    }
    this.runInterval = setInterval(() => {
      this.gameRunner.run();
      this.boardRenderer.draw();
    }, RUN_INTERVAL);
  }

  public pause() {
    if (!this.runInterval) {
      return
    }
    clearInterval(this.runInterval);
    this.runInterval = 0;
  }
}
