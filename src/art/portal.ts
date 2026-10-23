import { inlayFlower } from './motifs'
import { apexOf, archPath, f, leaf, lobed } from './util'

/**
 * The gateway: an emerald wall with a cusped Mughal arch, gold inlay and two
 * carved marble doors behind it. Everything shares a 620×1000 box; the wall
 * path extends far beyond it so it covers any screen shape.
 */
export const OPENING = { xL: 110, xR: 510, spring: 430, r: 330, bottom: 1000, lobes: 6 }
const APEX = apexOf(OPENING)

/** Door leaf geometry as % of the portal box, so HTML doors line up with the SVG wall. */
export const doorBox = {
  left: (OPENING.xL / 620) * 100,
  top: (APEX / 1000) * 100,
  width: ((OPENING.xR - OPENING.xL) / 2 / 620) * 100,
  height: ((1000 - APEX) / 1000) * 100,
}

const draw = (d: string) => `<path class="draw" pathLength="1" d="${d}"/>`

function spandrel(mirror: boolean) {
  const scrolls = ['M150 142C190 122 230 112 270 112', 'M150 142C122 114 96 92 70 72']
  const leaves = [
    [192, 124, -20],
    [232, 114, -10],
    [118, 112, -140],
    [92, 92, -145],
  ]
    .map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path class="draw" pathLength="1" d="${leaf(14, 4)}"/></g>`)
    .join('')
  const body = `${scrolls.map(draw).join('')}${leaves}${draw(lobed(150, 142, 18, 10))}${draw(lobed(150, 142, 10, 8))}`
  return mirror ? `<g transform="matrix(-1 0 0 1 620 0)">${body}</g>` : body
}

export function wall() {
  const hole = `${archPath(OPENING)}Z`
  const big = 'M-3000 -3000H3620V4000H-3000Z'
  const outer1 = archPath({ xL: 96, xR: 524, spring: 430, r: 344, bottom: 1000 })
  const outer2 = archPath({ xL: 84, xR: 536, spring: 430, r: 356, bottom: 1000 })
  const band = (() => {
    let s = ''
    for (let y = 60; y < 1000; y += 26) s += `M48 ${y - 4}L52 ${y}L48 ${y + 4}L44 ${y}ZM572 ${y - 4}L576 ${y}L572 ${y + 4}L568 ${y}Z`
    for (let x = 74; x < 560; x += 26) s += `M${x} 34L${x + 4} 38L${x} 42L${x - 4} 38Z`
    return s
  })()
  // eight-point Mughal star above the apex
  const star = `M310 60L320 70L310 80L300 70ZM303 63H317V77H303Z`
  return `<svg class="wall" viewBox="0 0 620 1000" aria-hidden="true">
<path d="${big}${hole}" fill="url(#wall)" fill-rule="evenodd"/>
<path d="${big}${hole}" fill="url(#jaali)" fill-rule="evenodd"/>
<g class="inlay">
${draw(archPath(OPENING))}${draw(outer1)}${draw(outer2)}
${draw('M40 1000V30H580V1000')}${draw('M56 1000V46H564V1000')}
${spandrel(false)}${spandrel(true)}
${draw(star)}
<path class="band" d="${band}"/>
</g>
</svg>`
}

/** Carved marble door leaf: jaali window under a cusped arch, inlay panel, brass studs and ring. */
export function door(right: boolean) {
  const H = 1000 - APEX
  const studs = Array.from({ length: 12 }, (_, i) => 130 + i * 62)
    .map((y) => `<circle cx="22" cy="${y}" r="2.2"/><circle cx="178" cy="${y}" r="2.2"/>`)
    .join('')
  const jaaliArch = archPath({ xL: 30, xR: 170, spring: 380, r: 90, bottom: 600, lobes: 4 })
  const body = `<rect width="200" height="${f(H)}" fill="url(#marble)"/>
<path d="M200 0V${f(H)}" stroke="#b8913c" stroke-width="2"/>
<rect x="9" y="9" width="182" height="${f(H - 18)}" fill="none" stroke="#c49b42" stroke-width="1.6"/>
<rect x="15" y="15" width="170" height="${f(H - 30)}" fill="none" stroke="#c49b42" stroke-width=".7" opacity=".6"/>
<path d="${lobed(100, 210, 24, 14)}" fill="none" stroke="#c49b42" stroke-width="1.2"/>
<path d="${lobed(100, 210, 14, 10)}" fill="#f6cf58" fill-opacity=".75" stroke="#c49b42" stroke-width=".8"/>
<circle cx="100" cy="210" r="4" fill="#1f5c42"/>
<path d="${jaaliArch}Z" fill="url(#jaali-door)" stroke="#b8913c" stroke-width="2"/>
<path d="${jaaliArch}" fill="none" stroke="#fbf6ea" stroke-width="1" opacity=".7"/>
<rect x="30" y="630" width="140" height="216" fill="#f8f2e4" stroke="#b8913c" stroke-width="1.6"/>
<g transform="translate(46 681) scale(.54)">${inlayFlower('inlay')}</g>
<g fill="url(#gold)" stroke="#8c6a24" stroke-width=".5">${studs}</g>
<circle cx="184" cy="470" r="9" fill="none" stroke="#b8913c" stroke-width="2.4"/>
<circle cx="184" cy="461" r="3.4" fill="url(#gold)" stroke="#8c6a24" stroke-width=".5"/>`
  return `<svg class="door-art" viewBox="0 0 200 ${f(H)}" preserveAspectRatio="none" aria-hidden="true">${
    right ? `<g transform="matrix(-1 0 0 1 200 0)">${body}</g>` : body
  }</svg>`
}

/** Gold lotus medallion with the couple's initials — the thing you tap. */
export function medallion(initials: string) {
  const petals = Array.from(
    { length: 16 },
    (_, i) =>
      `<path d="M0-19C5-25 5-31 0-36C-5-31-5-25 0-19Z" transform="rotate(${i * 22.5})" fill="#fbe7a1" stroke="#9c7a2e" stroke-width=".6"/>`,
  ).join('')
  return `<svg class="medallion-svg" viewBox="-50 -50 100 100" aria-hidden="true">
<path d="${lobed(0, 0, 46, 16, 0.6)}" fill="url(#gold-disc)" stroke="#8c6a24" stroke-width=".8"/>
<circle r="38" fill="none" stroke="#8c6a24" stroke-width=".8" opacity=".6"/>
${petals}
<circle r="18.5" fill="#1f5c42" stroke="#e8c868" stroke-width="1.2"/>
<circle r="15.5" fill="none" stroke="#e8c868" stroke-width=".5" stroke-dasharray="1 2"/>
<text y="6.5" text-anchor="middle" font-family="Imperial Script, cursive" font-size="19" fill="#f3d67c">${initials}</text>
<path d="${lobed(0, 0, 46, 16, 0.6)}" fill="url(#shine)"/>
</svg>`
}
