import type { OpportunityCategory } from '../types'

const styles: Record<OpportunityCategory, string> = {
  high_potential:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  under_optimized:      'bg-amber-50 text-amber-700 border-amber-200',
  scaling_fast:         'bg-orange-50 text-orange-700 border-orange-200',
  weak_digital_presence:'bg-red-50 text-red-600 border-red-200',
  strong_competitor:    'bg-stone-100 text-stone-500 border-stone-200',
  needs_automation:     'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const labels: Record<OpportunityCategory, string> = {
  high_potential:        'High Potential',
  under_optimized:       'Under-Optimized',
  scaling_fast:          'Scaling Fast',
  weak_digital_presence: 'Weak Digital',
  strong_competitor:     'Competitor',
  needs_automation:      'Needs Automation',
}

export function OpportunityBadge({ category }: { category: OpportunityCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${styles[category]}`}
    >
      {labels[category]}
    </span>
  )
}
