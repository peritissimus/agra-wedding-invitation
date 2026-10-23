import { config, type WeddingEvent } from '../config'

export const at = (date: string, time: string) => new Date(`${date}T${time}:00`)
export const eventStart = (e: WeddingEvent) => at(e.date, e.time)
export const mainEvent = () => config.events[config.mainEvent] ?? config.events[config.events.length - 1]
export const weddingStart = () => eventStart(mainEvent())

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '').toLowerCase()

export const fmtDay = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export const fmtWeekday = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

/** "19 – 21 November 2027" (collapses shared month/year). */
export function dateRange() {
  const days = config.events.map((e) => new Date(`${e.date}T12:00:00`)).sort((a, b) => +a - +b)
  const [a, b] = [days[0], days[days.length - 1]]
  const month = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long' })
  if (+a === +b) return fmtDay(config.events[0].date)
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth())
    return `${a.getDate()} – ${b.getDate()} ${month(b)} ${b.getFullYear()}`
  return `${a.getDate()} ${month(a)} – ${b.getDate()} ${month(b)} ${b.getFullYear()}`
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export const initials = () => `${config.partnerOne[0] ?? ''}${config.partnerTwo[0] ?? ''}`
export const couple = () => `${config.partnerOne} & ${config.partnerTwo}`
