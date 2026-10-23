import type { EventIcon, TravelIcon, WeddingEvent } from '../config'
import { apexOf, archPath, circle, f, leaf, lobed, rng } from './util'

/** A stroke that draws itself: pathLength=1 lets one dash cover every path. */
const draw = (d: string, attrs = '') => `<path class="draw" pathLength="1" d="${d}"${attrs}/>`

/**
 * Pietra dura bouquet — the flower-in-a-vase inlay of the Taj Mahal's marble.
 * 200×200, base at the bottom. 'inlay' = coloured stone; 'line' = gold outline only.
 */
export function inlayFlower(mode: 'inlay' | 'line' = 'inlay') {
  const line = mode === 'line'
  const leafFill = line ? 'none' : 'url(#leaf-green)'
  const petal = line ? 'none' : '#f2b51f'
  const petalLight = line ? 'none' : '#f8d257'
  const stems = [
    'M100 148C100 124 99 98 100 72',
    'M100 140C86 132 72 118 66 100',
    'M100 140C114 132 128 118 134 100',
    'M100 152C88 150 76 146 66 137',
    'M100 152C112 150 124 146 134 137',
  ]
  const leaves: [number, number, number, number, number, number][] = [
    // x, y, rotation, length, width, t (order along the stems)
    [100, 122, -152, 26, 7, 0.35],
    [100, 122, -28, 26, 7, 0.35],
    [100, 98, -140, 20, 5.5, 0.6],
    [100, 98, -40, 20, 5.5, 0.6],
    [82, 126, -104, 16, 4.5, 0.5],
    [118, 126, -76, 16, 4.5, 0.5],
  ]
  const rosette = (cx: number, cy: number) =>
    `<g transform="translate(${cx} ${cy})"><g class="if-bloom">${[0, 72, 144, 216, 288]
      .map((a) => `<ellipse cx="0" cy="-6" rx="3.6" ry="6" transform="rotate(${a})" fill="${petal}"/>`)
      .join('')}<circle r="2.6" fill="${line ? 'none' : '#1f5c42'}"/></g></g>`
  const bud = (cx: number, cy: number, a: number) =>
    `<g transform="translate(${cx} ${cy}) rotate(${a})"><g class="if-bloom"><path d="M0 0C-4-3-4-9 0-13C4-9 4-3 0 0Z" fill="${petalLight}"/></g></g>`

  return `<g class="inlay-flower inlay-${mode}">
<g class="if-vase"><path d="M84 178C78 170 80 158 90 154H110C120 158 122 170 116 178Z" fill="${line ? 'none' : '#2f6b4f'}"/><path d="M92 154C92 150 96 148 100 148S108 150 108 154" fill="none"/><path d="M88 166H112" fill="none" opacity=".6"/></g>
${stems.map((d) => `<path class="if-stem" pathLength="1" d="${d}"/>`).join('')}
${leaves
  .map(
    ([x, y, rot, L, W, t]) =>
      `<g transform="translate(${x} ${y}) rotate(${rot})"><g class="if-leaf" data-t="${t}"><path d="${leaf(L, W)}" fill="${leafFill}"/></g></g>`,
  )
  .join('')}
<g transform="translate(100 72)"><g class="if-bloom">
<path d="M0 0C-10 0-20-10-20-22C-12-20-4-12 0 0Z" fill="${petalLight}"/>
<path d="M0 0C10 0 20-10 20-22C12-20 4-12 0 0Z" fill="${petalLight}"/>
<path d="M0 0C-8-8-8-26 0-36C8-26 8-8 0 0Z" fill="${petal}"/>
</g></g>
${rosette(66, 94)}${rosette(134, 94)}${bud(64, 136, -60)}${bud(136, 136, 60)}
</g>`
}

/** Paisley (boteh) flourish for dividers. */
export function paisley() {
  const half = [
    'M104 20C96 8 76 6 68 16C62 24 70 32 80 30C88 28 88 20 82 19',
    'M98 20C92 13 80 12 74 18',
    'M68 20C50 22 34 18 14 20',
  ]
    .map((d) => draw(d))
    .join('')
  const dots = [44, 32, 22].map((x) => `<circle class="pop" cx="${x}" cy="${x === 32 ? 17 : 21.5}" r="1.5"/>`).join('')
  return `<svg class="paisley" viewBox="0 0 240 40" aria-hidden="true"><g>${half}${dots}</g><g transform="matrix(-1 0 0 1 240 0)">${half}${dots}</g><g transform="translate(120 20)"><g class="pop"><path d="${lobed(0, 0, 6, 8)}"/><circle r="1.8"/></g></g></svg>`
}

