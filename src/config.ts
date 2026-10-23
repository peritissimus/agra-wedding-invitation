/**
 * All invitation content lives here. Edit this file, then redeploy.
 * Times are local to Agra (IST).
 */
export type EventIcon = 'haldi' | 'mehendi' | 'sangeet' | 'baraat' | 'wedding' | 'reception' | 'lotus'
export type TravelIcon = 'plane' | 'car' | 'train'

export interface WeddingEvent {
  name: string
  date: string // "YYYY-MM-DD"
  time: string // 24h "HH:MM"
  durationHours: number
  place?: string
  dress?: { label: string; color: string }
  /** Optional; otherwise picked from the name (haldi → bowl, mehendi → cone…). */
  icon?: EventIcon
}

export interface WeddingConfig {
  partnerOne: string
  partnerTwo: string
  hostLine: string
  city: string
  message: string
  events: WeddingEvent[]
  /** Index into `events` used for the countdown and the hero date. */
  mainEvent: number
  venue: { name: string; address: string; mapQuery?: string; note?: string }
  palette: { name: string; color: string }[]
  travel: { title: string; note: string; icon: TravelIcon }[]
  rsvp: { email: string; deadline?: string; note?: string }
  closing: string
  /** Shows a small "sample" note in the footer until real details are in. */
  sample: boolean
}

export const config: WeddingConfig = {
  partnerOne: 'Meera',
  partnerTwo: 'Arjun',
  hostLine: 'Together with their families',
  city: 'Agra',
  message:
    'With the blessings of our families, we invite you to Agra — the city of the Taj, the world’s most beautiful monument to love — to celebrate the beginning of our forever.',
  events: [
    { name: 'Haldi', date: '2027-11-19', time: '10:00', durationHours: 3, place: 'Poolside lawns', dress: { label: 'Shades of yellow', color: '#f2b51f' } },
    { name: 'Mehendi', date: '2027-11-19', time: '16:00', durationHours: 4, place: 'The courtyard', dress: { label: 'Shades of green', color: '#5f8a3c' } },
    { name: 'Sangeet', date: '2027-11-20', time: '19:30', durationHours: 4, place: 'The grand ballroom', dress: { label: 'Indo-western glam', color: '#c9a24a' } },
    { name: 'Baraat', date: '2027-11-21', time: '18:00', durationHours: 1.5, place: 'Main gate', dress: { label: 'Festive traditional', color: '#e8a317' } },
    { name: 'Wedding', date: '2027-11-21', time: '19:30', durationHours: 4, place: 'The Mughal lawns', dress: { label: 'Traditional', color: '#1f5c42' } },
  ],
  mainEvent: 4,
  venue: {
    name: 'The Yamuna Pavilion',
    address: 'Your venue address, Agra, Uttar Pradesh',
    note: 'A short drive from the Taj Mahal, set in a riverside Mughal garden.',
  },
  palette: [
    { name: 'Marigold', color: '#f2b51f' },
    { name: 'Turmeric', color: '#e3a008' },
    { name: 'Mehendi', color: '#6f8a3a' },
    { name: 'Emerald', color: '#1f5c42' },
    { name: 'Pistachio', color: '#c9d6a3' },
    { name: 'Ivory', color: '#f4ecd8' },
  ],
  travel: [
    { icon: 'plane', title: 'By air', note: 'Most guests fly into Delhi (DEL). Agra’s own airport (AGR) has a few domestic flights.' },
    { icon: 'car', title: 'By road', note: 'About three to four hours from Delhi on the Yamuna Expressway.' },
    { icon: 'train', title: 'By rail', note: 'The Gatimaan Express runs from Hazrat Nizamuddin to Agra Cantt in about 100 minutes.' },
  ],
  rsvp: {
    email: '',
    deadline: '2027-10-15',
    note: 'Please let us know which celebrations you can join, and any dietary requirements.',
  },
  closing: 'With love',
  sample: true,
}
