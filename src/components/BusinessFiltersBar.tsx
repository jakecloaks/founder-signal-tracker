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
              ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
              : 'border-[#1c1c1c] bg-transparent text-[#666] hover:border-[#252525] hover:text-[#999]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
