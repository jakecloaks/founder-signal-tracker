import type { BusinessDataSource } from '../types'

export function DataSourceBadge({ source }: { source: BusinessDataSource }) {
  if (source === 'google_places') {
    return (
      <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
      Sim
    </span>
  )
}
