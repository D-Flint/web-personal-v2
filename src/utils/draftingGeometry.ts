export type Point = { x: number; y: number };
/** Route an orthogonal SVG connector through the midpoint of the chosen starting axis. */
export function wirePath(from: Point, to: Point, axis = 'x') {
  if (axis === 'y') {
    const mid = (from.y + to.y) / 2;
    return `M${from.x} ${from.y}V${mid}H${to.x}V${to.y}`;
  }
  const mid = (from.x + to.x) / 2;
  return `M${from.x} ${from.y}H${mid}V${to.y}H${to.x}`;
}
