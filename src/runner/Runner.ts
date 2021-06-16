import {BaseClass} from "../BaseClass";
import {Assigner} from "./assigner/Assigner";
import {initGlobals} from "../globals/initGlobals";
import {getDistance} from "../utils/GridUtils";
import {getSpiritWrapper} from "../globals/globals";
import {EnemyArmyDetection} from "../enemy/EnemyArmyDetection";

export abstract class Runner<ConfigType> extends BaseClass {
  protected readonly assigner: Assigner<any>;
  protected readonly config: ConfigType;

  // protected enemyArmyDetection: EnemyArmyDetection;

  constructor(id: string, assigner: Assigner<any>, config: ConfigType) {
    super(id);
    this.assigner = assigner;
    this.config = config;
  }

  public run() {
    // console.log(JSON.stringify(memory));
    // console.log(my_spirits.length, Object.keys(spirits).length - my_spirits.length);
    // console.log(memory.tick, star_zxq.energy, star_a1c.energy, star_p89.energy);

    this.init();

    memory.tick++;

    // mark all my_spirits as friendly
    my_spirits.forEach(spirit => getSpiritWrapper(spirit.id).setIsFriendly(true));

    // this.enemyArmyDetection.run();
    this.runCore();
  }

  protected firstTimeInit() {
    memory.tick = memory.lastSeenTick = 0;
    memory.ids = {};
    memory.baseStar = getDistance(base, star_a1c) > getDistance(base, star_zxq) ? "star_zxq" : "star_a1c";
    memory.uniqueEnemies = [];
  }

  protected init() {
    let firstTimeInit = !("tick" in memory);
    if (firstTimeInit) {
      this.firstTimeInit();
    }

    initGlobals();

    this.initCore();
    if (firstTimeInit) {
      this.firstTimeInitCore();
      // this.enemyArmyDetection.init();
    }
  }

  protected abstract firstTimeInitCore();

  protected abstract initCore();

  protected abstract runCore();
}
