import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {getSpiritWrapper, globals} from "../globals/globals";
import {getAngleBetweenPos, getDistance, isWithinRange, moveAtAngle} from "./GridUtils";
import {findInArray} from "./MathUtils";
import {Position} from "@adityahegde/yare-io-local/dist/globals/gameTypes";
import {MOVE_DISTANCE} from "../constants";

export function attackInRange(spiritWrapper: SpiritWrapper, emitEnemies = false) {
  let attacked = false;

  for (let i = 0; i < spiritWrapper.entity.sight.enemies.length; i++) {
    const enemyId = spiritWrapper.entity.sight.enemies[i];

    if (globals.enemiesTargeted.has(enemyId)) {
      continue;
    }

    const enemyWrapper = getSpiritWrapper(enemyId);
    if (isWithinRange(spiritWrapper.entity, enemyWrapper.entity) && enemyWrapper.hasEntropy()) {
      spiritWrapper.energize(enemyWrapper.entity);
      enemyWrapper.removePotentialEnergy(spiritWrapper, true);
      attacked = true;

      if (!enemyWrapper.hasEntropy()) {
        globals.enemiesTargeted.add(enemyId);
      }

      break;
    }
  }

  if (!attacked && isWithinRange(spiritWrapper.entity, enemy_base)) {
    spiritWrapper.energize(enemy_base);
    attacked = true;
  }

  if (emitEnemies && spiritWrapper.entity.sight.enemies.length > 0) {
    globals.enemySeen = true;
    spiritWrapper.entity.sight.enemies.forEach(enemyId => globals.uniqueEnemiesSeen.add(enemyId));
  }

  return attacked;
}

export function avoidEnemy(spiritWrapper: SpiritWrapper, maintainDistance: number): boolean {
  if (spiritWrapper.entity.sight.enemies.length === 0) {
    return false;
  }

  const [nearestEnemy] = getClosestSpirit(spiritWrapper, spiritWrapper.entity.sight.enemies);

  if (getDistance(spiritWrapper.entity, nearestEnemy.entity) <= maintainDistance) {
    spiritWrapper.move(moveAtAngle(spiritWrapper.entity.position, getAngleBetweenPos(
      nearestEnemy.entity.position, spiritWrapper.entity.position,
    ), MOVE_DISTANCE));
    return true;
  }

  return false;
}

export function getClosestSpirit(spiritWrapper: SpiritWrapper, spiritIds: Array<string>): [SpiritWrapper, number] {
  return findInArray(
    spiritIds.map(spiritId => getSpiritWrapper(spiritId)),
    spiritWrapper => getDistance(spiritWrapper.entity, spiritWrapper.entity),
  );
}
