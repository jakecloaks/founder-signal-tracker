interface SignalStrengthBarProps {
  value: number
  label?: string
  size?: 'sm' | 'md'
  showValue?: boolean
  animated?: boolean
}

export function SignalStrengthBar({
  value,
  label,
  size = 'md',
  showValue = true,
}: SignalStrengthBarProps) {
  const height = size === 'sm' ? 'h-1' : 'h-1.5'
  const clampedValue = Math.min(100, Math.max(0, value))

  const barColor =
    value >= 75 ? 'bg-orange-500' :
    value >= 55 ? 'bg-indigo-500' :
    value >= 35 ? 'bg-amber-500' :
    'bg-stone-300'

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-xs text-stone-500">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold tabular-nums text-stone-600">{value}</span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-stone-100 ${height}`}>
        <div
          className={`${height} rounded-full bar-fill ${barColor}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
