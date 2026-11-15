import { unstable_cache } from 'next/cache'
import { batchRunReports, type GARow } from './ga'

export const PERIODS = [7, 28, 90] as const
export type Period = (typeof PERIODS)[number]
export const toPeriod = (v: unknown): Period => (PERIODS.includes(Number(v) as Period) ? (Number(v) as Period) : 28)

export type Totals = { visitors: number; visits: number; pageViews: number; engagementRate: number; avgVisitSeconds: number }
export type SchoolReport = {
  days: Period
  current: Totals
  previous: Totals
  daily: { date: string; visitors: number }[]
  topPages: { path: string; title: string; views: number }[]
  sources: { name: string; visits: number }[]
  devices: { name: string; visitors: number }[]
  fetchedAt: string
}

const num = (r: GARow | undefined, i: number) => Number(r?.metricValues?.[i]?.value ?? 0) || 0
const dim = (r: GARow, i: number) => r.dimensionValues?.[i]?.value ?? ''

const TOTAL_METRICS = ['activeUsers', 'sessions', 'screenPageViews', 'engagementRate', 'averageSessionDuration'].map((name) => ({ name }))

/** Plain-language names for GA's default channel groups. */
const SOURCE_NAMES: Record<string, string> = {
  'Organic Search': 'Google and other search',
  Direct: 'Typed in or bookmarked',
  Referral: 'Links on other websites',
  'Organic Social': 'Social media',
  'Paid Search': 'Search ads',
  'Paid Social': 'Social media ads',
  Email: 'Email',
  Display: 'Display ads',
  'Organic Video': 'Video sites',
  Unassigned: 'Other',
}

async function fetchReport(propertyId: string, days: Period): Promise<SchoolReport> {
  const current = { startDate: `${days}daysAgo`, endDate: 'yesterday' }
  const previous = { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` }
  const [totals, daily, pages, sources, devices] = await batchRunReports(propertyId, [
    { dateRanges: [current, previous], metrics: TOTAL_METRICS },
    { dateRanges: [current], dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 100 },
    {
      dateRanges: [current],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    },
    {
      dateRanges: [current],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
    },
    { dateRanges: [current], dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }] },
  ])

  // With two date ranges GA adds a dateRange dimension: date_range_0 / date_range_1.
  const byRange = (key: string) => (totals.rows ?? []).find((r) => r.dimensionValues?.some((d) => d.value === key))
  const totalsOf = (r?: GARow): Totals => ({
    visitors: num(r, 0),
    visits: num(r, 1),
    pageViews: num(r, 2),
    engagementRate: num(r, 3),
    avgVisitSeconds: num(r, 4),
  })

  // Fill in days with no visitors so the chart has every day.
  const seen = new Map((daily.rows ?? []).map((r) => [dim(r, 0), num(r, 0)]))
  const series: SchoolReport['daily'] = []
  for (let i = days; i >= 1; i--) {
    const d = new Date(Date.now() - i * 86_400_000)
    const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
    series.push({ date: `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6)}`, visitors: seen.get(key) ?? 0 })
  }

  return {
    days,
    current: totalsOf(byRange('date_range_0')),
    previous: totalsOf(byRange('date_range_1')),
    daily: series,
    topPages: (pages.rows ?? []).map((r) => ({ path: dim(r, 0), title: dim(r, 1), views: num(r, 0) })),
    sources: (sources.rows ?? []).map((r) => ({ name: SOURCE_NAMES[dim(r, 0)] ?? dim(r, 0), visits: num(r, 0) })),
    devices: (devices.rows ?? []).map((r) => ({ name: dim(r, 0).replace(/^./, (c) => c.toUpperCase()), visitors: num(r, 0) })),
    fetchedAt: new Date().toISOString(),
  }
}

/** A school's numbers, kept for an hour so Google isn't asked on every page view. */
export const schoolReport = (propertyId: string, days: Period) =>
  unstable_cache(() => fetchReport(propertyId, days), ['b61-ga', propertyId, String(days)], { revalidate: 3600 })()

/** Percent change, or null when there's nothing to compare against. */
export const change = (now: number, before: number): number | null => (before > 0 ? ((now - before) / before) * 100 : null)
