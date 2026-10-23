import { config, type WeddingEvent } from '../config'
import { couple, eventStart, mainEvent } from './format'

const pad = (n: number) => String(n).padStart(2, '0')
const stamp = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
const icsEscape = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
const ends = (e: WeddingEvent) => new Date(eventStart(e).getTime() + e.durationHours * 3_600_000)
const where = (e: WeddingEvent) => [e.place, config.venue.name, config.venue.address].filter(Boolean).join(', ')

/** One .ics file with every celebration in it. */
export function downloadIcs() {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const events = config.events.flatMap((e, i) => [
    'BEGIN:VEVENT',
    `UID:${e.date}-${i}-${encodeURIComponent(config.partnerOne + config.partnerTwo)}@invitation`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(eventStart(e))}`,
    `DTEND:${stamp(ends(e))}`,
    `SUMMARY:${icsEscape(`${e.name} — ${couple()}`)}`,
    `LOCATION:${icsEscape(where(e))}`,
    'END:VEVENT',
  ])
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Agra Wedding Invitation//EN', ...events, 'END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'wedding.ics' })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function googleCalendarUrl() {
  const e = mainEvent()
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${couple()} — ${e.name}`,
    dates: `${stamp(eventStart(e))}/${stamp(ends(e))}`,
    location: where(e),
  })
  return `https://calendar.google.com/calendar/render?${p}`
}
