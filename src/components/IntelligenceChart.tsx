interface IntelligenceChartProps {
  label: string
  value: number
  accent?: 'blue' | 'orange' | 'green' | 'amber'
}

const accentColors = {
  blue:   'bg-[#4A90E2]',
  orange: 'bg-orange-500',
  green:  'bg-emerald-500',
  amber:  'bg-amber-500',
}

export function IntelligenceChart({ label, value, accent = 'blue' }: IntelligenceChartProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[#888]">{label}</span>
        <span className="text-sm font-bold tabular-nums text-[#FAFAF9]">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#2A2A2A]">
        <div
          className={`chart-bar-fill h-full rounded-full ${accentColors[accent]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
