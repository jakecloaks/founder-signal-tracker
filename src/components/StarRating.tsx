import { Star } from 'lucide-react'

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const full = Math.floor(rating)
  const partial = rating - full >= 0.5

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < full
                ? 'fill-amber-400 text-amber-400'
                : i === full && partial
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-zinc-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-zinc-200">{rating}</span>
      <span className="text-xs text-zinc-500">({reviewCount})</span>
    </div>
  )
}
