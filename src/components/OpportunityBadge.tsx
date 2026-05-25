import type { OpportunityCategory } from '../types'

const styles: Record<OpportunityCategory, string> = {
  high_potential: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  under_optimized: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  scaling_fast: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  weak_digital_presence: 'bg-red-500/15 text-red-400 border-red-500/30',
  strong_competitor: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
  needs_automation: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
}

const labels: Record<OpportunityCategory, string> = {
  high_potential: 'High Potential',
  under_optimized: 'Under-Optimized',
  scaling_fast: 'Scaling Fast',
  weak_digital_presence: 'Weak Digital Presence',
  strong_competitor: 'Strong Competitor',
  needs_automation: 'Needs Automation',
}

export function OpportunityBadge({ category }: { category: OpportunityCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[category]}`}
    >
      {labels[category]}
    </span>
  )
}
