import {Position} from "@adityahegde/yare-io-local/dist/globals/gameTypes";
import {inMemory} from "../memory/inMemory";
import {getPointSign, moveToPoint} from "../utils/GridUtils";
import {getSpiritWrapper, globals} from "../globals/globals";
import {Memory} from "../memory/Memory";
import {BaseClass} from "../BaseClass";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Cluster} from "../utils/Clustering";

@Memory("armyDetection")
export abstract class EnemyArmyDetection extends BaseClass {
  @inMemory()
  public detectionBorder: Array<Position>;

  @inMemory()
  public detectionDirection: number;

  public init() {
    this.detectionBorder = [
      moveToPoint(enemy_base.position, globals.baseStar.position, 300),
      moveToPoint(globals.enemyStar.position, base.position, 300),
    ];
    this.detectionDirection = -getPointSign(this.detectionBorder[0], this.detectionBorder[1], base.position);
    console.log(this.detectionBorder, this.detectionDirection);
  }

  public run() {
    const detectedSpiritWrappers = this.preProcessSpirits();
    const clusters = this.clusterEnemySpiritWrappers(detectedSpiritWrappers);

    console.log(clusters);
  }

  protected preProcessSpirits(): Array<SpiritWrapper> {
    const detectedSpiritWrappers = new Array<SpiritWrapper>();

    Object.keys(spirits).forEach((spiritId) => {
      const spiritWrapper = getSpiritWrapper(spiritId);

      // console.log(getPointSign(this.detectionBorder[0], this.detectionBorder[1], spiritWrapper.entity.position));
      if (spiritWrapper.isFriendly ||
          getPointSign(this.detectionBorder[0], this.detectionBorder[1], spiritWrapper.entity.position) !== this.detectionDirection) {
        return;
      }

      if (!this.preProcessSpiritWrapper(spiritWrapper)) {
        return;
      }

      detectedSpiritWrappers.push(spiritWrapper);
    });

    return detectedSpiritWrappers;
  }

  protected abstract preProcessSpiritWrapper(spiritWrapper: SpiritWrapper): boolean;

  protected abstract clusterEnemySpiritWrappers(spiritWrappers: Array<SpiritWrapper>): Array<Cluster>;
}
