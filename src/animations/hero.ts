import { gsap } from 'gsap'

export function prepareHero(reduced: boolean) {
  const hero = document.getElementById('hero')!
  if (reduced) {
    hero.querySelectorAll('.ink').forEach((n) => n.classList.add('inked'))
    gsap.set(hero.querySelectorAll('.h-in, .ink'), { autoAlpha: 0 })
    return
  }
  gsap.set(hero.querySelectorAll('.h-in'), { autoAlpha: 0, y: 8, filter: 'blur(4px)' })
  gsap.set(hero.querySelectorAll('.taj-lines path'), { strokeDasharray: 1, strokeDashoffset: 1.001 })
  gsap.set(hero.querySelectorAll('.taj-fills, .taj-reflect, .shimmer'), { autoAlpha: 0 })
  gsap.set(hero.querySelector('.taj-sun'), { autoAlpha: 0, y: 40 })
  gsap.set(hero.querySelectorAll('.taj-trees .tree'), { scale: 0.4, autoAlpha: 0, transformOrigin: '50% 100%' })
  gsap.set(hero.querySelectorAll('.garland .strand'), { y: -230 })
  gsap.set(hero.querySelector('.garland .leaves'), { y: -40, autoAlpha: 0 })
}

/**
 * Plays as we step through the arch: the sun rises, the Taj draws itself in
 * gold and fills with marble, garlands drop in, and the names are written
 * with a feathered ink wipe. All text is in by ~1.3s.
 */
export function heroTimeline(reduced: boolean) {
  const hero = document.getElementById('hero')!
  const tl = gsap.timeline({ defaults: { ease: 'emilOut' } })
  const petals = hero.querySelector('.petals')
  tl.call(() => petals?.classList.add('shown'), [], 0.2)

  if (reduced) return tl.to(hero.querySelectorAll('.h-in, .ink'), { autoAlpha: 1, duration: 0.4, ease: 'none' }, 0)

  // Scenery (decorative, can run a little longer than the text)
  tl.to(hero.querySelector('.taj-sun'), { autoAlpha: 1, y: 0, duration: 1.4 }, 0)
    .to(hero.querySelectorAll('.taj-lines path'), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.008 }, 0.05)
    .to(hero.querySelector('.taj-fills'), { autoAlpha: 1, duration: 0.8 }, 0.55)
    .to(hero.querySelectorAll('.taj-trees .tree'), { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.04 }, 0.35)
    .to(hero.querySelectorAll('.taj-reflect, .shimmer'), { autoAlpha: 1, duration: 1 }, 1.0)
    .to(hero.querySelector('.garland .leaves'), { y: 0, autoAlpha: 1, duration: 0.6 }, 0)
    .to(hero.querySelectorAll('.garland .strand'), { y: 0, duration: 0.9, ease: 'back.out(1.25)', stagger: { each: 0.035, from: 'center' } }, 0.05)

  // Text
  const settle = { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, clearProps: 'filter' }
  tl.to(hero.querySelector('.hero-copy > .eyebrow'), settle, 0)
  hero.querySelectorAll<HTMLElement>('.ink').forEach((el, i) => {
    tl.fromTo(
      el,
      { '--ink': '100%' },
      { '--ink': '0%', duration: 0.7, ease: 'power2.inOut', onComplete: () => el.classList.add('inked') },
      0.08 + i * 0.28,
    )
  })
  tl.to(hero.querySelector('.amp'), settle, 0.32)
  tl.to(hero.querySelectorAll('.h-late'), { ...settle, stagger: 0.06 }, 0.72)
  return tl
}
