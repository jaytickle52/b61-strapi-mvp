import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import { Gutter } from '@payloadcms/ui'
import { canPublishAt, isB61Admin } from '@/access'
import { selectedSchool, schoolSiteUrl } from '@/brand/school'
import { GAError, serviceAccountEmail } from './ga'
import { change, PERIODS, schoolReport, toPeriod, type Period, type SchoolReport } from './report'
import { DailyChart } from './Chart'
import { StepNav } from './StepNav'
import { DEMO_SLUGS, sampleReport } from './sample'

/*
 * Admin > Analytics: the selected school's website numbers from Google
 * Analytics, plus form answers from this site's own database.
 */
export async function AnalyticsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, visibleEntities, permissions, locale, cookies } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fanalytics')
  const days = toPeriod(searchParams?.days)
  const school = await selectedSchool(req, cookies)

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <StepNav />
      <Gutter>
        <div className="b61-an">
          <header className="b61-an__head">
            <div>
              <h1>Website analytics</h1>
              {school && <p className="b61-an__sub">{school.name}</p>}
            </div>
            <nav className="b61-an__periods" aria-label="Time period">
              {PERIODS.map((p) => (
                <a key={p} href={`/admin/analytics?days=${p}`} className={p === days ? 'is-on' : undefined} aria-current={p === days ? 'page' : undefined}>
                  Last {p} days
                </a>
              ))}
            </nav>
          </header>
          {school ? <Body req={req} school={school} days={days} /> : <p>Pick a school in the School menu to see its numbers.</p>}
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

async function Body({ req, school, days }: { req: any; school: any; days: Period }) {
  const settings = (
    await req.payload.find({ collection: 'school-settings', where: { school: { equals: school.id } }, limit: 1, depth: 0, overrideAccess: true })
  ).docs[0] as any
  const propertyId: string | undefined = settings?.gaPropertyId?.trim() || undefined
  const admin = isB61Admin(req.user)
  const forms = canPublishAt(req.user, school.id) ? await formAnswers(req, school.id, days) : null

  let report: SchoolReport | null = null
  let problem: React.ReactNode = null
  const demo = !propertyId && !school.domains?.length && DEMO_SLUGS.includes(school.slug)
  if (demo) {
    report = sampleReport(days)
    problem = <>Sample numbers: {school.name} is a demo school with no Google Analytics, so these figures are made up to show how this page looks.</>
  } else if (!propertyId) {
    problem = admin ? (
      <>
        No Google Analytics property is set for {school.name}. Add it in <a href="/admin/collections/school-settings">School settings</a> &gt; Analytics.
      </>
    ) : (
      <>Google Analytics isn&apos;t connected for this school yet. Banner 61 will set it up.</>
    )
  } else if (!serviceAccountEmail()) {
    problem = admin ? (
      <>The Banner 61 Google service account isn&apos;t connected: add GA_SERVICE_ACCOUNT_JSON in Vercel.</>
    ) : (
      <>Analytics isn&apos;t switched on yet. Banner 61 will set it up.</>
    )
  } else {
    try {
      report = await schoolReport(propertyId, days)
    } catch (e) {
      const kind = e instanceof GAError ? e.kind : 'other'
      console.error('[analytics]', school.slug, (e as Error)?.message)
      problem =
        kind === 'no-access' && admin ? (
          <>
            Google says the Banner 61 account can&apos;t read property {propertyId}. In that property&apos;s Admin &gt; Property access management, add{' '}
            <strong>{serviceAccountEmail()}</strong> as a Viewer.
          </>
        ) : kind === 'bad-property' && admin ? (
          <>Google doesn&apos;t recognise property {propertyId}. Check the number in School settings &gt; Analytics.</>
        ) : (
          <>The numbers couldn&apos;t be loaded from Google Analytics just now. Try again in a few minutes.</>
        )
    }
  }

  return (
    <>
      {problem && <p className="b61-an__problem">{problem}</p>}
      {report && <Report report={report} site={schoolSiteUrl(school)} />}
      {forms && <Forms forms={forms} days={days} />}
      {report && !demo && (
        <p className="b61-an__foot">
          Visitor numbers from Google Analytics, through yesterday, compared with the {days} days before. Updated about once an hour.
        </p>
      )}
    </>
  )
}

const n = (v: number) => Math.round(v).toLocaleString('en-US')
const mmss = (s: number) => `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s`

function Delta({ now, before }: { now: number; before: number }) {
  const c = change(now, before)
  if (c == null) return <span className="b61-an__delta">No earlier numbers</span>
  const dir = Math.abs(c) < 0.5 ? 'flat' : c > 0 ? 'up' : 'down'
  const word = dir === 'flat' ? 'About the same' : `${dir === 'up' ? 'Up' : 'Down'} ${Math.abs(Math.round(c))}%`
  return <span className={`b61-an__delta is-${dir}`}>{word}</span>
}