/** Cusped arch that frames the main date. */
export function dateArch() {
  const inner = { xL: 30, xR: 230, spring: 150, r: 150, bottom: 330, lobes: 5 }
  const outer = { xL: 16, xR: 244, spring: 150, r: 164, bottom: 330 }
  const top = apexOf(outer)
  return `<svg class="date-arch-svg" viewBox="0 0 260 340" aria-hidden="true">
${draw(archPath(inner))}${draw(archPath(outer))}
${draw('M4 330H256M14 337H246')}
${draw(`M130 ${f(top)}V${f(top - 10)}`)}
<g transform="translate(130 ${f(top - 16)})"><g class="pop"><path d="M0 6C-4 2-4-4 0-8C4-4 4 2 0 6Z"/></g></g>
</svg>`
}

/** Brass diya; the flame lights when its celebration is reached. */
export const diya = () =>
  `<svg class="diya-svg" viewBox="0 0 48 48" aria-hidden="true">
<circle class="glow" cx="24" cy="17" r="20" fill="url(#glow)"/>
<g class="flame"><path d="M24 26C18 21 20 13 24 5C28 13 30 21 24 26Z" fill="url(#flame)"/><path d="M24 25C21.5 22 22.5 17.5 24 13C25.5 17.5 26.5 22 24 25Z" fill="#fff7cf"/></g>
<path d="M8 27C10 36 38 36 40 27C33 30 15 30 8 27Z" fill="url(#gold)" stroke="#8c6a24" stroke-width=".8"/>
<path d="M39.5 27.5C42 26.5 45 24.5 46 22C43 23 41 24.5 37.5 26.5" fill="url(#gold)" stroke="#8c6a24" stroke-width=".6"/>
<path d="M12 30.5Q24 34 36 30.5" fill="none" stroke="#fbe7a1" stroke-width=".8" opacity=".7"/>
<ellipse cx="24" cy="38" rx="9" ry="1.6" fill="#8c6a24" opacity=".2"/>
</svg>`

const ICONS: Record<EventIcon, string[]> = {
  haldi: [
    'M6 22H34C34 29 28 34 20 34S6 29 6 22Z',
    'M4.5 22H35.5',
    'M10 22C12 17.5 28 17.5 30 22',
    lobed(20, 12, 5, 10),
    'M31 6.5c0 2-2 3-2 4.6a2 2 0 0 0 4 0c0-1.6-2-2.6-2-4.6Z',
  ],
  mehendi: [
    'M11 35L26 9.5Q28.5 6 31.5 8T31 13.5L16 38Z',
    'M11 35L8 38.5',
    'M24 13.5L28.5 16',
    'M27 29c4-1 7 1 7 4s-3 4-5 3c-2-1-1-4 1-4',
    circle(33, 24, 1),
    circle(36, 28, 0.8),
  ],
  sangeet: [
    'M8 15C8 11 32 11 32 15V27C32 31 8 31 8 27Z',
    'M8 15C8 19 32 19 32 15',
    'M11 19L14.5 29M18 19.5L21.5 30M25 19.5L28.5 29',
    'M3 6L11 13M37 6L29 13',
  ],
  baraat: [
    'M8 27C8 15.5 14 9.5 21 9.5S33 15.5 33 24.5C33 27.5 30 29.5 27 28.5C22 27.5 13 27.5 10 29.5C8 30.5 8 28.5 8 27Z',
    'M10 22.5C16 18.5 26 18.5 32 21.5M12.5 17C17 14.5 25 14.5 29.5 17',
    'M22 9.5C21 5.5 23 2.5 26.5 1.5C25.5 4.5 26.5 6.5 24.5 9.5',
    circle(21.5, 13.5, 2),
  ],
  wedding: [
    'M5.5 14Q20 1 34.5 14',
    'M5.5 14H34.5',
    'M9 14V34.5M31 14V34.5',
    'M4 34.5H36',
    'M9 18.5Q20 25 31 18.5',
    'M20 33C16 30 17 25 20 20.5C23 25 24 30 20 33Z',
    'M15 34.5L16 31.5H24L25 34.5',
  ],
  reception: [
    'M20 3V11',
    'M7 17C7 24 33 24 33 17',
    'M13 20.5C13 25 27 25 27 20.5',
    'M7 17V13M13 20.5V16.5M20 21.5V17M27 20.5V16.5M33 17V13',
    'M20 24V30',
    circle(20, 32, 2),
  ],
  lotus: [
    'M20 33C14 28 14 18 20 10C26 18 26 28 20 33Z',
    'M20 33C12 32 7 25 6 18C13 19 18 25 20 33Z',
    'M20 33C28 32 33 25 34 18C27 19 22 25 20 33Z',
    'M6 35H34',
  ],
}

