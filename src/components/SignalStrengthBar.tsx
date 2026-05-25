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
  animated = true,
}: SignalStrengthBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2'
  const color =
    value >= 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
    value >= 60 ? 'bg-gradient-to-r from-indigo-500 to-violet-500' :
    value >= 40 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
    'bg-gradient-to-r from-zinc-500 to-zinc-600'

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-zinc-400">{label}</span>}
          {showValue && <span className="font-medium text-zinc-300">{value}%</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-zinc-800/80 ${height}`}>
        <div
          className={`${height} rounded-full ${animated ? 'chart-bar-fill' : ''} transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
