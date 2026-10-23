/** Small deterministic PRNG so the artwork is identical on every load. */
export function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Trim numbers for compact SVG path data. */
export const f = (n: number) => String(Math.round(n * 10) / 10)

export const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`

export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0`

/** Almond leaf growing from the origin along +x: length L, half-width W. */
export const leaf = (L: number, W: number) =>
  `M0 0C${f(L * 0.3)} ${f(-W)} ${f(L * 0.72)} ${f(-W * 0.9)} ${f(L)} 0C${f(L * 0.72)} ${f(W * 0.9)} ${f(L * 0.3)} ${f(W)} 0 0Z`

type P = readonly [number, number]

/** Join points with small arcs that bulge to the left of travel (outwards when going clockwise). */
export function scallop(points: P[], bulge = 0.56) {
  let d = ''
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const r = Math.hypot(x1 - x0, y1 - y0) * bulge
    d += `A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y1)}`
  }
  return d
}

/** Ruffled / lobed circle — marigold heads, rosette edges. */
export function lobed(cx: number, cy: number, R: number, n: number, bulge = 0.62) {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R] as const
  })
  return `M${f(pts[0][0])} ${f(pts[0][1])}${scallop(pts, bulge)}Z`
}

export interface Arch {
  xL: number
  xR: number
  /** y where the curve springs from the straight jambs */
  spring: number
  /** radius of each side's curve; > half the span gives a pointed arch */
  r: number
  bottom: number
  /** cusps per side; 0 for a smooth pointed arch */
  lobes?: number
}

/** Mughal pointed arch (optionally cusped), from bottom-left up and over to bottom-right. */
export function archPath({ xL, xR, spring, r, bottom, lobes = 0 }: Arch) {
  const mid = (xL + xR) / 2
  const cL = xL + r
  const apexAngle = Math.acos((mid - cL) / r)
  const apexY = spring - Math.sin(apexAngle) * r
  let d = `M${f(xL)} ${f(bottom)}L${f(xL)} ${f(spring)}`
  if (!lobes) {
    d += `A${f(r)} ${f(r)} 0 0 1 ${f(mid)} ${f(apexY)}A${f(r)} ${f(r)} 0 0 1 ${f(xR)} ${f(spring)}`
  } else {
    const left = Array.from({ length: lobes + 1 }, (_, i) => {
      const a = Math.PI - (Math.PI - apexAngle) * (i / lobes)
      return [cL + Math.cos(a) * r, spring - Math.sin(a) * r] as const
    })
    const right = [...left].reverse().map(([x, y]) => [2 * mid - x, y] as const)
    d += scallop(left) + scallop(right)
  }
  return `${d}L${f(xR)} ${f(bottom)}`
}

export const apexOf = ({ xL, xR, spring, r }: Arch) => {
  const mid = (xL + xR) / 2
  return spring - Math.sqrt(r * r - (mid - xL - r) ** 2)
}

/** Closed smooth blob through jittered points on a circle (Catmull-Rom → Bézier). */
export function blob(cx: number, cy: number, R: number, n: number, jitter: number, seed: number) {
  const r = rng(seed)
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const rr = R + (r() - 0.5) * jitter
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const
  })
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return `${d}Z`
}
