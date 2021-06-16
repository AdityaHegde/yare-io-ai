import {SingleGroup} from "./SingleGroup";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {getSpiritWrapper, globals} from "../globals/globals";
import {atPosition} from "../utils/GridUtils";
import {getPatrolPoints, PatrolPointsReference} from "../data/getPatrolPoints";
import {attackInRange} from "../utils/SpiritUtils";

export type PatrolArmyOpts = {
  pointsReference: PatrolPointsReference;
  emitEnemies: boolean;

  waitForRally: boolean;
  waitForFill: boolean;

  maxSpirits: number;
}

export class PatrolArmy extends SingleGroup {
  @inMemory()
  public patrolPoints: Array<Position>;

  public rallyCount = 0;
  @inMemory(() => false)
  public rallied: boolean;
  public fillCount = 0;
  @inMemory(() => false)
  public filled: boolean;

  protected readonly pointsReference: PatrolPointsReference;
  protected readonly emitEnemies: boolean;
  protected readonly waitForRally: boolean;
  protected readonly waitForFill: boolean;

  constructor(id: string, {
    pointsReference, emitEnemies,
    waitForRally, waitForFill,
    maxSpirits,
  }: PatrolArmyOpts) {
    super(id);
    this.pointsReference = pointsReference;
    this.emitEnemies = emitEnemies;
    this.waitForRally = waitForRally;
    this.waitForFill = waitForFill;
    this.maxSpirits = maxSpirits;

    globals.armies.push(this);
  }

  public init() {
    this.patrolPoints = getPatrolPoints(this.pointsReference);
  }

  public run() {
    this.spiritIds.forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);
      if (!attackInRange(spiritWrapper, this.emitEnemies)) {
        this.moveSpirit(spiritWrapper);
      }
    });

    this.rallied = this.rallyCount >= this.maxSpirits;
    this.filled = this.fillCount >= this.maxSpirits;
  }

  private moveSpirit(spiritWrapper: SpiritWrapper) {
    if (spiritWrapper.task === null) {
      spiritWrapper.task = 0;
    }

    if (spiritWrapper.isEntropyFull()) {
      this.fillCount++;
    }

    if (atPosition(spiritWrapper.entity, this.patrolPoints[spiritWrapper.task])) {
      if ((!this.waitForRally || this.rallied) && (!this.waitForFill || this.filled)) {
        spiritWrapper.task = (spiritWrapper.task + 1) % this.patrolPoints.length;
      } else {
        this.rallyCount++;
      }
    }
    spiritWrapper.move(this.patrolPoints[spiritWrapper.task]);
  }
}
