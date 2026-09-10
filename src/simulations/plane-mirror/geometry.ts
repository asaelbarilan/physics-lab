export interface Point { x: number; y: number }
export interface Mirror { x: number; bottom: number; top: number }
export function reflectPoint(p: Point, mirrorX: number): Point {
  return { x: 2 * mirrorX - p.x, y: p.y };
}
/** Intersection of the eye–virtual-image segment with a vertical mirror. */
export function reflectionPath(source: Point, eye: Point, mirror: Mirror) {
  if (![source.x, source.y, eye.x, eye.y, mirror.x, mirror.bottom, mirror.top].every(Number.isFinite)) throw new Error('Non-finite coordinate');
  if (mirror.top < mirror.bottom) throw new Error('Invalid mirror bounds');
  if (source.x >= mirror.x || eye.x >= mirror.x) throw new Error('Source and eye must be in front of mirror');
  const image = reflectPoint(source, mirror.x);
  const t = (mirror.x - eye.x) / (image.x - eye.x);
  const hit = { x: mirror.x, y: eye.y + t * (image.y - eye.y) };
  const incidence = Math.atan2(Math.abs(source.y - hit.y), mirror.x - source.x);
  const reflection = Math.atan2(Math.abs(eye.y - hit.y), mirror.x - eye.x);
  return { source, eye, image, hit, incidence, reflection, visible: hit.y >= mirror.bottom - 1e-9 && hit.y <= mirror.top + 1e-9 };
}
export const degrees = (radians: number) => radians * 180 / Math.PI;
export function objectPoints(distance: number, height: number) {
  return [ ['ראש', 1], ['אף', .9], ['חזה', .7], ['ברך', .3], ['כף רגל', 0] ].map(([name, ratio]) => ({ name: String(name), x: -distance, y: height * Number(ratio) }));
}