export function iconFor(e: WeddingEvent): EventIcon {
  if (e.icon) return e.icon
  const n = e.name.toLowerCase()
  if (/haldi|pithi|turmeric/.test(n)) return 'haldi'
  if (/mehe?ndi|henna/.test(n)) return 'mehendi'
  if (/sangeet|garba|music|cocktail/.test(n)) return 'sangeet'
  if (/baraat|procession/.test(n)) return 'baraat'
  if (/wedding|phera|ceremony|nikah|vivah|anand/.test(n)) return 'wedding'
  if (/reception|dinner|party/.test(n)) return 'reception'
  return 'lotus'
}

/** Event icon sitting inside a small cusped arch. */
export function eventIcon(e: WeddingEvent) {
  const frame = archPath({ xL: 6, xR: 58, spring: 34, r: 34, bottom: 80, lobes: 3 })
  return `<svg class="ev-icon" viewBox="0 0 64 84" aria-hidden="true"><path class="draw frame" pathLength="1" d="${frame}"/><g transform="translate(12 34)">${ICONS[
    iconFor(e)
  ]
    .map((d) => draw(d))
    .join('')}</g></svg>`
}

/** Top-down charbagh: a walled four-part Mughal garden by the river, drawn like a plan. */
export function charbagh() {
  const r = rng(12)
  const lines = [
    'M0 12Q20 6 40 12T80 12T120 12T160 12T200 12T240 12T280 12T320 12',
    'M0 22Q20 16 40 22T80 22T120 22T160 22T200 22T240 22T280 22T320 22',
    'M104 34H216V86H104Z',
    'M132 42H188V78H132Z',
    circle(160, 60, 11),
    'M16 92H304V344H16Z',
    'M155 92V198M165 92V198M155 238V344M165 238V344',
    'M16 213H140M16 223H140M180 213H304M180 223H304',
    'M140 198H180V238H140Z',
    'M85.5 92V213M16 152.5H155M234.5 92V213M165 152.5H304M85.5 223V344M16 283.5H155M234.5 223V344M165 283.5H304',
    'M145 344V356H175V344',
  ]
  const towers = [
    [108, 38],
    [212, 38],
    [108, 82],
    [212, 82],
  ]
    .map(([x, y]) => `<path class="plan-fill tower" d="${circle(x, y, 4)}"/>`)
    .join('')
  const water = [
    'M155 92H165V198H155Z',
    'M155 238H165V344H155Z',
    'M16 213H140V223H16Z',
    'M180 213H304V223H180Z',
    'M140 198H180V238H140Z',
    'M0 12Q20 6 40 12T80 12T120 12T160 12T200 12T240 12T280 12T320 12V22Q300 16 280 22T240 22T200 22T160 22T120 22T80 22T40 22T0 22Z',
  ]
    .map((d) => `<path class="plan-fill water" d="${d}"/>`)
    .join('')
  // Trees planted around each of the sixteen parterres.
  let trees = ''
  const xs = [16, 85.5, 155, 165, 234.5, 304]
  const ys = [92, 152.5, 213, 223, 283.5, 344]
  for (const [x0, x1] of [
    [xs[0], xs[1]],
    [xs[1], xs[2]],
    [xs[3], xs[4]],
    [xs[4], xs[5]],
  ])
    for (const [y0, y1] of [
      [ys[0], ys[1]],
      [ys[1], ys[2]],
      [ys[3], ys[4]],
      [ys[4], ys[5]],
    ])
      for (const [tx, ty] of [
        [x0 + 11, y0 + 11],
        [x1 - 11, y0 + 11],
        [x0 + 11, y1 - 11],
        [x1 - 11, y1 - 11],
        [(x0 + x1) / 2, (y0 + y1) / 2],
      ])
        trees += `<g transform="translate(${f(tx)} ${f(ty)})"><g class="tree" data-r="${r().toFixed(3)}"><circle r="4.2"/><circle cx="-1.2" cy="-1.2" r="1.6" class="tree-hi"/></g></g>`
  return `<svg class="charbagh" viewBox="0 0 320 360" aria-hidden="true">
<g class="plan-fills">${water}${towers}</g>
<g class="plan-lines">${lines.map((d) => `<path pathLength="1" d="${d}"/>`).join('')}</g>
<g class="plan-trees">${trees}</g>
<g transform="translate(160 218)"><circle class="ripple" r="7"/><circle class="ripple" r="7" style="animation-delay:-1.4s"/><circle class="fountain" r="3"/></g>
<g class="plan-north" transform="translate(296 52)"><path d="M0-12L4 4L0 1L-4 4Z"/><path d="M0 1V10" /></g>
</svg>`
}

