import type { BusinessDataSource } from '../types'

export function DataSourceBadge({ source }: { source: BusinessDataSource }) {
  if (source === 'google_places') {
    return (
      <span className="inline-flex items-center rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
        Live
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded border border-[#2A2A2A] bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#555]">
      Sim
    </span>
  )
}
