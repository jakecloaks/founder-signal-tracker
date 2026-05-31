import type { BusinessFilterKey, BusinessFilters } from '../types'
import { FILTER_OPTIONS } from '../utils/businessFilters'

interface BusinessFiltersBarProps {
  filters: BusinessFilters
  onChange: (key: BusinessFilterKey) => void
}

export function BusinessFiltersBar({ filters, onChange }: BusinessFiltersBarProps) {
  return (
    <div className="flex gap-0.5 overflow-x-auto">
      {FILTER_OPTIONS.map((opt) => {
        const active = filters.active === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`relative shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              active
                ? 'bg-[#4A8FE0]/10 text-[#4A8FE0]'
                : 'text-[#82829A] hover:bg-[#1C1C26] hover:text-[#EAEAF0]'
            }`}
          >
            {opt.label}
            {active && (
              <span className="absolute inset-x-1.5 bottom-0.5 h-[2px] rounded-full bg-[#4A8FE0]/60" />
            )}
          </button>
        )
      })}
    </div>
  )
}
