import type { GrowthStatus } from '../types'

const styles: Record<GrowthStatus, string> = {
  scaling: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  expanding: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  warming: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  watching: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
}

const labels: Record<GrowthStatus, string> = {
  scaling: 'Scaling',
  expanding: 'Expanding',
  warming: 'Warming Up',
  watching: 'Watching',
}

export function GrowthBadge({ status }: { status: GrowthStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
