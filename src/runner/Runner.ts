import {BaseClass} from "../BaseClass";
import {Assigner} from "./assigner/Assigner";
import {initBaseStar, initGlobals} from "../globals/initGlobals";
import {getDistance} from "../utils/GridUtils";

export abstract class Runner<ConfigType> extends BaseClass {
  protected readonly assigner: Assigner<any>;
  protected readonly config: ConfigType;

  constructor(id: string, assigner: Assigner<any>, config: ConfigType) {
    super(id);
    this.assigner = assigner;
    this.config = config;
  }

  public run() {
    this.init();

    memory.tick++;

    // this.logger.logJSON(memory);
    this.logger.log(my_spirits.length, Object.keys(spirits).length - my_spirits.length);

    this.runCore();
  }

  protected firstTimeInit() {
    memory.tick = memory.lastSeenTick = 0;
    memory.ids = {};
    memory.baseStar = getDistance(base, star_a1c) > getDistance(base, star_zxq) ? "star_zxq" : "star_a1c";
    memory.uniqueEnemies = [];
    initBaseStar();

    this.firstTimeInitCore();
  }

  protected init() {
    initBaseStar();
    initGlobals();
    this.initCore();

    if (!("tick" in memory)) {
      this.firstTimeInit();
    }
  }

  protected abstract firstTimeInitCore();

  protected abstract initCore();

  protected abstract runCore();
}
