import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

// Emil Kowalski's curves. Built-in eases are too weak to feel intentional.
// emilOut: anything entering or leaving — starts fast, so it feels responsive.
CustomEase.create('emilOut', 'M0,0 C0.23,1 0.32,1 1,1')
// emilInOut: things moving or morphing while on screen.
CustomEase.create('emilInOut', 'M0,0 C0.77,0 0.175,1 1,1')

/**
 * Blur-in only where it's cheap. On a phone every blurred element is its own
 * offscreen pass, so there things simply rise and fade.
 */
const SOFT = matchMedia('(hover: hover) and (pointer: fine)').matches
export const blur = (px: number) => (SOFT ? { filter: `blur(${px}px)` } : {})
/** Touch screens: a flick outruns any fade, so text and numbers are simply shown. */
export const TOUCH = matchMedia('(pointer: coarse)').matches
