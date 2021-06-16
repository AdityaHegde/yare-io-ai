import {EnemyArmyDetection} from "./EnemyArmyDetection";
import {getAngleBetweenPos} from "../utils/GridUtils";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Cluster, clusterSpiritWrappers} from "../utils/Clustering";

export class AngleBasedDetection extends EnemyArmyDetection {
  protected preProcessSpiritWrapper(spiritWrapper: SpiritWrapper): boolean {
    if (!spiritWrapper.previousPos) {
      spiritWrapper.previousPos = [...spiritWrapper.entity.position];
      return false;
    }

    spiritWrapper.currentAngle = getAngleBetweenPos(spiritWrapper.previousPos, spiritWrapper.entity.position);

    return true;
  }

  protected clusterEnemySpiritWrappers(spiritWrappers: Array<SpiritWrapper>): Array<Cluster> {
    return clusterSpiritWrappers(spiritWrappers, spiritWrapper => spiritWrapper.currentAngle, Math.PI / 4);
  }
}
