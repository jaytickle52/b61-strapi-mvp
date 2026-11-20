import type { Period, SchoolReport } from './report'

/** The seeded demo schools, which have no Google Analytics of their own. */
export const DEMO_SLUGS = ['cedar-ridge', 'harbor-oaks']

/**
 * Made-up numbers so the Analytics page can be reviewed on a demo school.
 * Always shown with a "sample numbers" notice. Same numbers on every load.
 */
export function sampleReport(days: Period, seed = 61): SchoolReport {
  let s = seed
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - i) * 86_400_000)
    const weekend = [0, 6].includes(d.getUTCDay())
    return { date: d.toISOString().slice(0, 10), visitors: Math.round((weekend ? 45 : 110) + rand() * 60) }
  })
  const visitors = Math.round(daily.reduce((a, d) => a + d.visitors, 0) * 0.82)
  const totals = (f: number) => ({
    visitors: Math.round(visitors * f),
    visits: Math.round(visitors * 1.35 * f),
    pageViews: Math.round(visitors * 3.1 * f),
    engagementRate: 0.62,
    avgVisitSeconds: 118 * f,
  })
  const share = (n: number) => Math.round(visitors * 3.1 * n)
  return {
    days,
    current: totals(1),
    previous: totals(0.88),
    daily,
    topPages: [
      { path: '/', title: 'Home', views: share(0.31) },
      { path: '/admissions', title: 'Admissions', views: share(0.14) },
      { path: '/tuition', title: 'Tuition and Aid', views: share(0.09) },
      { path: '/inquire', title: 'Inquire', views: share(0.06) },
      { path: '/academics', title: 'Academics', views: share(0.05) },
      { path: '/athletics', title: 'Athletics', views: share(0.04) },
      { path: '/events', title: 'Events', views: share(0.04) },
      { path: '/staff', title: 'Faculty and Staff', views: share(0.03) },
    ],
    sources: [
      { name: 'Google and other search', visits: Math.round(visitors * 0.62) },
      { name: 'Typed in or bookmarked', visits: Math.round(visitors * 0.38) },
      { name: 'Social media', visits: Math.round(visitors * 0.16) },
      { name: 'Links on other websites', visits: Math.round(visitors * 0.11) },
      { name: 'Email', visits: Math.round(visitors * 0.05) },
    ],
    aiAssistants: [
      { name: 'ChatGPT', visits: Math.round(visitors * 0.021) },
      { name: 'Perplexity', visits: Math.round(visitors * 0.006) },
      { name: 'Gemini', visits: Math.round(visitors * 0.004) },
      { name: 'Microsoft Copilot', visits: Math.round(visitors * 0.003) },
    ],
    devices: [
      { name: 'Mobile', visitors: Math.round(visitors * 0.61) },
      { name: 'Desktop', visitors: Math.round(visitors * 0.36) },
      { name: 'Tablet', visitors: Math.round(visitors * 0.03) },
    ],
    popups: { views: Math.round(visitors * 0.4), clicks: Math.round(visitors * 0.04), closes: Math.round(visitors * 0.31) },
    fetchedAt: new Date().toISOString(),
  }
}
