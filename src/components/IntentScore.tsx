interface IntentScoreProps {
  score: number
  size?: 'sm' | 'lg'
}

export function IntentScore({ score, size = 'sm' }: IntentScoreProps) {
  const ring =
    score >= 80 ? 'text-orange-400 border-orange-500/40' :
    score >= 65 ? 'text-indigo-400 border-indigo-500/40' :
    score >= 45 ? 'text-yellow-400 border-yellow-500/40' :
    'text-zinc-400 border-zinc-600/40'

  const dim = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-10 w-10 text-sm'

  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-full border-2 bg-zinc-900/50 font-semibold ${ring} ${dim}`}
      title="Intent score"
    >
      <span>{score}</span>
      {size === 'lg' && <span className="text-[10px] font-normal text-zinc-500">/ 100</span>}
    </div>
  )
}
