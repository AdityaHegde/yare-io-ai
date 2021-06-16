import {ACTION_DISTANCE_SQUARED, GRID_NOISE} from "../constants";

export function getDistance(lhs: Intractable, rhs: Intractable) {
  return getDistanceBetweenPos(lhs.position, rhs.position);
}

export function getDistanceBetweenPos(sourcePos: Position, targetPos: Position) {
  const [lx, ly] = sourcePos;
  const [rx, ry] = targetPos;
  return Math.pow(lx - rx, 2) + Math.pow(ly - ry, 2);
}

export function isWithinRange(lhs: Intractable, rhs: Intractable, dist = ACTION_DISTANCE_SQUARED) {
  return getDistance(lhs, rhs) <= dist;
}

export function getAngleBetweenPos(sourcePos: Position, targetPos: Position): number {
  return Math.atan2(targetPos[1] - sourcePos[1], targetPos[0] - sourcePos[0]);
}

export function moveAtAngle(sourcePos: Position, angle: number, distance: number): Position {
  return [
    sourcePos[0] + Math.round(Math.cos(angle) * distance),
    sourcePos[1] + Math.round(Math.sin(angle) * distance),
  ];
}

export function moveToPoint(sourcePos: Position, targetPos: Position, distance: number): Position {
  return moveAtAngle(sourcePos, getAngleBetweenPos(sourcePos, targetPos), distance);
}

export function atPosition(entity: Intractable, pos: Position) {
  return entity.position[0] >= pos[0] - GRID_NOISE && entity.position[0] <= pos[0] + GRID_NOISE &&
    entity.position[1] >= pos[1] - GRID_NOISE && entity.position[1] <= pos[1] + GRID_NOISE;
}

export function getPointSign(posA: Position, posB: Position, sourcePos: Position) {
  return Math.sign(
    (posB[0] - posA[0]) * (sourcePos[1] - posA[1]) -
    (posB[1] - posA[1]) * (sourcePos[0] - posA[0])
  );
}
