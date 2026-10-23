import { archPath, circle, f } from './util'

/** A shape is filled marble (or shadow) plus a gold outline that draws itself. */
interface Shape {
  d: string
  fill?: string
}

const MARBLE = 'url(#marble-face)'
const SHADE = 'url(#arch-shadow)'
const TRIM = '#efe3c6'
const W = 1000

function minaret(cx: number, tip: number, s: number): Shape[] {
  const base = 478
  const shaftTop = tip + 46 * s
  const w0 = 11 * s
  const w1 = 7.5 * s
  const out: Shape[] = [{ d: `M${f(cx - w0)} ${base}L${f(cx - w1)} ${f(shaftTop)}H${f(cx + w1)}L${f(cx + w0)} ${base}Z`, fill: MARBLE }]
  for (const t of [0.3, 0.6, 0.9]) {
    const y = base - (base - shaftTop) * t
    const w = w0 - (w0 - w1) * t + 3.5 * s
    out.push({ d: `M${f(cx - w)} ${f(y)}H${f(cx + w)}V${f(y - 3.5 * s)}H${f(cx - w)}Z`, fill: TRIM })
  }
  const pv = shaftTop - 12 * s
  out.push({ d: `M${f(cx - 9 * s)} ${f(shaftTop)}V${f(pv)}H${f(cx + 9 * s)}V${f(shaftTop)}Z`, fill: MARBLE })
  out.push({
    d: `M${f(cx - 10.5 * s)} ${f(pv)}C${f(cx - 10.5 * s)} ${f(pv - 12 * s)} ${f(cx - 3 * s)} ${f(pv - 16 * s)} ${f(cx)} ${f(pv - 22 * s)}C${f(cx + 3 * s)} ${f(pv - 16 * s)} ${f(cx + 10.5 * s)} ${f(pv - 12 * s)} ${f(cx + 10.5 * s)} ${f(pv)}Z`,
    fill: MARBLE,
  })
  out.push({ d: `M${f(cx)} ${f(pv - 22 * s)}V${f(tip)}` })
  return out
}

function chhatri(cx: number): Shape[] {
  return [
    { d: `M${cx - 23} 300H${cx + 23}V295H${cx - 23}Z`, fill: TRIM },
    { d: `M${cx - 18} 295V266M${cx - 7} 295V266M${cx + 7} 295V266M${cx + 18} 295V266` },
    { d: `M${cx - 25} 266H${cx + 25}V261H${cx - 25}Z`, fill: TRIM },
    { d: `M${cx - 20} 261C${cx - 22} 249 ${cx - 12} 241 ${cx} 234C${cx + 12} 241 ${cx + 22} 249 ${cx + 20} 261Z`, fill: MARBLE },
    { d: `M${cx} 234V222` },
  ]
}

/** Two stacked arched bays on one side of the main iwan (x0 = left edge of the bay). */
function bays(x0: number): Shape[] {
  const x1 = x0 + 82
  return [
    { d: `M${x0} 386V308H${x1}V386` },
    { d: archPath({ xL: x0 + 10, xR: x1 - 10, spring: 346, r: 38, bottom: 386 }) + 'Z', fill: SHADE },
    { d: `M${x0} 470V394H${x1}V470` },
    { d: archPath({ xL: x0 + 10, xR: x1 - 10, spring: 432, r: 38, bottom: 470 }) + 'Z', fill: SHADE },
  ]
}

function niches(x0: number): Shape[] {
  return [
    { d: archPath({ xL: x0, xR: x0 + 20, spring: 350, r: 12, bottom: 386 }) + 'Z', fill: SHADE },
    { d: archPath({ xL: x0, xR: x0 + 20, spring: 432, r: 12, bottom: 470 }) + 'Z', fill: SHADE },
  ]
}

const cypress = (x: number, h: number, b = 482, w = 13) =>
  `<g class="tree"><path d="M${x} ${b}C${x - w} ${f(b - h * 0.35)} ${f(x - w * 0.6)} ${f(b - h * 0.8)} ${x} ${b - h}C${f(x + w * 0.6)} ${f(b - h * 0.8)} ${x + w} ${f(b - h * 0.35)} ${x} ${b}Z" fill="url(#cypress)"/></g>`
const roundTree = (x: number, y: number, r: number) =>
  `<g class="tree"><path d="${circle(x, y, r)}" fill="#3f7d4f"/><path d="${circle(x - r * 0.3, y - r * 0.25, r * 0.55)}" fill="#5f9a5a" opacity=".7"/><path d="M${x} ${y + r}V482" stroke="#5b4a2a" stroke-width="2"/></g>`

