import type { BusinessDataSource } from '../types'

const config: Record<BusinessDataSource, { label: string; className: string }> = {
  google_places: {
    label: 'Google Places',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  mock: {
    label: 'Simulated',
    className: 'border-zinc-600/50 bg-zinc-800/50 text-zinc-500',
  },
}

export function DataSourceBadge({ source }: { source: BusinessDataSource }) {
  const c = config[source]
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${c.className}`}>
      {c.label}
    </span>
  )
}
