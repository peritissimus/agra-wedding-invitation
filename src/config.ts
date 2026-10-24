/**
 * All invitation content lives here. Edit this file, then redeploy.
 * Dates and times are as they are in Agra (see `timeZone`).
 */
export type EventIcon = 'haldi' | 'mehendi' | 'sangeet' | 'baraat' | 'wedding' | 'reception' | 'lotus'
export type TravelIcon = 'plane' | 'car' | 'train'

export interface WeddingEvent {
  name: string
  date: string // "YYYY-MM-DD"
  time: string // 24h "HH:MM"
  /** How long it runs, for calendar entries. */
  durationHours: number
  place?: string
  /** What to wear; `color` is any CSS colour or gradient, shown as a dot. */
  dress?: { label: string; color: string }
  /** Optional; otherwise picked from the name (haldi → bowl, mehendi → cone…). */
  icon?: EventIcon
}

export interface WeddingConfig {
  partnerOne: string
  partnerTwo: string
  /** The venue's time zone and its UTC offset: countdowns and calendar entries are right wherever guests are. */
  timeZone: string
  utcOffset: string
  hostLine: string
  city: string
  message: string
  events: WeddingEvent[]
  /** Index into `events` used for the countdown and the hero date. */
  mainEvent: number
  venue: { name: string; address?: string; mapQuery?: string; note?: string }
  /** The dress-code section: a heading (second part in italics), a line, and colours to show. */
  attire: { title: [string, string]; note: string; palette: { name: string; color: string }[] }
  travel: { title: string; note: string; icon: TravelIcon }[]
  /** Leave `email` empty to leave the RSVP button out. */
  rsvp: { email: string; deadline?: string; note?: string }
  closing: string
  /** Shows a small "sample" note in the footer until real details are in. */
  sample: boolean
}

export const config: WeddingConfig = {
  partnerOne: 'Arutna',
  partnerTwo: 'Kushal',
  timeZone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  hostLine: 'And it’s finally happening!',
  city: 'Agra',
  message: 'The countdown to two days of love, laughter, dancing and all things shaadi begins!',
  events: [
    {
      name: 'Haldi',
      date: '2026-11-23',
      time: '10:30',
      durationHours: 3,
      dress: { label: 'Come in your brightest, most colourful ethnics!', color: 'conic-gradient(#f2b51f 0 25%, #e8533f 0 50%, #d6336c 0 75%, #3f9a5a 0)' },
    },
    {
      name: 'Sangeet',
      date: '2026-11-23',
      time: '19:00',
      durationHours: 4,
      dress: { label: 'Bring your Bollywood energy, killer moves and most extraaaa outfits!', color: 'radial-gradient(circle at 35% 30%, #fff3c4, #d4a537 45%, #8c6a24)' },
    },
    {
      name: 'Wedding',
      date: '2026-11-24',
      time: '12:00',
      durationHours: 4,
      dress: { label: 'Pretty pastels and your best ethnic fits!', color: 'conic-gradient(#f2c9d1 0 25%, #cbe6d6 0 50%, #dccff0 0 75%, #c9dcef 0)' },
    },
  ],
  mainEvent: 2,
  venue: {
    name: 'Agra',
    address: 'India',
    mapQuery: 'Agra, India',
  },
  attire: {
    title: ['Your best', 'ethnic fits'],
    note: 'Each celebration has its own dress code, noted above. For the wedding, think pretty pastels:',
    palette: [
      { name: 'Blush', color: '#f2c9d1' },
      { name: 'Mint', color: '#cbe6d6' },
      { name: 'Lilac', color: '#dccff0' },
      { name: 'Powder blue', color: '#c9dcef' },
      { name: 'Peach', color: '#f7d5c0' },
    ],
  },
  travel: [
    { icon: 'plane', title: 'By air', note: 'Fly into Delhi (DEL). Agra’s own airport (AGR) has a few domestic flights.' },
    { icon: 'car', title: 'By road', note: 'About three to four hours from Delhi on the Yamuna Expressway.' },
    { icon: 'train', title: 'By rail', note: 'The Gatimaan Express runs from Hazrat Nizamuddin to Agra Cantt in about 100 minutes.' },
  ],
  rsvp: {
    email: '',
  },
  closing: 'With love',
  sample: false,
}
