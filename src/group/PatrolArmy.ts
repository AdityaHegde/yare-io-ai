import {SingleGroup} from "./SingleGroup";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {getSpiritWrapper, globals} from "../globals/globals";
import {atPosition, isWithinRange} from "../utils/GridUtils";
import {getPatrolPoints, PatrolPointsReference} from "../data/getPatrolPoints";

export class PatrolArmy extends SingleGroup {
  @inMemory()
  public patrolPoints: Array<Position>;

  public pointsReference: PatrolPointsReference;
  public emitEnemies: boolean;

  constructor(id: string, {
    pointsReference, emitEnemies,
  }: {
    pointsReference: PatrolPointsReference,
    emitEnemies: boolean,
  }) {
    super(id);
    this.pointsReference = pointsReference;
    this.emitEnemies = emitEnemies;
  }

  public init() {
    this.patrolPoints = getPatrolPoints(this.pointsReference);
  }

  public run() {
    const spiritWrappers = new Array<SpiritWrapper>();

    this.spiritIds.forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);
      if (!this.checkAlive(spiritWrapper)) {
        return;
      }

      spiritWrappers.push(spiritWrapper);
      this.moveSpirit(spiritWrapper);
      this.attackInRange(spiritWrapper);
    });
  }

  private moveSpirit(spiritWrapper: SpiritWrapper) {
    if (spiritWrapper.task === null) {
      spiritWrapper.task = 0;
    }

    if (atPosition(spiritWrapper.entity, this.patrolPoints[spiritWrapper.task])) {
      spiritWrapper.task = (spiritWrapper.task + 1) % this.patrolPoints.length;
    }
    spiritWrapper.move(this.patrolPoints[spiritWrapper.task]);
  }

  private attackInRange(spiritWrapper: SpiritWrapper) {
    let attacked = false;
    for (let i = 0; i < spiritWrapper.entity.sight.enemies.length; i++) {
      const enemyWrapper = getSpiritWrapper(spiritWrapper.entity.sight.enemies[i]);
      if (isWithinRange(spiritWrapper.entity, enemyWrapper.entity) && enemyWrapper.energyExcess >= 0) {
        spiritWrapper.energize(enemyWrapper.entity);
        enemyWrapper.energyExcess -= spiritWrapper.entity.size * 2;
        attacked = true;
        break;
      }
    }

    if (!attacked && isWithinRange(spiritWrapper.entity, enemy_base)) {
      spiritWrapper.energize(enemy_base);
    }

    if (spiritWrapper.entity.sight.enemies.length > 0 && this.emitEnemies) {
      globals.enemySeen = true;
    }
  }
}
