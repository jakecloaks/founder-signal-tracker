import type { BusinessFilterKey, BusinessFilters } from '../types'
import { FILTER_OPTIONS } from '../utils/businessFilters'

interface BusinessFiltersBarProps {
  filters: BusinessFilters
  onChange: (key: BusinessFilterKey) => void
}

export function BusinessFiltersBar({ filters, onChange }: BusinessFiltersBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            filters.active === opt.key
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
              : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
