# Agra wedding invitation

An animated, single-page wedding invitation with a Mughal / Agra theme in
marigold yellow and emerald green. Guests open a carved gateway (tap the gold
medallion **or** scroll), walk through the arch to the Taj Mahal at sunrise,
then scroll through the celebrations.

Live: https://agra-wedding-invitation.vercel.app

## Stack

- [Vite](https://vite.dev) + TypeScript (no UI framework)
- [GSAP](https://gsap.com) + ScrollTrigger for the sequences and scroll reveals
- Hand-built SVG artwork — no image files

## Editing the invitation

All content lives in [`src/config.ts`](src/config.ts): names, Agra's time zone,
the list of celebrations (date, time, place, dress code), which one is the main
event (countdown + hero date), venue, dress-code palette, travel notes, RSVP
email and deadline (leave the email empty to leave the RSVP button out). Times
are shown in Agra time wherever guests open the invitation, and the countdown
and calendar entries are correct in any time zone.

“Add all to calendar” exports every celebration in one `.ics` file.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Deploy

```bash
vercel deploy --prod --scope peritissimus-projects
```

## Structure

```
src/
  config.ts              # all invitation content
  render.ts              # page markup
  main.ts                # entry: countdown, calendar, RSVP wiring
  art/
    portal.ts            # gateway wall, jaali doors, lotus medallion
    taj.ts               # Taj Mahal at sunrise with reflecting pool
    garland.ts           # marigold & mango-leaf toran
    motifs.ts            # pietra dura bouquet, date arch, diya, event icons,
                         # charbagh plan, lotus, paisley, swatches, petals
    defs.ts              # shared gradients, jaali patterns, marigold symbol
    util.ts              # arch / cusp / lobe geometry helpers
  animations/
    ease.ts              # Emil Kowalski's custom curves (CustomEase)
    intro.ts             # tap-or-scroll gateway opening
    hero.ts              # sunrise, Taj drawing, garlands, ink-written names
    sections.ts          # reveals, line drawings, diya path
  lib/                   # date formatting, calendar export
  styles/main.css
```

## Motion

Timings follow Emil Kowalski's design-engineering guidelines:

- Entrances use a strong ease-out (`cubic-bezier(.23, 1, .32, 1)`), movement on
  screen uses a strong ease-in-out; no `ease-in` on UI.
- Native scrolling: nothing trails behind the guest's finger. Scroll-linked
  pieces move directly with the scroll.
- Cards are always there — never hidden until you reach them. Text settles in
  over 300ms on desktops; on touch screens, where a flick outruns any fade, text
  and numbers are simply shown. No word-by-word text or rolling numbers.
- Line drawings and icons draw in 0.6–0.8s with no delays, and nothing grows
  from nothing (entrances start at 0.6–0.85 scale with opacity).
- Names finish writing ~1.8s after the doors are tapped; a fresh scroll, swipe,
  tap or key while the doors open eases the rest up to speed.
- Only the diya path and the hero's depth are scroll-linked; everything else plays once.
- Buttons press to `scale(.97)`; hover effects are gated behind
  `(hover: hover) and (pointer: fine)`.
- Petals, garland sway, flame flicker and the fountain are CSS-only
  (transform + opacity) and petals pause when off screen.
- `prefers-reduced-motion`: no movement, opacity fades only.