function Report({ report, site }: { report: SchoolReport; site: string }) {
  const { current: c, previous: p } = report
  const cards = [
    { label: 'Visitors', value: n(c.visitors), now: c.visitors, before: p.visitors, help: 'Different people who came to the site' },
    { label: 'Visits', value: n(c.visits), now: c.visits, before: p.visits, help: 'Times someone came to the site' },
    { label: 'Pages viewed', value: n(c.pageViews), now: c.pageViews, before: p.pageViews, help: 'Every page opened' },
    { label: 'Average visit', value: mmss(c.avgVisitSeconds), now: c.avgVisitSeconds, before: p.avgVisitSeconds, help: 'How long a visit lasts' },
  ]
  const maxSource = Math.max(1, ...report.sources.map((s) => s.visits))
  const totalDevices = Math.max(1, report.devices.reduce((a, d) => a + d.visitors, 0))
  const origin = site.startsWith('http') ? site : ''

  return (
    <>
      <div className="b61-an__cards">
        {cards.map((k) => (
          <div key={k.label} className="b61-an__card">
            <span className="b61-an__label">{k.label}</span>
            <strong className="b61-an__value">{k.value}</strong>
            <Delta now={k.now} before={k.before} />
            <span className="b61-an__help">{k.help}</span>
          </div>
        ))}
      </div>

      <section className="b61-an__panel">
        <h2>Visitors each day</h2>
        <DailyChart data={report.daily} />
      </section>

      <div className="b61-an__grid">
        <section className="b61-an__panel">
          <h2>Most viewed pages</h2>
          {report.topPages.length ? (
            <table className="b61-an__table">
              <thead>
                <tr>
                  <th scope="col">Page</th>
                  <th scope="col" className="is-num">Views</th>
                </tr>
              </thead>
              <tbody>
                {report.topPages.map((pg) => (
                  <tr key={pg.path + pg.title}>
                    <td>
                      {origin ? (
                        <a href={origin + pg.path} target="_blank" rel="noreferrer">
                          {cleanTitle(pg.title) || pg.path}
                        </a>
                      ) : (
                        cleanTitle(pg.title) || pg.path
                      )}
                      <span className="b61-an__path">{pg.path}</span>
                    </td>
                    <td className="is-num">{n(pg.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="b61-an__empty">No page views in this period.</p>
          )}
        </section>

        <div>
          <section className="b61-an__panel">
            <h2>How people found the site</h2>
            {report.sources.length ? (
              <ul className="b61-an__bars">
                {report.sources.map((s) => (
                  <li key={s.name}>
                    <span className="b61-an__bar-label">{s.name}</span>
                    <span className="b61-an__bar">
                      <span style={{ width: `${(s.visits / maxSource) * 100}%` }} />
                    </span>
                    <span className="b61-an__bar-num">{n(s.visits)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b61-an__empty">No visits in this period.</p>
            )}
          </section>
          <section className="b61-an__panel">
            <h2>From AI assistants</h2>
            {(report.aiAssistants ?? []).length ? (
              <ul className="b61-an__bars">
                {report.aiAssistants.map((s) => (
                  <li key={s.name}>
                    <span className="b61-an__bar-label">{s.name}</span>
                    <span className="b61-an__bar">
                      <span style={{ width: `${(s.visits / Math.max(1, ...report.aiAssistants.map((x) => x.visits))) * 100}%` }} />
                    </span>
                    <span className="b61-an__bar-num">{n(s.visits)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b61-an__empty">No visits from ChatGPT, Perplexity, Claude, Copilot or Gemini in this period.</p>
            )}
            <p className="b61-an__note">Visits from links in AI answers. Clicks from Google&apos;s AI Overviews count as Google search.</p>
          </section>
          <section className="b61-an__panel">
            <h2>Devices</h2>
            {report.devices.length ? (
              <ul className="b61-an__bars">
                {report.devices.map((d) => (
                  <li key={d.name}>
                    <span className="b61-an__bar-label">{d.name}</span>
                    <span className="b61-an__bar">
                      <span style={{ width: `${(d.visitors / totalDevices) * 100}%` }} />
                    </span>
                    <span className="b61-an__bar-num">{Math.round((d.visitors / totalDevices) * 100)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="b61-an__empty">No visitors in this period.</p>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

/** "Admissions | Cedar Ridge" → "Admissions" */
const cleanTitle = (t: string) => (t && t !== '(not set)' ? t.split(' | ')[0] : '')

type FormCount = { id: string | number; title: string; count: number }

async function formAnswers(req: any, schoolId: number | string, days: Period): Promise<{ total: number; byForm: FormCount[] }> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString()
  const res = await req.payload.find({
    collection: 'form-submissions',
    where: { and: [{ school: { equals: schoolId } }, { createdAt: { greater_than_equal: since } }] },
    depth: 1,
    limit: 5000,
    pagination: false,
    select: { form: true },
    overrideAccess: true,
  })
  const map = new Map<string, FormCount>()
  for (const doc of res.docs as any[]) {
    const f = doc.form
    const id = typeof f === 'object' && f ? f.id : f
    const key = String(id ?? 'none')
    const row = map.get(key) ?? { id: id ?? key, title: (typeof f === 'object' && f?.title) || 'Form', count: 0 }
    row.count++
    map.set(key, row)
  }
  return { total: res.docs.length, byForm: [...map.values()].sort((a, b) => b.count - a.count) }
}

function Forms({ forms, days }: { forms: { total: number; byForm: FormCount[] }; days: Period }) {
  return (
    <section className="b61-an__panel">
      <h2>Form answers in the last {days} days</h2>
      <p className="b61-an__lead">
        <strong>{n(forms.total)}</strong> {forms.total === 1 ? 'answer' : 'answers'} from this website&apos;s forms.{' '}
        <a href="/admin/collections/form-submissions">See them all</a>
      </p>
      {forms.byForm.length > 0 && (
        <ul className="b61-an__list">
          {forms.byForm.map((f) => (
            <li key={String(f.id)}>
              <span>{f.title}</span>
              <strong>{n(f.count)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
