import { archPath, circle, ellipse, f } from './util'

/**
 * The Taj Mahal, traced from the classic frontal photograph (Wikimedia Commons,
 * “Taj Mahal (Edited).jpeg”) so the proportions match the real building:
 *  - façade 400px wide (x 400–800), side walls 0.41W tall, central iwan 0.49W
 *  - drum 0.41W wide, round dome 0.45W wide × 0.25W tall, broad fluted lotus crown
 *  - chhatris 0.14W wide, right beside the iwan (±0.28W)
 *  - front minarets 0.11W thick, 0.87W tall at ±0.96W; rear pair small (perspective)
 *  - plinth 2.1W wide, 0.12W tall
 * Plinth top at y=532, water line at y=580, centre x=600.
 */

interface Shape {
  d: string
  fill?: string
}

const MARBLE = 'url(#marble-face)'
const SIDE = 'url(#marble-side)'
const FAR = 'url(#marble-far)'
const SHADE = 'url(#arch-shadow)'
const DEEP = '#d3bd8c'
const TRIM = '#efe3c6'
const CX = 600
const PT = 532
const G = 580
const VW = 1200

type Pt = readonly [number, number]

/** Smooth open curve through points (Catmull-Rom → cubic Bézier), without the initial M. */
function through(pts: Pt[]) {
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

/** Mirror a half-profile (offsets from the centre line) into a closed symmetric shape. */
function profile(half: Pt[], close = true) {
  const left = half.map(([dx, y]) => [CX - dx, y] as const)
  const right = [...half].reverse().map(([dx, y]) => [CX + dx, y] as const)
  return `M${f(left[0][0])} ${f(left[0][1])}${through(left)}L${f(right[0][0])} ${f(right[0][1])}${through(right)}${close ? 'Z' : ''}`
}

/** Mughal four-centred arch: broad shoulders and a small point (the iwan's great arch). */
function fourCentred(cx: number, hw: number, spring: number, apex: number, bottom: number) {
  const rise = spring - apex
  return `M${f(cx - hw)} ${f(bottom)}V${f(spring)}C${f(cx - hw)} ${f(spring - rise * 0.34)} ${f(cx - hw * 0.8)} ${f(spring - rise * 0.62)} ${f(cx - hw * 0.45)} ${f(spring - rise * 0.8)}C${f(cx - hw * 0.25)} ${f(spring - rise * 0.9)} ${f(cx - hw * 0.08)} ${f(apex + rise * 0.04)} ${cx} ${f(apex)}C${f(cx + hw * 0.08)} ${f(apex + rise * 0.04)} ${f(cx + hw * 0.25)} ${f(spring - rise * 0.9)} ${f(cx + hw * 0.45)} ${f(spring - rise * 0.8)}C${f(cx + hw * 0.8)} ${f(spring - rise * 0.62)} ${f(cx + hw)} ${f(spring - rise * 0.34)} ${f(cx + hw)} ${f(spring)}V${f(bottom)}Z`
}

/** Pointed niche arch inside a rectangular frame. */
function niche(x0: number, x1: number, top: number, bottom: number, spring: number): Shape[] {
  const span = x1 - x0 - 10
  return [
    { d: `M${f(x0)} ${f(bottom)}V${f(top)}H${f(x1)}V${f(bottom)}` },
    { d: `${archPath({ xL: x0 + 5, xR: x1 - 5, spring, r: span * 0.56, bottom })}Z`, fill: SHADE },
  ]
}

/** Slim pinnacle (guldasta) with a knob and spike. */
const pinnacle = (x: number, base: number, top: number): Shape[] => [
  { d: `M${f(x - 2.4)} ${f(base)}V${f(top + 7)}H${f(x + 2.4)}V${f(base)}Z`, fill: TRIM },
  { d: ellipse(x, top + 4, 3.6, 4), fill: TRIM },
  { d: `M${f(x)} ${f(top)}V${f(top - 6)}` },
]

/** Small onion dome on a base. bulge = widest half-width / base half-width. */
function onion(cx: number, base: number, hw: number, h: number, fill: string, bulge = 1.1): Shape {
  const b = hw * bulge
  return {
    d: `M${f(cx - hw)} ${f(base)}C${f(cx - b)} ${f(base - h * 0.12)} ${f(cx - b * 1.03)} ${f(base - h * 0.34)} ${f(cx - b)} ${f(base - h * 0.46)}C${f(cx - b * 0.94)} ${f(base - h * 0.74)} ${f(cx - hw * 0.42)} ${f(base - h * 0.9)} ${f(cx - hw * 0.08)} ${f(base - h * 0.97)}Q${f(cx)} ${f(base - h * 0.99)} ${f(cx)} ${f(base - h)}Q${f(cx)} ${f(base - h * 0.99)} ${f(cx + hw * 0.08)} ${f(base - h * 0.97)}C${f(cx + hw * 0.42)} ${f(base - h * 0.9)} ${f(cx + b * 0.94)} ${f(base - h * 0.74)} ${f(cx + b)} ${f(base - h * 0.46)}C${f(cx + b * 1.03)} ${f(base - h * 0.34)} ${f(cx + b)} ${f(base - h * 0.12)} ${f(cx + hw)} ${f(base)}Z`,
    fill,
  }
}

/** Minaret measured off the front-left one: offsets above its base, half-widths in px. */
function minaret(cx: number, base: number, s: number, fill: string, out: { shapes: Shape[]; details: string[] }) {
  const y = (off: number) => base - off * s
  const w = (hw: number) => hw * s
  const shaftTop = 271 // offset where the shaft meets the top gallery
  const hwAt = (off: number) => w(24 - (24 - 17.2) * Math.min(1, off / shaftTop))
  const galleries = [95.5, 184.9, 282.2]
  const sh = out.shapes
  sh.push({ d: `M${f(cx - w(30))} ${f(base)}V${f(y(8))}H${f(cx + w(30))}V${f(base)}Z`, fill: TRIM })
  sh.push({ d: `M${f(cx - hwAt(8))} ${f(y(8))}L${f(cx - hwAt(shaftTop))} ${f(y(shaftTop))}H${f(cx + hwAt(shaftTop))}L${f(cx + hwAt(8))} ${f(y(8))}Z`, fill })
  galleries.forEach((g, i) => {
    const hw = w([28.4, 25.9, 23][i])
    // balcony slab, bracket course beneath, pierced railing above
    sh.push({ d: `M${f(cx - hw)} ${f(y(g - 7))}V${f(y(g))}H${f(cx + hw)}V${f(y(g - 7))}Z`, fill: TRIM })
    if (i < 2) sh.push({ d: `M${f(cx - hw + w(2))} ${f(y(g))}V${f(y(g + 6))}H${f(cx + hw - w(2))}V${f(y(g))}`, fill })
    out.details.push(`<path class="dentil" d="M${f(cx - hw + w(3))} ${f(y(g - 10))}H${f(cx + hw - w(3))}" style="stroke-width:${f(3 * s)}"/>`)
  })
  // marble courses between the galleries
  for (let off = 18; off < shaftTop; off += 11) {
    if (galleries.some((g) => off > g - 14 && off < g + 8)) continue
    out.details.push(`<path class="course" d="M${f(cx - hwAt(off) + 1)} ${f(y(off))}H${f(cx + hwAt(off) - 1)}"/>`)
  }
  // lantern: four columns under a sloping chajja, ribbed dome, finial
  const lb = 282.2
  const lt = 306.1
  sh.push({ d: `M${f(cx - w(16.6))} ${f(y(lb))}V${f(y(lt))}H${f(cx + w(16.6))}V${f(y(lb))}Z`, fill: SHADE })
  sh.push({ d: [-16.6, -5.5, 5.5, 16.6].map((dx) => `M${f(cx + w(dx))} ${f(y(lb))}V${f(y(lt))}`).join('') })
  sh.push({ d: `M${f(cx - w(24))} ${f(y(lt - 1.5))}L${f(cx - w(19))} ${f(y(lt + 6.5))}H${f(cx + w(19))}L${f(cx + w(24))} ${f(y(lt - 1.5))}Z`, fill: TRIM })
  sh.push(onion(cx, y(lt + 6.5), w(16.3), 17.5 * s, fill, 1.05))
  sh.push({ d: `M${f(cx)} ${f(y(lt + 24))}V${f(y(349))}` })
  sh.push({ d: ellipse(cx, y(lt + 30), w(2.4), 2.6 * s), fill: TRIM })
}

function building() {
  const out = { shapes: [] as Shape[], details: [] as string[] }
  const sh = out.shapes

  // Rear minarets: far behind the building, so much smaller and paler.
  minaret(364, 527, 0.56, FAR, out)
  minaret(VW - 364, 527, 0.56, FAR, out)

  // Plinth: corner bastions under the minarets and a long blind arcade between.
  sh.push({ d: `M179 ${G}V${PT}H1021V${G}Z`, fill: 'url(#plinth)' })
  sh.push({ d: `M175 ${PT + 2}V${PT - 4}H1025V${PT + 2}Z`, fill: TRIM })
  for (const [a, b] of [
    [179, 262],
    [938, 1021],
  ]) {
    sh.push({ d: `M${a} ${G}V${PT + 2}H${b}V${G}Z`, fill: SIDE })
    sh.push({ d: `M${a + 7} ${G - 6}V${PT + 10}H${b - 7}V${G - 6}Z` })
  }
  const pitch = (938 - 262) / 24
  for (let i = 0; i < 24; i++) {
    const x = 262 + i * pitch
    sh.push({ d: `M${f(x + 3)} ${G - 5}V${PT + 9}H${f(x + pitch - 3)}V${G - 5}` })
    sh.push({ d: `${archPath({ xL: x + 7, xR: x + pitch - 7, spring: 553, r: (pitch - 14) * 0.6, bottom: G - 5 })}Z`, fill: SHADE })
  }

  // Front minarets on the plinth corners.
  minaret(216, PT, 1, MARBLE, out)
  minaret(VW - 216, PT, 1, MARBLE, out)

  // Chhatris beside the iwan, sitting behind the side parapet.
  for (const c of [487.3, VW - 487.3]) {
    sh.push({ d: `M${f(c - 28.4)} 370V344H${f(c + 28.4)}V370Z`, fill: MARBLE })
    for (const dx of [-26.2, -7.8, 10.6])
      sh.push({ d: `${archPath({ xL: c + dx, xR: c + dx + 15.6, spring: 353, r: 9.4, bottom: 368 })}Z`, fill: SHADE })
    sh.push({ d: `M${f(c - 33.5)} 344L${f(c - 28.5)} 336H${f(c + 28.5)}L${f(c + 33.5)} 344Z`, fill: TRIM })
    sh.push({ d: `M${f(c - 26)} 336V331H${f(c + 26)}V336Z`, fill: MARBLE })
    sh.push(onion(c, 331, 26.5, 35, MARBLE, 1.09))
    sh.push({ d: `M${f(c)} 296V279` })
    sh.push({ d: ellipse(c, 288, 2.6, 3), fill: TRIM })
  }

  // Drum with its cornice and band of blind arches.
  sh.push({ d: 'M518.6 336.3V289.7H681.4V336.3Z', fill: MARBLE })
  sh.push({ d: 'M515.6 294.2V288.2H684.4V294.2Z', fill: TRIM })
  sh.push({ d: 'M518.6 312H681.4M518.6 316H681.4' })
  for (let x = 521; x < 676; x += 10.2) out.details.push(`<path class="arcade" d="M${f(x)} 311V303A4.1 4.1 0 0 1 ${f(x + 8.2)} 303V311"/>`)

  // The great dome, traced from the photograph (offsets from the centre line).
  const dome: Pt[] = [
    [83, 289.7],
    [89.7, 270.5],
    [88.3, 254.6],
    [83, 238.6],
    [73.4, 222.7],
    [59.9, 206.7],
    [38.8, 190.1],
  ]
  sh.push({ d: profile(dome), fill: 'url(#dome)' })
  // marble courses curving round the dome
  for (const [yy, hw] of [
    [276, 89.3],
    [258, 88.8],
    [240, 83.5],
    [222, 73],
  ] as const)
    out.details.push(`<path class="dome-course" d="M${f(CX - hw + 2)} ${yy}Q${CX} ${yy + 7} ${f(CX + hw - 2)} ${yy}"/>`)

  // Fluted lotus crown, then the gilded finial with its crescent.
  sh.push({
    d: profile([
      [38.8, 190.1],
      [27, 186.4],
      [16, 180.6],
      [8.5, 175],
      [4, 170],
    ]),
    fill: TRIM,
  })
  for (let i = -4; i <= 4; i++) out.details.push(`<path class="flute" d="M${f(CX + i * 8.4)} 189.6L${f(CX + i * 0.8)} 171"/>`)
  let scallop = `M${f(CX - 38.8)} 190.1`
  for (let i = 1; i <= 10; i++) scallop += `A4.1 4.1 0 0 0 ${f(CX - 38.8 + i * 7.76)} 190.1`
  out.details.push(`<path class="flute" d="${scallop}"/>`)
  sh.push({ d: 'M596.5 170V163H603.5V170Z', fill: TRIM })
  sh.push({ d: ellipse(CX, 155, 5.2, 6.4), fill: 'url(#gold)' })
  sh.push({ d: ellipse(CX, 142.5, 3.9, 4.6), fill: 'url(#gold)' })
  sh.push({ d: ellipse(CX, 134, 3, 3.4), fill: 'url(#gold)' })
  sh.push({ d: 'M600 130.6V125' })
  sh.push({ d: 'M595.2 119.5A4.8 4.8 0 0 0 604.8 119.5A3.9 3.9 0 0 1 595.2 119.5Z', fill: 'url(#gold)' })

  // Façade: chamfered corner bays (angled, a touch darker), flat bays, parapet.
  sh.push({ d: `M400 ${PT}V368.2H447.4V${PT}Z`, fill: SIDE })
  sh.push({ d: `M752.6 ${PT}V368.2H800V${PT}Z`, fill: SIDE })
  sh.push({ d: `M447.4 ${PT}V368.2H752.6V${PT}Z`, fill: MARBLE })
  sh.push({ d: 'M398 380.7V368.2H802V380.7Z', fill: TRIM })
  out.details.push('<path class="frieze" d="M402 374.5H798"/>')
  for (const [x0, x1] of [
    [404.3, 442.6],
    [757.4, 795.7],
  ]) {
    sh.push(...niche(x0, x1, 390.3, 460.5, 416))
    sh.push(...niche(x0, x1, 468.5, 529.1, 494))
  }
  for (const [x0, x1] of [
    [455.4, 509.6],
    [690.4, 744.6],
  ]) {
    sh.push(...niche(x0, x1, 390.3, 457.3, 417.4))
    sh.push(...niche(x0, x1, 465.3, 529.1, 494))
  }
  sh.push({ d: `M447.4 ${PT}V368.2M752.6 ${PT}V368.2` })
  sh.push(...pinnacle(400, 368.2, 336), ...pinnacle(800, 368.2, 336))
  sh.push(...pinnacle(447.4, 368.2, 326.4), ...pinnacle(752.6, 368.2, 326.4))

  // Central iwan: calligraphy frame, spandrels, the great arch, window and door.
  sh.push({ d: `M517.6 ${PT}V336.3H682.4V${PT}Z`, fill: MARBLE })
  sh.push({ d: 'M515.6 338.3V330.3H684.4V338.3Z', fill: TRIM })
  sh.push({ d: `M528.5 511.6V352H671.5V511.6M540.5 511.6V364.7H659.5V511.6` })
  out.details.push('<path class="callig" d="M534.5 509V358.4H665.5V509"/>')
  sh.push({ d: 'M549.6 411V374.3H650.4V411' })
  // floral arabesque scrolls in the spandrels (mirrored)
  for (const m of [1, -1]) {
    const x = (dx: number) => f(CX - m * dx)
    out.details.push(
      `<path class="spandrel" d="M${x(48)} 378C${x(40)} 376 ${x(30)} 380 ${x(26)} 389C${x(23)} 396 ${x(29)} 401 ${x(34)} 397C${x(38)} 393 ${x(34)} 388 ${x(31)} 391M${x(26)} 389C${x(20)} 383 ${x(12)} 381 ${x(6)} 383M${x(40)} 376.5C${x(42)} 371 ${x(46)} 370 ${x(47)} 372.5M${x(14)} 381.6C${x(13)} 377 ${x(9)} 376 ${x(8)} 378"/>`,
    )
  }
  sh.push({ d: fourCentred(CX, 46.3, 420.6, 383.9, PT), fill: SHADE })
  sh.push({ d: 'M553.7 460.5H646.3' })
  sh.push({ d: `${archPath({ xL: 587.2, xR: 612.8, spring: 437, r: 14.5, bottom: 460.5 })}Z`, fill: DEEP })
  out.details.push('<path class="jaali" d="M591 445H609M591 451H609M595 437V460M600 431V460M605 437V460"/>')
  sh.push({ d: `M578.3 ${PT}V465.3H621.7V${PT}` })
  sh.push({ d: `${archPath({ xL: 587.2, xR: 612.8, spring: 496, r: 14.5, bottom: PT })}Z`, fill: DEEP })
  // engaged pilasters at the iwan edges rise into tall pinnacles
  sh.push(...pinnacle(517.6, PT, 300.9), ...pinnacle(682.4, PT, 300.9))

  return out
}

const cypress = (x: number, h: number, w = 12) =>
  `<g class="tree"><path d="M${x} ${G}C${x - w} ${f(G - h * 0.35)} ${f(x - w * 0.6)} ${f(G - h * 0.8)} ${x} ${G - h}C${f(x + w * 0.6)} ${f(G - h * 0.8)} ${x + w} ${f(G - h * 0.35)} ${x} ${G}Z" fill="url(#cypress)"/></g>`

/** Soft canopy: overlapping crowns in three greens rather than a single lollipop. */
const roundTree = (x: number, y: number, r: number) =>
  `<g class="tree"><path d="M${x} ${f(y + r * 0.5)}V${G}" stroke="#5b4a2a" stroke-width="2"/><path d="${circle(x - r * 0.42, y + r * 0.12, r * 0.68)}" fill="#2f6b45"/><path d="${circle(x + r * 0.4, y + r * 0.16, r * 0.64)}" fill="#2a6040"/><path d="${circle(x, y - r * 0.18, r * 0.74)}" fill="#3f7d4f"/><path d="${circle(x - r * 0.22, y - r * 0.34, r * 0.4)}" fill="#5f9a5a" opacity=".75"/></g>`

function trees() {
  const side = (m: (x: number) => number) => [roundTree(m(62), 546, 30), cypress(m(112), 104), cypress(m(142), 142), cypress(m(170), 112)]
  return [...side((x) => x), ...side((x) => VW - x)].join('')
}

/** Distant hedge line, lawn and water run past the drawing's edges so the scene never ends in a box. */
function ground() {
  let hedge = 'M-1600 574'
  for (let x = -1600, i = 0; x < 2800; x += 44, i++) hedge += `q22 ${-(9 + ((i * 7) % 11))} 44 0`
  return `<g class="taj-ground"><path d="${hedge}V${G}H-1600Z" fill="#9fbf7f" opacity=".5"/><path d="M-1600 572H2800V${G}H-1600Z" fill="url(#lawn)"/></g>`
}

function sun() {
  let rays = ''
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2
    const p = (r: number, da: number) => `${f(CX + Math.cos(a + da) * r)} ${f(250 + Math.sin(a + da) * r)}`
    rays += `M${p(90, -0.012)}L${p(700, -0.03)}L${p(700, 0.03)}L${p(90, 0.012)}Z`
  }
  return `<g class="taj-sun"><path class="rays" d="${rays}"/><path class="sun-disc" d="${circle(CX, 250, 300)}" fill="url(#sun)"/></g>`
}

