import { Circle } from 'lucide-react'
import type { BusinessDataSource } from '../types'

interface MapsResultsPanelProps {
  industry: string
  location: string
  serviceType: string
  count: number
  dataSource: BusinessDataSource
}

export function MapsResultsPanel({ industry, location, serviceType, count, dataSource }: MapsResultsPanelProps) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-md border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-2">
      <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 shrink-0" />
      <p className="text-xs text-[#777]">
        <span className="font-medium text-[#aaa]">{count} results</span>
        {' · '}
        <span className="text-[#888]">{industry} in {location}</span>
        {serviceType && (
          <>
            {' · '}
            <span className="text-indigo-400/80">{serviceType}</span>
          </>
        )}
        {' · '}
        <span className="text-[#555]">
          {dataSource === 'google_places' ? 'Google Places' : 'Simulated'} · ranked by fit
        </span>
      </p>
    </div>
  )
}
