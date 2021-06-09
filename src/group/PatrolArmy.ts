import {SingleGroup} from "./SingleGroup";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {getSpiritWrapper} from "../globals/globals";
import {atPosition} from "../utils/GridUtils";
import {getPatrolPoints, PatrolPointsReference} from "../data/getPatrolPoints";
import {attackInRange} from "../utils/SpiritUtils";

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
    this.filterDeadSpirits(this.spiritIds);

    this.spiritIds.forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);
      this.moveSpirit(spiritWrapper);
      attackInRange(spiritWrapper, this.emitEnemies);
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
}
