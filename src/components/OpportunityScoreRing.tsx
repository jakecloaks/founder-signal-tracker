interface OpportunityScoreRingProps {
  score: number
  size?: 'sm' | 'lg'
  pulse?: boolean
}

export function OpportunityScoreRing({ score, size = 'sm', pulse }: OpportunityScoreRingProps) {
  const ring =
    score >= 80 ? 'text-orange-400' :
    score >= 65 ? 'text-indigo-400' :
    score >= 45 ? 'text-amber-400' :
    'text-zinc-400'

  const stroke =
    score >= 80 ? '#f97316' :
    score >= 65 ? '#818cf8' :
    score >= 45 ? '#fbbf24' :
    '#71717a'

  const dim = size === 'lg' ? 72 : 44
  const r = (dim - 8) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      className={`relative shrink-0 ${pulse ? 'score-pulse' : ''}`}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="rgba(39,39,42,0.8)"
          strokeWidth="3"
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-fill transition-all duration-700 ease-out"
        />
      </svg>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center font-semibold ${ring} ${
          size === 'lg' ? 'text-xl' : 'text-sm'
        }`}
      >
        <span>{score}</span>
        {size === 'lg' && <span className="text-[9px] font-normal text-zinc-500">opp.</span>}
      </div>
    </div>
  )
}
