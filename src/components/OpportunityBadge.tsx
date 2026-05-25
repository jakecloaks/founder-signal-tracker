import type { OpportunityCategory } from '../types'

const styles: Record<OpportunityCategory, string> = {
  high_potential: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  under_optimized: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  scaling_fast: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  weak_digital_presence: 'bg-red-500/10 text-red-400 border-red-500/20',
  strong_competitor: 'bg-zinc-700/50 text-zinc-400 border-zinc-700/40',
  needs_automation: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

const labels: Record<OpportunityCategory, string> = {
  high_potential: 'High Potential',
  under_optimized: 'Under-Optimized',
  scaling_fast: 'Scaling Fast',
  weak_digital_presence: 'Weak Digital',
  strong_competitor: 'Competitor',
  needs_automation: 'Needs Automation',
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
