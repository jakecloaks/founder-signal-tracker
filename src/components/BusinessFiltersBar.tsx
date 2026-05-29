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
          className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
            filters.active === opt.key
              ? 'border-[#4A90E2]/40 bg-[#4A90E2]/10 text-[#4A90E2]'
              : 'border-[#2A2A2A] bg-transparent text-[#888] hover:border-[#333] hover:text-[#FAFAF9]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
