export function getDistance(lhs: Intractable, rhs: Intractable) {
  const [lx, ly] = lhs.position;
  const [rx, ry] = rhs.position;
  return Math.pow(lx - rx, 2) + Math.pow(ly - ry, 2);
}
