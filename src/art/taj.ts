import { archPath, circle, ellipse, f } from './util'

/**
 * The Taj Mahal in elevation, drawn to the real proportions:
 * façade ≈ 2× as wide as it is tall, central iwan ≈ 38% of the width and rising
 * above the roofline, a bulbous onion dome wider than its drum, chhatris on the
 * roof corners, minarets at the plinth corners (rear pair set in and paler).
 *
 * Units: 1u = 4px. Façade width 100u (x 300–700), plinth top at y=532.
 */

/** A shape is filled marble (or shadow) plus a gold outline that draws itself. */
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
const PT = 532 // plinth top
const G = 580 // ground / water line
const CX = 500

/** Arched niche inside a frame — the repeating unit of the façade. */
function niche(x0: number, x1: number, top: number, bottom: number, spring: number, fill = SHADE): Shape[] {
  const span = x1 - x0 - 12
  return [
    { d: `M${x0} ${bottom}V${top}H${x1}V${bottom}` },
    { d: `${archPath({ xL: x0 + 6, xR: x1 - 6, spring, r: span * 0.6, bottom })}Z`, fill },
  ]
}

/** A bay = two stacked niches between the parapet and the plinth. */
const bay = (x0: number, x1: number, fill = SHADE) => [
  ...niche(x0 + 6, x1 - 6, 382, 452, 410, fill),
  ...niche(x0 + 6, x1 - 6, 460, 528, 488, fill),
]

/** Small onion dome on a pavilion — chhatris and minaret tops. */
function onion(cx: number, base: number, hw: number, h: number): Shape {
  const b = hw * 1.18
  return {
    d: `M${f(cx - hw)} ${f(base)}C${f(cx - b)} ${f(base - h * 0.12)} ${f(cx - b * 1.04)} ${f(base - h * 0.32)} ${f(cx - b)} ${f(base - h * 0.42)}C${f(cx - b * 0.92)} ${f(base - h * 0.7)} ${f(cx - hw * 0.4)} ${f(base - h * 0.86)} ${f(cx - hw * 0.06)} ${f(base - h * 0.95)}Q${cx} ${f(base - h * 0.97)} ${cx} ${f(base - h)}Q${cx} ${f(base - h * 0.97)} ${f(cx + hw * 0.06)} ${f(base - h * 0.95)}C${f(cx + hw * 0.4)} ${f(base - h * 0.86)} ${f(cx + b * 0.92)} ${f(base - h * 0.7)} ${f(cx + b)} ${f(base - h * 0.42)}C${f(cx + b * 1.04)} ${f(base - h * 0.32)} ${f(cx + b)} ${f(base - h * 0.12)} ${f(cx + hw)} ${f(base)}Z`,
    fill: MARBLE,
  }
}

function chhatri(cx: number): Shape[] {
  const openings = [-19, -6, 7].flatMap((dx): Shape[] => [
    { d: `${archPath({ xL: cx + dx, xR: cx + dx + 12, spring: 356, r: 8, bottom: 372 })}Z`, fill: SHADE },
  ])
  return [
    { d: `M${cx - 22} 372V342H${cx + 22}V372Z`, fill: MARBLE },
    ...openings,
    { d: `M${cx - 27} 342H${cx + 27}L${cx + 23} 337H${cx - 23}Z`, fill: TRIM },
    { d: `M${cx - 16} 337V331H${cx + 16}V337Z`, fill: MARBLE },
    onion(cx, 331, 16, 34),
    { d: `M${cx} 297V285` },
    { d: circle(cx, 291, 2), fill: TRIM },
  ]
}

