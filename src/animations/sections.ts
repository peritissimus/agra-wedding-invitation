import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]

/** Fire once, slightly before the element is fully in view, so nothing waits on the reader. */
const once = (trigger: Element, start: string, fn: () => void) => ScrollTrigger.create({ trigger, start, once: true, onEnter: fn })

/** Paths carry pathLength=1, so a single dash hides/reveals any of them. */
const hideStroke = (els: Element[]) => gsap.set(els, { strokeDasharray: 1, strokeDashoffset: 1.001 })
const DRAW = { strokeDashoffset: 0, ease: 'power2.inOut' }

export function setupSections(reduced: boolean) {
  reveals(reduced)
  diyaPath(reduced)
  if (reduced) {
    document.querySelectorAll('.ink').forEach((n) => n.classList.add('inked'))
    document.querySelectorAll('.lotus .petal').forEach((p) => p.setAttribute('transform', `rotate(${(p as SVGElement).dataset.a})`))
    return
  }
  words()
  motif()
  dateArch()
  charbagh()
  palette()
  travel()
  lotus()
  flourishes()
  footer()
  countUp()
  parallax()
}

/** Headings, labels, buttons: 600ms strong ease-out, 12px + light blur, 60ms stagger. */
function reveals(reduced: boolean) {
  const els = $$('.reveal')
  gsap.set(els, reduced ? { autoAlpha: 0 } : { autoAlpha: 0, y: 12, filter: 'blur(4px)' })
  ScrollTrigger.batch(els, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(
        batch,
        reduced
          ? { autoAlpha: 1, duration: 0.3, ease: 'none', stagger: 0.04 }
          : { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'emilOut', stagger: 0.06, clearProps: 'filter,transform' },
      ),
  })
}

/** The welcome message inks in word by word — the whole paragraph in about a second. */
function words() {
  const box = $('.words')
  if (!box) return
  const ws = $$('.word', box)
  gsap.set(ws, { autoAlpha: 0, y: 6, filter: 'blur(3px)' })
  once(box, 'top 88%', () =>
    gsap.to(ws, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'emilOut', stagger: 0.016, clearProps: 'filter,transform' }),
  )
}

/** Pietra dura bouquet: stems draw, leaves sprout, flowers open, vase settles. */
function motif() {
  const svg = $('.welcome .motif')
  if (!svg) return
  const stems = $$('.if-stem', svg)
  const leaves = $$<SVGElement>('.if-leaf', svg)
  const blooms = $$('.if-bloom', svg)
  const vase = $('.if-vase', svg)
  hideStroke(stems)
  gsap.set(leaves, { scale: 0.3, autoAlpha: 0, transformOrigin: '0% 50%' })
  gsap.set(blooms, { scale: 0.5, rotation: -20, autoAlpha: 0, transformOrigin: '50% 100%' })
  gsap.set(vase, { autoAlpha: 0, y: 6 })
  const tl = gsap
    .timeline({ paused: true })
    .to(vase, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'emilOut' }, 0)
    .to(stems, { ...DRAW, duration: 0.9, stagger: 0.06 }, 0.1)
  leaves.forEach((l) => tl.to(l, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'emilOut' }, 0.2 + Number(l.dataset.t) * 0.7))
  tl.to(blooms, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'emilOut', stagger: 0.06 }, 0.6)
  once(svg, 'top 88%', () => tl.play())
}

/** The cusped arch traces itself around the date. */
function dateArch() {
  const svg = $('.date-arch-svg')
  if (!svg) return
  const paths = $$('.draw', svg)
  const pop = $$('.pop', svg)
  hideStroke(paths)
  gsap.set(pop, { scale: 0.5, autoAlpha: 0, transformOrigin: '50% 100%' })
  const tl = gsap
    .timeline({ paused: true })
    .to(paths, { ...DRAW, duration: 1.0, stagger: 0.08 }, 0)
    .to(pop, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'emilOut' }, 0.7)
  once(svg, 'top 85%', () => tl.play())
}

