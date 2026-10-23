import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

interface IntroOptions {
  lenis: Lenis | null
  reduced: boolean
  hero: () => gsap.core.Timeline
}

/**
 * The page stays locked behind the gateway until the guest taps the medallion
 * or tries to scroll (wheel, swipe up, arrow/space). Either one plays the same
 * opening: the medallion turns, the doors swing inwards, light spills through
 * and we walk through the arch into the hero. Scrolling is handed back at ~1.8s.
 */
export function setupIntro({ lenis, reduced, hero }: IntroOptions) {
  const root = document.documentElement
  const intro = document.getElementById('intro')!
  const portal = document.getElementById('portal')!
  const seal = document.getElementById('seal') as HTMLButtonElement
  const doors = [intro.querySelector('.door-l'), intro.querySelector('.door-r')]
  const inlay = intro.querySelectorAll('.wall .inlay .draw')

  // Lock scrolling; pad for the scrollbar we hide so nothing shifts on unlock.
  const gutter = window.innerWidth - root.clientWidth
  root.classList.add('is-locked')
  if (gutter > 0) document.body.style.paddingRight = `${gutter}px`
  lenis?.stop()

  if (!reduced) {
    // Arrival: the gold inlay traces itself around the arch while the copy settles.
    gsap.set(inlay, { strokeDasharray: 1, strokeDashoffset: 1.001 })
    gsap.to(inlay, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.03 })
    gsap.from('.intro .band', { autoAlpha: 0, duration: 0.8, delay: 0.6, ease: 'emilOut' })
    gsap.from(seal, { scale: 0.9, autoAlpha: 0, duration: 0.6, delay: 0.2, ease: 'emilOut' })
    gsap.from('.intro-copy > *', { y: 8, autoAlpha: 0, filter: 'blur(4px)', duration: 0.6, ease: 'emilOut', stagger: 0.08, delay: 0.3, clearProps: 'filter' })
  }

  let opened = false
  let touchY = 0
  const onWheel = (e: WheelEvent) => e.deltaY > 2 && open()
  const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY)
  const onTouchMove = (e: TouchEvent) => touchY - e.touches[0].clientY > 16 && open()
  const onKey = (e: KeyboardEvent) => {
    if (e.target === seal || !['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) return
    e.preventDefault()
    open()
  }
  window.addEventListener('wheel', onWheel, { passive: true })
  intro.addEventListener('touchstart', onTouchStart, { passive: true })
  intro.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('keydown', onKey)
  seal.addEventListener('click', open)

  function detach() {
    window.removeEventListener('wheel', onWheel)
    intro.removeEventListener('touchstart', onTouchStart)
    intro.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('keydown', onKey)
    seal.removeEventListener('click', open)
  }

  function finish() {
    root.classList.remove('is-locked')
    root.classList.add('is-open')
    document.body.style.paddingRight = ''
    intro.hidden = true
    lenis?.start()
    ScrollTrigger.refresh()
    document.querySelector<HTMLElement>('#hero h1')?.focus({ preventScroll: true })
  }

  function open() {
    if (opened) return
    opened = true
    detach()
    intro.classList.add('is-opening')
    const tl = gsap.timeline({ defaults: { ease: 'emilOut' } })

    if (reduced) {
      tl.to(intro, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0).add(hero(), 0).call(finish, [], 0.4)
      return
    }

    tl.to('.intro-copy', { autoAlpha: 0, y: -8, duration: 0.25 }, 0)
      // the medallion turns like a latch, then lifts away
      .to(seal, { rotation: 90, scale: 0.94, duration: 0.32, overwrite: 'auto' }, 0)
      .to(seal, { scale: 0.72, autoAlpha: 0, duration: 0.28 }, 0.26)
      // doors swing inwards on their hinges
      .to(doors[0], { rotateY: 84, duration: 0.85, ease: 'emilInOut' }, 0.26)
      .to(doors[1], { rotateY: -84, duration: 0.85, ease: 'emilInOut' }, 0.26)
      .to('.door-shade', { opacity: 0.6, duration: 0.85, ease: 'emilInOut' }, 0.26)
      .to('.portal-glow', { opacity: 1, duration: 0.5 }, 0.4)
      // walk through the arch
      .to(portal, { scale: 3.2, duration: 0.9, ease: 'emilInOut' }, 0.85)
      .to('.portal-glow', { opacity: 0, duration: 0.5 }, 1.0)
      .to(portal, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 1.45)
      .to('.intro .petals', { autoAlpha: 0, duration: 0.4 }, 1.1)
      .add(hero(), 0.95)
      .call(finish, [], 1.8)
  }
}
