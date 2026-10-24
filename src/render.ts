import { config } from './config'
import { couple, dateRange, dayOf, esc, eventStart, fmtDay, fmtTime, fmtWeekday, initials, mainEvent, monthOf, weddingStart, weekdayOf, yearOf } from './lib/format'
import { sharedDefs } from './art/defs'
import { garland } from './art/garland'
import { charbagh, dateArch, diya, eventIcon, inlayFlower, lotus, paisley, petals, swatch, travelIcon } from './art/motifs'
import { door, doorBox, medallion, wall } from './art/portal'
import { taj } from './art/taj'

const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

export function render(root: HTMLElement) {
  const start = weddingStart()
  const main = mainEvent()
  const days = new Set(config.events.map((e) => e.date)).size
  const mapQuery = config.venue.mapQuery ?? [config.venue.name, config.venue.address].filter(Boolean).join(' ')
  const box = `left:${doorBox.left}%;top:${doorBox.top}%;width:${doorBox.width}%;height:${doorBox.height}%`

  root.innerHTML = `${sharedDefs}
<div class="intro" id="intro">
  <div class="portal" id="portal">
    <div class="portal-glow" style="left:${doorBox.left}%;top:${doorBox.top}%;width:${doorBox.width * 2}%;height:${doorBox.height}%"></div>
    <div class="doors">
      <div class="door door-l" style="${box}">${door(false)}<span class="door-shade"></span></div>
      <div class="door door-r" style="${box};left:50%">${door(true)}<span class="door-shade"></span></div>
    </div>
    ${wall()}
    <button class="medallion" id="seal" aria-label="Open the doors to your invitation">${medallion(esc(initials()))}</button>
  </div>
  <div class="petals" aria-hidden="true">${petals(6, 3)}</div>
  <div class="intro-copy">
    <p class="to">You are cordially invited</p>
    <p class="eyebrow hint"><span>Tap the medallion</span><i></i><span>or scroll</span></p>
  </div>
</div>

<main>
<section class="hero" id="hero">
  ${taj()}
  ${garland(9)}
  <div class="petals" aria-hidden="true">${petals(14, 5)}</div>
  <div class="hero-copy">
    <p class="eyebrow h-in">${esc(config.hostLine)}</p>
    <h1 class="names" tabindex="-1">
      <span class="name ink">${esc(config.partnerOne)}</span>
      <span class="amp h-in">and</span>
      <span class="name ink">${esc(config.partnerTwo)}</span>
    </h1>
    <p class="eyebrow h-in h-late">invite you to celebrate their wedding</p>
    <p class="date-line h-in h-late">${esc(dateRange())}<i></i>${esc(config.city)}</p>
  </div>
</section>

<section class="block welcome" id="story">
  <svg class="motif" viewBox="0 0 200 200" aria-hidden="true">${inlayFlower('inlay')}</svg>
  <p class="eyebrow reveal">In the city of love</p>
  <h2 class="reveal">A celebration <em>in ${esc(config.city)}</em></h2>
  <p class="lead words">${config.message
    .split(' ')
    .map((w) => `<span class="word">${esc(w)}</span>`)
    .join(' ')}</p>
</section>

<section class="emerald when jaali-bg" id="when">
  <div class="inner">
    <p class="eyebrow reveal">Save the date</p>
    <div class="date-arch">
      ${dateArch()}
      <div class="date-inner reveal">
        <span class="d-week">${esc(weekdayOf(main.date))}</span>
        <span class="d-day">${dayOf(main.date)}</span>
        <span class="d-month">${esc(`${monthOf(main.date)} ${yearOf(main.date)}`)}</span>
        <span class="d-time">${esc(main.name)} at ${fmtTime(start)}</span>
      </div>
    </div>
    <div class="countdown reveal" id="countdown" aria-label="Time until the wedding"></div>
    <div class="reveal actions">
      <button class="btn gold" id="ics">Add all to calendar</button>
      <a class="btn on-dark" id="gcal" target="_blank" rel="noopener">Google Calendar</a>
    </div>
  </div>
</section>

<section class="block events" id="events">
  <p class="eyebrow reveal">The celebrations</p>
  <h2 class="reveal">${NUMBERS[days - 1] ?? days} ${days === 1 ? 'day' : 'days'} of <em>festivities</em></h2>
  <div class="diya-path">
    <svg class="thread" aria-hidden="true"></svg>
    <ol>
      ${config.events
        .map(
          (e) => `<li class="ev">
        <span class="diya">${diya()}</span>
        <div class="ev-card">
          ${eventIcon(e)}
          <div class="ev-body">
            <p class="ev-date">${esc(fmtWeekday(e.date))}</p>
            <h3>${esc(e.name)}</h3>
            <p class="ev-meta">${fmtTime(eventStart(e))}${e.place ? ` · ${esc(e.place)}` : ''}</p>
            ${e.dress ? `<p class="ev-dress"><i style="--c:${esc(e.dress.color)}"></i>${esc(e.dress.label)}</p>` : ''}
          </div>
        </div>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="block venue" id="venue">
  <p class="eyebrow reveal">Where</p>
  ${charbagh()}
  <h2 class="reveal venue-name">${esc(config.venue.name)}</h2>
  ${config.venue.address ? `<p class="reveal muted italic">${esc(config.venue.address)}</p>` : ''}
  ${config.venue.note ? `<p class="reveal small">${esc(config.venue.note)}</p>` : ''}
  <div class="reveal actions"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}">View on map</a></div>
