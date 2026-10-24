import { config, type WeddingEvent } from '../config'

/**
 * Every time on the invitation is Agra time. Events are real instants (with
 * the venue's UTC offset), so the countdown and calendar entries are right for
 * guests anywhere, and dates and times are always shown as they are in Agra.
 */
export const at = (date: string, time: string) => new Date(`${date}T${time}:00${config.utcOffset}`)
export const eventStart = (e: WeddingEvent) => at(e.date, e.time)
export const eventEnd = (e: WeddingEvent) => new Date(eventStart(e).getTime() + e.durationHours * 3_600_000)
export const mainEvent = () => config.events[config.mainEvent] ?? config.events[config.events.length - 1]
export const weddingStart = () => eventStart(mainEvent())

const local = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleString('en-GB', { ...o, timeZone: config.timeZone })
const noon = (iso: string) => at(iso, '12:00')

export const fmtTime = (d: Date) => local(d, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '').toLowerCase()
export const fmtDay = (iso: string) => local(noon(iso), { day: 'numeric', month: 'long', year: 'numeric' })
export const fmtWeekday = (iso: string) => local(noon(iso), { weekday: 'long', day: 'numeric', month: 'long' })
export const weekdayOf = (iso: string) => local(noon(iso), { weekday: 'long' })
export const monthOf = (iso: string) => local(noon(iso), { month: 'long' })
export const dayOf = (iso: string) => Number(iso.slice(8, 10))
export const yearOf = (iso: string) => Number(iso.slice(0, 4))

/** "19 June 2027", "23 & 24 November 2026" or "19 – 21 November 2027". */
export function dateRange() {
  const ds = [...new Set(config.events.map((e) => e.date))].sort()
  const [a, b] = [ds[0], ds[ds.length - 1]]
  if (a === b) return fmtDay(a)
  const join = ds.length === 2 ? ' & ' : ' – '
  if (yearOf(a) !== yearOf(b)) return `${fmtDay(a)}${join}${fmtDay(b)}`
  if (monthOf(a) !== monthOf(b)) return `${dayOf(a)} ${monthOf(a)}${join}${dayOf(b)} ${monthOf(b)} ${yearOf(b)}`
  return `${dayOf(a)}${join}${dayOf(b)} ${monthOf(b)} ${yearOf(b)}`
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export const initials = () => `${config.partnerOne[0] ?? ''}${config.partnerTwo[0] ?? ''}`
export const couple = () => `${config.partnerOne} & ${config.partnerTwo}`
