import {moveToPoint} from "../utils/GridUtils";
import {globals} from "../globals/globals";

export enum PatrolPointsReference {
  BaseDefence,
  BaseAttack,
}

export function getPatrolPoints(pointsReference: PatrolPointsReference): Array<Position> {
  switch (pointsReference) {
    case PatrolPointsReference.BaseDefence:
      return getBaseDefencePoints();
    case PatrolPointsReference.BaseAttack:
      return getBaseAttackPoints();
  }

  return [];
}

function getBaseDefencePoints() {
  // const angleBetweenBases =
  //   Math.atan2(enemy_base.position[1] - base.position[1], enemy_base.position[0] - base.position[0]);

  const basePoint = moveToPoint(base.position, enemy_base.position, 50);

  return [
    basePoint,
    // moveToPoint(basePoint, globals.baseStar.position, 500),
  ];
}

function getBaseAttackPoints() {
  return [
    moveToPoint(base.position, globals.baseStar.position, 300),
    moveToPoint(enemy_base.position, globals.enemyStar.position, 300),
  ];
}
