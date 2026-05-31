import type { OpportunityCategory } from '../types'

const styles: Record<OpportunityCategory, string> = {
  high_potential:        'bg-orange-500/10  text-orange-400  border-orange-500/25',
  under_optimized:       'bg-amber-500/10   text-amber-400   border-amber-500/25',
  scaling_fast:          'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  weak_digital_presence: 'bg-red-500/10     text-red-400     border-red-500/25',
  strong_competitor:     'bg-white/5        text-[#555]      border-[#2A2A2A]',
  needs_automation:      'bg-[#4A90E2]/10   text-[#4A90E2]   border-[#4A90E2]/25',
}

// Website redesign-focused labels
const labels: Record<OpportunityCategory, string> = {
  high_potential:        'Best lead',
  under_optimized:       'Outdated site',
  scaling_fast:          'Growing business',
  weak_digital_presence: 'No web presence',
  strong_competitor:     'Has good site',
  needs_automation:      'Weak social',
}

export function OpportunityBadge({ category }: { category: OpportunityCategory }) {
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${styles[category]}`}>
      {labels[category]}
    </span>
  )
}
