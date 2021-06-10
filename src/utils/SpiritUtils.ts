import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {getSpiritWrapper, globals} from "../globals/globals";
import {isWithinRange} from "./GridUtils";

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
      enemyWrapper.removePotentialEnergy(spiritWrapper);
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