</section>

<div class="divider">${paisley()}</div>

<section class="block attire" id="attire">
  <p class="eyebrow reveal">Dress code</p>
  <h2 class="reveal">${esc(config.attire.title[0])} <em>${esc(config.attire.title[1])}</em></h2>
  <p class="reveal">${esc(config.attire.note)}</p>
  <ul class="palette" aria-label="Suggested colours">${config.attire.palette
    .map((p, i) => `<li class="chip">${swatch(p.color, i)}<span>${esc(p.name)}</span></li>`)
    .join('')}</ul>
</section>

<section class="haldi travel" id="travel">
  <div class="inner">
    <p class="eyebrow reveal">Getting to ${esc(config.city)}</p>
    <h2 class="reveal">Travel <em>notes</em></h2>
    <div class="travel-grid">${config.travel
      .map((t) => `<article class="travel-card">${travelIcon(t.icon)}<h3>${esc(t.title)}</h3><p>${esc(t.note)}</p></article>`)
      .join('')}</div>
  </div>
</section>

<section class="emerald rsvp jaali-bg" id="rsvp">
  <div class="inner">
    ${lotus()}
    ${
      config.rsvp.email
        ? `<p class="eyebrow reveal">Kindly reply</p>
    <h2 class="reveal">Will you join us <em>in ${esc(config.city)}?</em></h2>
    <p class="reveal muted italic">${config.rsvp.deadline ? `Kindly respond by ${esc(fmtDay(config.rsvp.deadline))}` : 'We can’t wait to celebrate with you!'}</p>
    <div class="reveal actions"><button class="btn gold solid" id="rsvp-btn">RSVP</button></div>
    ${config.rsvp.note ? `<p class="reveal small">${esc(config.rsvp.note)}</p>` : ''}`
        : `<p class="eyebrow reveal">See you in ${esc(config.city)}</p>
    <h2 class="reveal">We can’t wait <em>to celebrate with you!</em></h2>`
    }
  </div>
</section>

<footer class="footer">
  ${paisley()}
  <p class="eyebrow reveal">${esc(config.closing)}</p>
  <p class="footer-names"><span class="ink">${esc(couple())}</span></p>
  <p class="eyebrow reveal">${esc(dateRange())} · ${esc(config.city)}</p>
  ${config.sample ? '<p class="small sample">Sample invitation — details to be personalised</p>' : ''}
</footer>
</main>`
}
