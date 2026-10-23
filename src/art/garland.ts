import { f, leaf, rng } from './util'

/** One marigold head, rotated so the ruffles don't repeat. */
const mg = (x: number, y: number, s: number, rot: number) =>
  `<use href="#marigold" x="${f(x - s)}" y="${f(y - s)}" width="${f(2 * s)}" height="${f(2 * s)}" transform="rotate(${Math.round(rot)} ${f(x)} ${f(y)})"/>`

const bell = (x: number, y: number) =>
  `<path d="M${x - 5} ${y + 9}C${x - 5} ${y + 2} ${x - 3} ${y} ${x} ${y}S${x + 5} ${y + 2} ${x + 5} ${y + 9}Z" fill="url(#gold)" stroke="#8c6a24" stroke-width=".6"/><circle cx="${x}" cy="${y + 10.5}" r="1.6" fill="#8c6a24"/>`

/**
 * Toran: a rope of mango leaves with marigold swags and hanging strands.
 * Each strand is .strand (dropped in by GSAP) > .sway (CSS swing), so the two never fight.
 */
export function garland(seed: number) {
  const r = rng(seed)
  const width = 1200
  const nodes = [0, 150, 300, 450, 600, 750, 900, 1050, 1200]
  const sway = () => `style="--d:${(3.4 + r() * 1.8).toFixed(2)}s;--delay:${(-r() * 3).toFixed(2)}s"`

  let swags = ''
  nodes.slice(0, -1).forEach((x0, i) => {
    const x1 = nodes[i + 1]
    let s = ''
    for (let k = 1; k < 9; k++) {
      const t = k / 9
      s += mg(x0 + (x1 - x0) * t, 16 + 4 * 34 * t * (1 - t), 10, r() * 360)
    }
    swags += `<g class="strand swag"><g class="sway" ${sway()}>${s}</g></g>`
  })

  let strands = ''
  nodes.forEach((x, i) => {
    const len = i % 2 ? 5 : 7
    let s = `<path class="thread" d="M${x} 10V${22 + (len - 1) * 18}"/>`
    for (let k = 0; k < len; k++) s += mg(x, 24 + k * 18, 9.4, r() * 360)
    s += bell(x, 24 + len * 18 - 4)
    strands += `<g class="strand"><g class="sway" ${sway()}>${s}</g></g>`
  })

  let leaves = ''
  for (let x = 4; x < width; x += 21) {
    const L = 30 + r() * 10
    leaves += `<g transform="translate(${x} 7) rotate(${Math.round(90 + (r() - 0.5) * 18)})"><path d="${leaf(L, L * 0.2)}" fill="url(#mango)"/><path class="rib" d="M2 0H${f(L * 0.85)}"/></g>`
  }

  return `<svg class="garland" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
<path class="rope" d="M0 7H1200"/>
${swags}${strands}
<g class="leaves">${leaves}</g>
</svg>`
}
