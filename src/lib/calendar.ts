import { config, type WeddingEvent } from '../config'
import { couple, eventEnd, eventStart, mainEvent } from './format'

/** UTC timestamps (…Z), so each calendar shows the event at the right moment wherever the guest is. */
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsEscape = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
/** iCalendar lines are folded so none runs past 75 bytes. */
const fold = (line: string) => (line.match(/.{1,60}/gu) ?? ['']).join('\r\n ')
const where = (e: WeddingEvent) => [e.place, config.venue.name, config.venue.address].filter(Boolean).join(', ')

/** One .ics file with every celebration in it. */
export function downloadIcs() {
  const now = stamp(new Date())
  const events = config.events.flatMap((e, i) => [
    'BEGIN:VEVENT',
    `UID:${e.date}-${i}-${encodeURIComponent(config.partnerOne + config.partnerTwo)}@invitation`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(eventStart(e))}`,
    `DTEND:${stamp(eventEnd(e))}`,
    `SUMMARY:${icsEscape(`${e.name} — ${couple()}`)}`,
    `LOCATION:${icsEscape(where(e))}`,
    ...(e.dress ? [`DESCRIPTION:${icsEscape(e.dress.label)}`] : []),
    'END:VEVENT',
  ])
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Agra Wedding Invitation//EN', ...events, 'END:VCALENDAR']
    .map(fold)
    .join('\r\n')
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
    dates: `${stamp(eventStart(e))}/${stamp(eventEnd(e))}`,
    location: where(e),
    details: e.dress?.label ?? '',
  })
  return `https://calendar.google.com/calendar/render?${p}`
}
