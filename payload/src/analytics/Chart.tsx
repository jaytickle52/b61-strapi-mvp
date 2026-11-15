/** Visitors per day as simple bars. Server-rendered SVG; hover a bar for its number. */
export function DailyChart({ data }: { data: { date: string; visitors: number }[] }) {
  if (!data.length) return null
  const W = 1200
  const H = 240
  const padT = 12
  const padL = 44
  const padB = 26
  const max = niceMax(Math.max(...data.map((d) => d.visitors)))
  const step = (W - padL) / data.length
  const bar = Math.max(1, step * 0.7)
  const y = (v: number) => padT + (H - padB - padT) * (1 - v / max)
  const label = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const every = Math.ceil(data.length / 10)
  const total = data.reduce((a, d) => a + d.visitors, 0)
  const peak = data.reduce((a, d) => (d.visitors > a.visitors ? d : a), data[0])

  return (
    <svg
      className="b61-an__chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Visitors each day from ${label(data[0].date)} to ${label(data[data.length - 1].date)}: ${total.toLocaleString('en-US')} in all, busiest ${label(peak.date)} with ${peak.visitors.toLocaleString('en-US')}.`}
    >
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={padL} x2={W} y1={y(max * f)} y2={y(max * f)} className="b61-an__grid-line" />
          <text x={padL - 6} y={y(max * f) + 4} textAnchor="end" className="b61-an__axis">
            {Math.round(max * f).toLocaleString('en-US')}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + i * step + (step - bar) / 2
        return (
          <g key={d.date}>
            <rect x={x} y={y(d.visitors)} width={bar} height={Math.max(0, H - padB - y(d.visitors))} rx={Math.min(3, bar / 3)} className="b61-an__bar-rect">
              <title>{`${label(d.date)}: ${d.visitors.toLocaleString('en-US')} visitors`}</title>
            </rect>
            {i % every === 0 && (
              <text x={x + bar / 2} y={H - 8} textAnchor="middle" className="b61-an__axis">
                {label(d.date)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/** A round number just above the highest value, so the axis reads nicely. */
function niceMax(v: number) {
  if (v <= 4) return 4
  const mag = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= v) return m * mag
  return 10 * mag
}