/**
 * The celebrations: a gold thread grows down the list with the scroll (the
 * only scrubbed piece), and each diya lights as the thread reaches it.
 */
function diyaPath(reduced: boolean) {
  const wrap = $('.diya-path')
  if (!wrap) return
  const svg = $<SVGSVGElement>('.thread', wrap)!
  const items = $$('.ev', wrap)
  let grow: SVGPathElement | null = null
  let buds: SVGElement[] = []
  let marks: number[] = []

  const build = () => {
    const h = wrap.offsetHeight
    const x = 24
    let d = `M${x} 0`
    for (let y = 0, k = 0; y < h; y += 60, k++) d += `Q${x + (k % 2 ? 3 : -3)} ${y + 30} ${x} ${Math.min(h, y + 60)}`
    let b = ''
    for (let y = 46; y < h - 20; y += 44) {
      b += `<use class="bud" data-t="${(y / h).toFixed(3)}" href="#marigold" x="${x - 5}" y="${y - 5}" width="10" height="10"/>`
    }
    svg.setAttribute('viewBox', `0 0 48 ${h}`)
    svg.style.height = `${h}px`
    svg.innerHTML = `<path class="thread-base" d="${d}"/><path class="thread-grow" pathLength="1" d="${d}"/>${b}`
    grow = svg.querySelector('.thread-grow')
    buds = [...svg.querySelectorAll<SVGElement>('.bud')]
    marks = items.map((it) => (it.offsetTop + 30) / h)
  }

  const reveal = (it: Element) => {
    if (!reduced) gsap.to($$('.ev-icon .draw', it), { ...DRAW, duration: 0.7, stagger: 0.05, delay: 0.1 })
  }

  const update = (p: number) => {
    if (grow) grow.style.strokeDashoffset = String(1 - p)
    buds.forEach((b) => b.classList.toggle('on', p >= Number(b.dataset.t)))
    items.forEach((it, i) => {
      const on = p >= marks[i] - 0.01
      it.classList.toggle('lit', on)
      if (on && !it.classList.contains('seen')) {
        it.classList.add('seen')
        reveal(it)
      }
    })
  }

  build()
  if (!reduced) hideStroke($$('.ev-icon .draw', wrap))
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 65%',
    end: 'bottom 65%',
    onUpdate: (s) => update(s.progress),
    onRefresh: (s) => {
      build()
      update(s.progress)
    },
  })
}

/** Garden plan: walls and channels draw, water fills, trees are planted. */
function charbagh() {
  const svg = $('.charbagh')
  if (!svg) return
  const lines = $$('.plan-lines path', svg)
  const fills = $$('.plan-fills path', svg)
  const trees = $$<SVGElement>('.tree', svg).sort((a, b) => Number(a.dataset.r) - Number(b.dataset.r))
  hideStroke(lines)
  gsap.set(fills, { autoAlpha: 0 })
  gsap.set(trees, { scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' })
  const tl = gsap
    .timeline({ paused: true })
    .to(lines, { ...DRAW, duration: 0.9, stagger: 0.05 }, 0)
    .to(fills, { autoAlpha: 1, duration: 0.6, ease: 'emilOut', stagger: 0.04 }, 0.5)
    .to(trees, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'emilOut', stagger: 0.008 }, 0.7)
  once(svg, 'top 85%', () => tl.play())
}

/** Watercolour swatches bloom in like drops of pigment. */
function palette() {
  const chips = $$('.chip')
  if (!chips.length) return
  const dots = chips.map((c) => c.querySelector('.swatch')!)
  const labels = chips.map((c) => c.querySelector('span')!)
  gsap.set(dots, { scale: 0.6, rotation: -25, autoAlpha: 0 })
  gsap.set(labels, { autoAlpha: 0, y: 4 })
  once(chips[0].parentElement!, 'top 90%', () => {
    gsap.to(dots, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'emilOut', stagger: 0.06, clearProps: 'transform' })
    gsap.to(labels, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'emilOut', stagger: 0.06, delay: 0.15, clearProps: 'transform' })
  })
}

