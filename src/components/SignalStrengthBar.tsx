interface SignalStrengthBarProps {
  value: number
  label?: string
  size?: 'sm' | 'md'
  showValue?: boolean
}

export function SignalStrengthBar({ value, label, size = 'md', showValue = true }: SignalStrengthBarProps) {
  const height = size === 'sm' ? 'h-1' : 'h-1.5'
  const clampedValue = Math.min(100, Math.max(0, value))

  const barColor =
    value >= 75 ? 'bg-orange-500' :
    value >= 55 ? 'bg-[#4A90E2]' :
    value >= 35 ? 'bg-amber-500' :
    'bg-[#333]'

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-xs text-[#888]">{label}</span>}
          {showValue && <span className="text-xs font-semibold tabular-nums text-[#FAFAF9]">{value}</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-[#2A2A2A] ${height}`}>
        <div className={`${height} rounded-full bar-fill ${barColor}`} style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  )
}
