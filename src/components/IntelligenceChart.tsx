interface IntelligenceChartProps {
  label: string
  value: number
  accent?: 'indigo' | 'orange' | 'emerald' | 'amber'
}

const accentColors = {
  indigo:  'bg-indigo-500',
  orange:  'bg-orange-500',
  emerald: 'bg-emerald-500',
  amber:   'bg-amber-500',
}

export function IntelligenceChart({ label, value, accent = 'indigo' }: IntelligenceChartProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-stone-500">{label}</span>
        <span className="text-sm font-bold tabular-nums text-stone-700">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`chart-bar-fill h-full rounded-full ${accentColors[accent]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
