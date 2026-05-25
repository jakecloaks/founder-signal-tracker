import type { BusinessFilterKey, BusinessFilters } from '../types'
import { FILTER_OPTIONS } from '../utils/businessFilters'

interface BusinessFiltersBarProps {
  filters: BusinessFilters
  onChange: (key: BusinessFilterKey) => void
}

export function BusinessFiltersBar({ filters, onChange }: BusinessFiltersBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            filters.active === opt.key
              ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