function travel() {
  const cards = $$('.travel-card')
  if (!cards.length) return
  gsap.set(cards, { autoAlpha: 0, y: 16 })
  cards.forEach((c) => hideStroke($$('.draw', c)))
  once(cards[0].parentElement!, 'top 88%', () => {
    gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'emilOut', stagger: 0.08, clearProps: 'transform' })
    cards.forEach((c, i) => gsap.to($$('.draw', c), { ...DRAW, duration: 0.8, stagger: 0.06, delay: 0.15 + i * 0.08 }))
  })
}

/** Lotus opens from a closed bud, petals fanning out from the centre. */
function lotus() {
  const svg = $('.lotus')
  if (!svg) return
  const petals = $$<SVGElement>('.petal', svg)
  const pads = $$('.pad', svg)
  const water = $$('.draw', svg)
  hideStroke(water)
  gsap.set(petals, { rotation: 0, scale: 0.7, autoAlpha: 0, transformOrigin: '50% 100%' })
  gsap.set(pads, { autoAlpha: 0, scaleX: 0.6, transformOrigin: '50% 100%' })
  const tl = gsap
    .timeline({ paused: true })
    .to(water, { ...DRAW, duration: 0.8, stagger: 0.1 }, 0)
    .to(pads, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: 'emilOut', stagger: 0.06 }, 0.15)
    .to([...petals].reverse(), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'emilOut', stagger: 0.03 }, 0.3)
  // fan open: centre petal stays, outer petals rotate out to their angle
  petals.forEach((p) => tl.to(p, { rotation: Number(p.dataset.a), duration: 0.8, ease: 'emilOut' }, 0.45))
  once(svg, 'top 88%', () => tl.play())
}

function flourishes() {
  $$('.paisley').forEach((svg) => {
    const paths = $$('.draw', svg)
    const pops = $$('.pop', svg)
    hideStroke(paths)
    gsap.set(pops, { scale: 0.5, autoAlpha: 0, transformOrigin: '50% 50%' })
    const tl = gsap
      .timeline({ paused: true })
      .to(pops, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'emilOut', stagger: 0.04 }, 0)
      .to(paths, { ...DRAW, duration: 0.9, stagger: 0.05 }, 0.08)
    once(svg, 'top 94%', () => tl.play())
  })
}

function footer() {
  const names = $('.footer .ink')
  if (!names) return
  once(names, 'top 94%', () =>
    gsap.fromTo(
      names,
      { '--ink': '100%' },
      { '--ink': '0%', duration: 0.9, ease: 'power2.inOut', onComplete: () => names.classList.add('inked') },
    ),
  )
}

/** Countdown rolls up from zero once, then ticks normally. */
function countUp() {
  const el = $('#countdown')
  if (!el) return
  once(el, 'top 92%', () => {
    $$('strong', el).forEach((s, i) => {
      const target = Number(s.textContent) || 0
      const o = { v: 0 }
      gsap.to(o, {
        v: target,
        duration: 1.1,
        delay: i * 0.06,
        ease: 'expo.out',
        onUpdate: () => (s.textContent = String(Math.round(o.v)).padStart(2, '0')),
      })
    })
  })
}

/** Depth: the Taj sinks slower than the page, the garland lifts away, copy eases off. */
function parallax() {
  const hero = '#hero'
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to('.hero .taj', { yPercent: 12, ease: 'none', scrollTrigger: st })
  gsap.to('.hero .garland', { yPercent: -30, ease: 'none', scrollTrigger: st })
  gsap.to('.hero-copy', { yPercent: -12, autoAlpha: 0.2, ease: 'none', scrollTrigger: st })
}