/** Lotus that opens from a closed bud. */
export function lotus() {
  const petals: [number, number][] = [
    [-64, 28],
    [64, 28],
    [-42, 36],
    [42, 36],
    [-20, 42],
    [20, 42],
    [0, 46],
  ]
  return `<svg class="lotus" viewBox="0 0 120 92" aria-hidden="true">
<path class="pad" d="M8 76C16 64 42 66 47 76C36 80 18 80 8 76Z"/>
<path class="pad" d="M112 76C104 64 78 66 73 76C84 80 102 80 112 76Z"/>
${draw('M4 80Q30 76 60 80T116 80')}${draw('M18 86Q40 83 60 86T102 86')}
<g transform="translate(60 74)">${petals
    .map(
      ([a, L]) =>
        `<path class="petal" data-a="${a}" d="M0 0C${f(-L * 0.32)} ${f(-L * 0.3)} ${f(-L * 0.2)} ${f(-L * 0.82)} 0 ${-L}C${f(L * 0.2)} ${f(-L * 0.82)} ${f(L * 0.32)} ${f(-L * 0.3)} 0 0Z"/>`,
    )
    .join('')}</g>
</svg>`
}

const TRAVEL: Record<TravelIcon, string[]> = {
  plane: [
    'M6 25L34 12.5Q37.5 11 37.5 13.5T34.5 16.5L8.5 28Z',
    'M18 19.5L12.5 9.5L16.5 9L26 15.5',
    'M20.5 23.5L22.5 33.5L26 32.5L27.5 21',
    'M10.5 26L6 20L8.5 19.5L13.5 24',
  ],
  car: ['M5 27V21.5L10 14H30L35 21.5V27Z', 'M12.5 15.5L10.5 21H29.5L27.5 15.5Z', circle(12, 28, 3.5), circle(28, 28, 3.5)],
  train: [
    'M10 6H30C33 6 34 8 34 11V27C34 30 32 31 30 31H10C8 31 6 30 6 27V11C6 8 7 6 10 6Z',
    'M10 11H30V19H10Z',
    circle(12.5, 25, 1.8),
    circle(27.5, 25, 1.8),
    'M10 35L13 31M30 35L27 31M5 35H35',
  ],
}

export const travelIcon = (icon: TravelIcon) =>
  `<svg class="travel-icon" viewBox="0 0 40 40" aria-hidden="true">${TRAVEL[icon].map((d) => draw(d)).join('')}</svg>`

/** Watercolour dot: displaced edge plus a darker rim, like pigment pooling. */
export const swatch = (color: string, i: number) =>
  `<svg class="swatch" viewBox="0 0 60 60" aria-hidden="true"><g filter="url(#wc${i % 6})"><path d="${circle(30, 30, 21)}" fill="${color}"/><path d="${circle(30, 30, 21)}" fill="url(#wc-shade)"/></g></svg>`

/** Falling marigold petals (CSS only: transform + opacity), deterministic. */
export function petals(count: number, seed: number) {
  const r = rng(seed)
  return Array.from({ length: count }, () => {
    const dur = 10 + r() * 9
    const vars = [
      `--x:${f(r() * 100)}%`,
      `--size:${f(8 + r() * 9)}px`,
      `--dur:${f(dur)}s`,
      `--delay:${f(-r() * dur)}s`,
      `--sway:${f(16 + r() * 36)}px`,
      `--spin:${f(2.2 + r() * 2.4)}s`,
      `--o:${(0.6 + r() * 0.35).toFixed(2)}`,
    ].join(';')
    return `<span class="petal-track" style="${vars}"><span class="petal-sway"><svg viewBox="0 0 20 24"><path d="M4 22C2 16 2 8 6 3C7 5 8 2 10 3C11 1 13 4 14 3C18 8 18 16 16 22C12 24 8 24 4 22Z" fill="url(#petal-fall)"/><path d="M10 21.5V7" fill="none" stroke="#d98a06" stroke-width=".5" opacity=".5"/></svg></span></span>`
  }).join('')
}
