interface IntelligenceChartProps {
  label: string
  value: number
  accent?: 'indigo' | 'orange' | 'emerald' | 'amber'
}

const accentGradients = {
  indigo: 'from-indigo-600 to-violet-500',
  orange: 'from-orange-500 to-red-500',
  emerald: 'from-emerald-600 to-teal-500',
  amber: 'from-amber-500 to-yellow-500',
}

export function IntelligenceChart({ label, value, accent = 'indigo' }: IntelligenceChartProps) {
  return (
    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-3 transition-colors hover:border-zinc-700">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-zinc-500">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-zinc-200">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800/90">
        <div
          className={`chart-bar-fill h-full rounded-full bg-gradient-to-r ${accentGradients[accent]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
