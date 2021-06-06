export function moveAlongPoint(pos1: Position, pos2: Position, distance: number): Position {
  const angle = Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
  return [
    pos1[0] + Math.round(Math.cos(angle) * distance),
    pos1[1] + Math.round(Math.sin(angle) * distance),
  ];
}
