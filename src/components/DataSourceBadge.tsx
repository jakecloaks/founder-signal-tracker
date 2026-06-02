import type { BusinessDataSource } from '../types'

export function DataSourceBadge({ source }: { source: BusinessDataSource }) {
  if (source === 'google_places') {
    return (
      <span className="inline-flex items-center rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
        Real Data
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
      Demo Mode
    </span>
  )
}
