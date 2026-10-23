import { f, lobed } from './util'

/** 8-point star lattice, the basis of Mughal jaali screens. */
function lattice(s: number) {
  const c = s / 2
  const a = s * 0.36
  const b = s * 0.25
  return [
    `M${f(c)} ${f(c - a)}L${f(c + a)} ${f(c)}L${f(c)} ${f(c + a)}L${f(c - a)} ${f(c)}Z`,
    `M${f(c - b)} ${f(c - b)}H${f(c + b)}V${f(c + b)}H${f(c - b)}Z`,
    `M${f(c)} 0V${f(c - a)}M${f(c)} ${s}V${f(c + a)}M0 ${f(c)}H${f(c - a)}M${s} ${f(c)}H${f(c + a)}`,
    `M0 0L${f(c - b)} ${f(c - b)}M${s} 0L${f(c + b)} ${f(c - b)}M0 ${s}L${f(c - b)} ${f(c + b)}M${s} ${s}L${f(c + b)} ${f(c + b)}`,
  ].join('')
}

const marigold = `<symbol id="marigold" viewBox="-12 -12 24 24" overflow="visible">
<path d="${lobed(0, 0, 10.6, 18)}" fill="#e48a05"/>
<path d="${lobed(0, 0, 8.4, 15)}" fill="#f0a30c" transform="rotate(11)"/>
<path d="${lobed(0, 0, 6, 12)}" fill="#f7bf2a" transform="rotate(4)"/>
<path d="${lobed(0, 0, 3.4, 9)}" fill="#fcd85b"/>
<circle r="1.3" fill="#c46f04"/>
<path d="M-6.5-4.5A8 8 0 0 1 2-7.6" fill="none" stroke="#fff3c4" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
</symbol>`

const watercolour = [3, 7, 11, 17, 23, 29]
  .map(
    (seed, i) =>
      `<filter id="wc${i}" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter>`,
  )
  .join('')

/**
 * Gradients, patterns, filters and symbols shared by every illustration.
 * Rendered once in a zero-size (not display:none) SVG so url(#id) resolves everywhere.
 */
export const sharedDefs = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<radialGradient id="wall" gradientUnits="userSpaceOnUse" cx="310" cy="560" r="900"><stop offset="0" stop-color="#2b6b4f"/><stop offset=".5" stop-color="#1c4b37"/><stop offset="1" stop-color="#11342a"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f6dc86"/><stop offset=".5" stop-color="#cfa64b"/><stop offset="1" stop-color="#9c7a2e"/></linearGradient>
<radialGradient id="gold-disc" cx=".4" cy=".35" r=".75"><stop stop-color="#fbe9a6"/><stop offset=".55" stop-color="#d7b057"/><stop offset="1" stop-color="#9f7b2c"/></radialGradient>
<radialGradient id="shine" cx=".32" cy=".25" r=".45"><stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="marble" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fcf8ef"/><stop offset="1" stop-color="#efe5cf"/></linearGradient>
<linearGradient id="marble-face" x1="0" x2="1"><stop stop-color="#fffdf7"/><stop offset=".6" stop-color="#f8f1e1"/><stop offset="1" stop-color="#ecdfc3"/></linearGradient>
<linearGradient id="arch-shadow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dcc69a"/><stop offset="1" stop-color="#efe3c9"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop stop-color="#fff7d6"/><stop offset=".35" stop-color="#fde49a"/><stop offset=".7" stop-color="#f9d46a" stop-opacity=".45"/><stop offset="1" stop-color="#f9d46a" stop-opacity="0"/></radialGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e7eed9"/><stop offset="1" stop-color="#c9dcc3"/></linearGradient>
<linearGradient id="cypress" x1="0" x2="1"><stop stop-color="#2c6b4c"/><stop offset="1" stop-color="#174a35"/></linearGradient>
<linearGradient id="mango" x1="0" x2="1"><stop stop-color="#2f6b3a"/><stop offset="1" stop-color="#76a043"/></linearGradient>
<linearGradient id="leaf-green" x1="0" x2="1"><stop stop-color="#2f6b4f"/><stop offset="1" stop-color="#5f9a5a"/></linearGradient>
<linearGradient id="flame" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff3b0"/><stop offset=".5" stop-color="#f8b81f"/><stop offset="1" stop-color="#e07806"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop stop-color="#ffd25a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient>
<linearGradient id="lotus" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff6d2"/><stop offset=".6" stop-color="#fbe08a"/><stop offset="1" stop-color="#f1bd34"/></linearGradient>
<linearGradient id="petal-fall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd84a"/><stop offset=".6" stop-color="#f6b00f"/><stop offset="1" stop-color="#e48a05"/></linearGradient>
<radialGradient id="wc-shade" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#3a2a1a" stop-opacity="0"/><stop offset=".9" stop-color="#3a2a1a" stop-opacity=".1"/><stop offset="1" stop-color="#3a2a1a" stop-opacity=".2"/></radialGradient>
<pattern id="jaali" width="44" height="44" patternUnits="userSpaceOnUse"><path d="${lattice(44)}" fill="none" stroke="#e2bf63" stroke-width=".8" opacity=".22"/></pattern>
<pattern id="jaali-door" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#d2bd8c"/><path d="${lattice(24)}" fill="none" stroke="#c49b42" stroke-width="4.2" stroke-linejoin="round"/><path d="${lattice(24)}" fill="none" stroke="#fbf6ea" stroke-width="2.8" stroke-linejoin="round"/></pattern>
<filter id="ripple" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .09" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter>
${watercolour}
${marigold}
</defs></svg>`