/** The Taj Mahal at sunrise over its reflecting pool. 1200×640, water line at y=580. */
export function taj() {
  const { shapes, details } = building()
  const fills = shapes
    .filter((s) => s.fill)
    .map((s) => `<path d="${s.d}" fill="${s.fill}"/>`)
    .join('')
  const lines = shapes.map((s) => `<path pathLength="1" d="${s.d}"/>`).join('')
  const t = trees()
  return `<svg class="taj" viewBox="0 0 ${VW} 640" aria-hidden="true">
<defs><clipPath id="pool-clip"><rect x="-1600" y="${G}" width="4400" height="${640 - G}"/></clipPath></defs>
${sun()}
${ground()}
<g class="taj-fills">${fills}</g>
<g class="taj-details">${details.join('')}</g>
<g class="taj-lines">${lines}</g>
<g class="taj-trees">${t}</g>
<path class="pool" d="M-1600 ${G}H2800V640H-1600Z" fill="url(#water)"/>
<g class="taj-reflect" clip-path="url(#pool-clip)"><g filter="url(#ripple)"><g transform="matrix(1 0 0 -.35 0 ${f(G * 1.35)})">${fills}${t}</g></g></g>
<path class="shimmer" d="M-520 600H-340M-260 620H-60M140 594H340M440 602H740M840 594H1060M260 616H520M640 624H900M60 632H220M980 632H1160M1300 602H1500M1560 618H1740"/>
</svg>`
}
