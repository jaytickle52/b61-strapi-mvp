import { subscribeLinks } from './ics'

/**
 * "Subscribe" menu: adds the school's whole calendar to the visitor's own
 * calendar app, which then keeps itself up to date. A plain <details>, so it
 * works without JavaScript.
 */
export default function Subscribe({ feedUrl, name }: { feedUrl: string; name: string }) {
  const l = subscribeLinks(feedUrl, name)
  const ext = { target: '_blank', rel: 'noopener noreferrer' }
  return (
    <details className="b61-subscribe">
      <summary className="b61-subscribe__btn">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <rect x="2.5" y="3.5" width="15" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2.5 8h15M6.5 2v3M13.5 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Subscribe to this calendar
      </summary>
      <div className="b61-subscribe__menu">
        <p className="b61-subscribe__note">New and changed events appear on your calendar automatically.</p>
        <ul>
          <li><a href={l.google} {...ext}>Google Calendar</a></li>
          <li><a href={l.apple}>Apple Calendar (iPhone, iPad, Mac)</a></li>
          <li><a href={l.outlook} {...ext}>Outlook</a></li>
        </ul>
        <label className="b61-subscribe__copy">
          <span>Other calendar apps: copy this address</span>
          <input type="text" readOnly value={l.feed} />
        </label>
      </div>
    </details>
  )
}
