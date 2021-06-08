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

  return [
    moveToPoint(base.position, enemy_base.position, 300),
    moveToPoint(base.position, globals.enemyStar.position, 300),
  ];
}

function getBaseAttackPoints() {
  return [enemy_base.position];
}
