interface OpportunityScoreRingProps {
  score: number
  size?: 'sm' | 'lg'
  pulse?: boolean
}

function getTier(score: number) {
  if (score >= 80) return 'hot'
  if (score >= 65) return 'strong'
  if (score >= 45) return 'mid'
  return 'low'
}

const tierStyles = {
  hot:    'bg-orange-500/15 text-orange-400 border-orange-500/30',
  strong: 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30',
  mid:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  low:    'bg-white/5 text-[#888] border-[#333]',
}

export function OpportunityScoreRing({ score, size = 'sm', pulse }: OpportunityScoreRingProps) {
  const tier = getTier(score)
  const styles = tierStyles[tier]

  if (size === 'lg') {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border px-5 py-3 ${styles} ${
          tier === 'hot' && pulse ? 'score-hot-glow' : ''
        } ${tier === 'strong' ? 'accent-glow' : ''}`}
      >
        <span className="text-2xl font-bold tabular-nums leading-none">{score}</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest opacity-50">fit</span>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-sm font-bold tabular-nums ${styles} ${
        tier === 'hot' && pulse ? 'score-hot-glow' : ''
      }`}
      style={{ minWidth: '2.2rem' }}
    >
      {score}
    </div>
  )
}
