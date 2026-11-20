'use client'
import { noticeState, staleDays, stateLabel } from './status'

/** The Announcements list's Status column: Draft, Starts Dec 1, Showing now, Ended Nov 3. */
export function StatusCell({ rowData }: { rowData?: any }) {
  if (!rowData) return null
  const state = noticeState({ published: rowData._status === 'published', startsAt: rowData.startsAt, endsAt: rowData.endsAt })
  const stale = state === 'showing' ? staleDays(rowData) : null
  return (
    <span className={`b61-notice-status b61-notice-status--${state}`} title={stale ? `Up for ${stale} days with no end date` : undefined}>
      {stateLabel(state, rowData)}
      {stale ? ' · check' : ''}
    </span>
  )
}
