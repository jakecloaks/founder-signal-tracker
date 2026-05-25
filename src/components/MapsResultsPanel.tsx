import { Map } from 'lucide-react'
import type { BusinessDataSource } from '../types'
import { DataSourceBadge } from './DataSourceBadge'

interface MapsResultsPanelProps {
  industry: string
  location: string
  count: number
  dataSource: BusinessDataSource
}

export function MapsResultsPanel({ industry, location, count, dataSource }: MapsResultsPanelProps) {
  return (
    <div className="glass fade-in mb-4 flex items-center gap-3 rounded-xl border border-zinc-800 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <Map className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-200">
          {count} results · {industry} in {location}
        </p>
        <p className="text-xs text-zinc-500">
          {dataSource === 'google_places'
            ? 'Live Google Places data · ranked by outreach opportunity'
            : 'Simulated local recon · ranked by outreach opportunity'}
        </p>
      </div>
      <DataSourceBadge source={dataSource} />
      <span className="live-dot h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
    </div>
  )
}
