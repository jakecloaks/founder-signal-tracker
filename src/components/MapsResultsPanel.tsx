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
    <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 mb-3">
      <Circle className="h-2 w-2 shrink-0 fill-emerald-500 text-emerald-500" />
      <p className="text-xs text-stone-500">
        <span className="font-semibold text-stone-700">{count} results</span>
        {' · '}
        <span>{industry} in {location}</span>
        {serviceType && (
          <>
            {' · '}
            <span className="text-indigo-600">{serviceType}</span>
          </>
        )}
        {' · '}
        <span className="text-stone-400">
          {dataSource === 'google_places' ? 'Google Places' : 'Simulated'} · ranked by fit
        </span>
      </p>
    </div>
  )
}