/** Tapering minaret: three galleries and a domed lantern. s scales it (rear pair). */
function minaret(cx: number, base: number, s: number, fill: string): Shape[] {
  const shaftTop = base - 232 * s
  const hw0 = 14 * s
  const hw1 = 11 * s
  const hwAt = (y: number) => hw0 - (hw0 - hw1) * ((base - y) / (base - shaftTop))
  const out: Shape[] = [
    { d: `M${f(cx - hw0)} ${base}L${f(cx - hw1)} ${f(shaftTop)}H${f(cx + hw1)}L${f(cx + hw0)} ${base}Z`, fill },
    { d: `M${f(cx - hw0 - 3 * s)} ${base}V${f(base - 10 * s)}H${f(cx + hw0 + 3 * s)}V${base}Z`, fill: TRIM },
  ]
  for (const t of [1 / 3, 2 / 3, 1]) {
    const y = base - (base - shaftTop) * t
    const w = hwAt(y) + 6 * s
    out.push({ d: `M${f(cx - w)} ${f(y)}H${f(cx + w)}V${f(y - 5 * s)}H${f(cx - w)}Z`, fill: TRIM })
    out.push({ d: `M${f(cx - w + 1)} ${f(y - 5 * s)}V${f(y - 10 * s)}H${f(cx + w - 1)}V${f(y - 5 * s)}`, fill })
  }
  // lantern with two columns, eave, dome, finial
  const lb = shaftTop - 10 * s
  const lt = lb - 18 * s
  out.push({ d: `M${f(cx - 12 * s)} ${f(lb)}V${f(lt)}H${f(cx + 12 * s)}V${f(lb)}Z`, fill })
  out.push({ d: `M${f(cx - 4 * s)} ${f(lb)}V${f(lt)}M${f(cx + 4 * s)} ${f(lb)}V${f(lt)}` })
  out.push({ d: `M${f(cx - 15 * s)} ${f(lt)}H${f(cx + 15 * s)}L${f(cx + 12 * s)} ${f(lt - 4 * s)}H${f(cx - 12 * s)}Z`, fill: TRIM })
  out.push({ ...onion(cx, lt - 4 * s, 11 * s, 24 * s), fill })
  out.push({ d: `M${cx} ${f(lt - 28 * s)}V${f(lt - 38 * s)}` })
  return out
}

const pinnacle = (x: number, top: number): Shape[] => [
  { d: `M${x - 2.5} ${top}V${top - 14}H${x + 2.5}V${top}Z`, fill: TRIM },
  { d: circle(x, top - 17, 3), fill: TRIM },
  { d: `M${x} ${top - 20}V${top - 26}` },
]

function building(): Shape[] {
  const plinthArches: Shape[] = []
  for (let x = 178; x <= 806; x += 28) plinthArches.push({ d: `${archPath({ xL: x, xR: x + 16, spring: 562, r: 10, bottom: 576 })}Z`, fill: SHADE })

  return [
    // rear minarets stand further back: set in, a little shorter, paler
    ...minaret(252, 526, 0.86, FAR),
    ...minaret(1000 - 252, 526, 0.86, FAR),
    // plinth with its blind arcade
    { d: `M164 ${G}V${PT}H836V${G}Z`, fill: 'url(#plinth)' },
    { d: `M160 ${PT + 6}V${PT}H840V${PT + 6}Z`, fill: TRIM },
    ...plinthArches,
    // front minarets on the plinth corners
    ...minaret(180, PT, 1, MARBLE),
    ...minaret(820, PT, 1, MARBLE),
    // roof chhatris sit behind the parapet
    ...chhatri(340),
    ...chhatri(660),
    // drum and the great onion dome
    { d: 'M430 312V276H570V312Z', fill: MARBLE },
    { d: 'M430 286H570M430 300H570' },
    {
      d: 'M430 276C418 266 411 248 411 230C411 184 446 146 486 124C494 119 499 116 500 108C501 116 506 119 514 124C554 146 589 184 589 230C589 248 582 266 570 276Z',
      fill: 'url(#dome)',
    },
    { d: 'M434 276H566' },
    { d: 'M486 125Q493 115 500 118Q507 115 514 125' },
    // finial: bulbs, kalash and crescent
    { d: 'M500 110V48' },
    { d: ellipse(CX, 103, 5, 4), fill: TRIM },
    { d: ellipse(CX, 93, 4.5, 3.6), fill: TRIM },
    { d: ellipse(CX, 84, 4, 3.2), fill: TRIM },
    { d: 'M495 76Q493 70 497 67H503Q507 70 505 76Z', fill: TRIM },
    { d: 'M492 58A8 8 0 0 0 508 58A6.5 6.5 0 0 1 492 58Z', fill: TRIM },
    { d: 'M500 54V42' },
    // façade: chamfered corner bays are angled away, so a touch darker
    { d: `M300 ${PT}V372H352V${PT}Z`, fill: SIDE },
    { d: `M648 ${PT}V372H700V${PT}Z`, fill: SIDE },
    { d: `M352 ${PT}V372H648V${PT}Z`, fill: MARBLE },
    { d: 'M298 378V370H702V378Z', fill: TRIM },
    ...bay(300, 352),
    ...bay(352, 424),
    ...bay(576, 648),
    ...bay(648, 700),
    ...pinnacle(300, 370),
    ...pinnacle(700, 370),
    // central iwan with its calligraphy frame, great arch, door and window
    { d: `M424 ${PT}V312H576V${PT}Z`, fill: MARBLE },
    { d: `M432 ${PT}V320H568V${PT}M440 ${PT}V328H560V${PT}` },
    { d: `${archPath({ xL: 452, xR: 548, spring: 412, r: 70, bottom: PT })}Z`, fill: SHADE },
    { d: `${archPath({ xL: 480, xR: 520, spring: 430, r: 26, bottom: 442 })}Z`, fill: DEEP },
    { d: `${archPath({ xL: 474, xR: 526, spring: 482, r: 36, bottom: PT })}Z`, fill: DEEP },
    ...pinnacle(424, 312),
    ...pinnacle(576, 312),
  ]
}