function trees() {
  const left = [roundTree(32, 448, 34), roundTree(112, 456, 26), cypress(64, 150), cypress(94, 198), cypress(128, 176), cypress(154, 128)]
  const right = [roundTree(W - 32, 448, 34), roundTree(W - 112, 456, 26), cypress(W - 64, 150), cypress(W - 94, 198), cypress(W - 128, 176), cypress(W - 154, 128)]
  return [...left, ...right].join('')
}

function shapes(): Shape[] {
  const plinthArches: Shape[] = []
  for (let x = 156; x < 840; x += 38) plinthArches.push({ d: archPath({ xL: x, xR: x + 22, spring: 492, r: 13, bottom: 500 }) + 'Z', fill: SHADE })
  return [
    // back minarets sit behind everything
    ...minaret(262, 168, 0.82),
    ...minaret(W - 262, 168, 0.82),
    // plinth
    { d: 'M140 500H860V480H140Z', fill: MARBLE },
    { d: 'M136 480H864V476H136Z', fill: TRIM },
    ...plinthArches,
    // front minarets
    ...minaret(176, 140, 1),
    ...minaret(W - 176, 140, 1),
    // drum and dome
    { d: 'M432 232V204H568V232Z', fill: MARBLE },
    { d: 'M432 214H568' },
    {
      d: 'M436 205C424 193 410 172 410 148C410 106 452 82 488 72Q498 68 500 56Q502 68 512 72C548 82 590 106 590 148C590 172 576 193 564 205Z',
      fill: MARBLE,
    },
    { d: 'M484 76Q492 68 500 72Q508 68 516 76' },
    { d: 'M500 56V22' },
    { d: circle(500, 50, 3), fill: TRIM },
    { d: circle(500, 42, 2.4), fill: TRIM },
    { d: 'M495 28A5 5 0 0 0 505 28A4 4 0 0 1 495 28Z', fill: TRIM },
    { d: 'M500 24V14' },
    // chhatris
    ...chhatri(405),
    ...chhatri(W - 405),
    // main block with chamfered corners
    { d: 'M300 476V318L330 300H670L700 318V476Z', fill: MARBLE },
    { d: 'M330 300V476M670 300V476M330 307H670' },
    ...[330, 438, 562, 670].flatMap((x): Shape[] => [{ d: `M${x} 300V283` }, { d: circle(x, 280, 2.4), fill: TRIM }]),
    ...niches(305),
    ...niches(W - 325),
    ...bays(348),
    ...bays(W - 348 - 82),
    // central iwan
    { d: 'M438 476V232H562V476Z', fill: MARBLE },
    { d: 'M447 476V241H553V476' },
    { d: archPath({ xL: 462, xR: 538, spring: 330, r: 64, bottom: 476 }) + 'Z', fill: SHADE },
    { d: archPath({ xL: 477, xR: 523, spring: 382, r: 40, bottom: 476 }) + 'Z', fill: '#d8c294' },
  ]
}

function sun() {
  let rays = ''
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2
    const p = (r: number, da: number) => `${f(500 + Math.cos(a + da) * r)} ${f(160 + Math.sin(a + da) * r)}`
    rays += `M${p(70, -0.012)}L${p(560, -0.03)}L${p(560, 0.03)}L${p(70, 0.012)}Z`
  }
  return `<g class="taj-sun"><path class="rays" d="${rays}"/><path class="sun-disc" d="${circle(500, 160, 230)}" fill="url(#sun)"/></g>`
}

/** The Taj Mahal at sunrise over its reflecting pool. 1000×560, ground line at y=500. */
export function taj() {
  const all = shapes()
  const fills = all
    .filter((s) => s.fill)
    .map((s) => `<path d="${s.d}" fill="${s.fill}"/>`)
    .join('')
  const lines = all.map((s) => `<path pathLength="1" d="${s.d}"/>`).join('')
  const t = trees()
  return `<svg class="taj" viewBox="0 0 1000 560" aria-hidden="true">
<defs><clipPath id="pool-clip"><rect y="500" width="1000" height="60"/></clipPath></defs>
${sun()}
<g class="taj-trees">${t}</g>
<g class="taj-fills">${fills}</g>
<g class="taj-lines">${lines}</g>
<path class="pool" d="M0 500H1000V560H0Z" fill="url(#water)"/>
<g class="taj-reflect" clip-path="url(#pool-clip)"><g filter="url(#ripple)"><g transform="matrix(1 0 0 -.35 0 675)">${t}${fills}</g></g></g>
<path class="shimmer" d="M120 512H300M380 520H620M700 512H880M240 534H460M540 542H760M60 550H200M820 550H960"/>
</svg>`
}