const cypress = (x: number, h: number, w = 13) =>
  `<g class="tree"><path d="M${x} ${G}C${x - w} ${f(G - h * 0.35)} ${f(x - w * 0.6)} ${f(G - h * 0.8)} ${x} ${G - h}C${f(x + w * 0.6)} ${f(G - h * 0.8)} ${x + w} ${f(G - h * 0.35)} ${x} ${G}Z" fill="url(#cypress)"/></g>`
/** Soft canopy: overlapping crowns in three greens rather than a single lollipop. */
const roundTree = (x: number, y: number, r: number) =>
  `<g class="tree"><path d="M${x} ${f(y + r * 0.5)}V${G}" stroke="#5b4a2a" stroke-width="2"/><path d="${circle(x - r * 0.42, y + r * 0.12, r * 0.68)}" fill="#2f6b45"/><path d="${circle(x + r * 0.4, y + r * 0.16, r * 0.64)}" fill="#2a6040"/><path d="${circle(x, y - r * 0.18, r * 0.74)}" fill="#3f7d4f"/><path d="${circle(x - r * 0.22, y - r * 0.34, r * 0.4)}" fill="#5f9a5a" opacity=".75"/></g>`

function trees() {
  const side = (m: (x: number) => number) => [
    roundTree(m(34), 540, 32),
    roundTree(m(150), 552, 22),
    cypress(m(66), 150),
    cypress(m(100), 196),
    cypress(m(132), 160),
  ]
  return [...side((x) => x), ...side((x) => 1000 - x)].join('')
}

function sun() {
  let rays = ''
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2
    const p = (r: number, da: number) => `${f(500 + Math.cos(a + da) * r)} ${f(236 + Math.sin(a + da) * r)}`
    rays += `M${p(80, -0.012)}L${p(600, -0.03)}L${p(600, 0.03)}L${p(80, 0.012)}Z`
  }
  return `<g class="taj-sun"><path class="rays" d="${rays}"/><path class="sun-disc" d="${circle(500, 236, 250)}" fill="url(#sun)"/></g>`
}

/** Distant hedge line, lawn and water run past the drawing's edges so the scene never ends in a box. */
function ground() {
  let hedge = 'M-1600 574'
  for (let x = -1600, i = 0; x < 2600; x += 44, i++) hedge += `q22 ${-(9 + ((i * 7) % 11))} 44 0`
  return `<g class="taj-ground"><path d="${hedge}V${G}H-1600Z" fill="#9fbf7f" opacity=".5"/><path d="M-1600 572H2600V${G}H-1600Z" fill="url(#lawn)"/></g>`
}

/** The Taj Mahal at sunrise over its reflecting pool. 1000×640, water line at y=580. */
export function taj() {
  const all = building()
  const fills = all
    .filter((s) => s.fill)
    .map((s) => `<path d="${s.d}" fill="${s.fill}"/>`)
    .join('')
  const lines = all.map((s) => `<path pathLength="1" d="${s.d}"/>`).join('')
  const t = trees()
  return `<svg class="taj" viewBox="0 0 1000 640" aria-hidden="true">
<defs><clipPath id="pool-clip"><rect y="${G}" width="1000" height="${640 - G}"/></clipPath></defs>
${sun()}
${ground()}
<g class="taj-fills">${fills}</g>
<g class="taj-lines">${lines}</g>
<g class="taj-trees">${t}</g>
<path class="pool" d="M-1600 ${G}H2600V640H-1600Z" fill="url(#water)"/>
<g class="taj-reflect" clip-path="url(#pool-clip)"><g filter="url(#ripple)"><g transform="matrix(1 0 0 -.35 0 ${f(G * 1.35)})">${fills}${t}</g></g></g>
<path class="shimmer" d="M-520 600H-340M-260 620H-60M120 594H300M380 602H620M700 594H880M240 616H460M540 624H760M60 632H200M820 632H960M1080 602H1280M1360 618H1540"/>
</svg>`
}
