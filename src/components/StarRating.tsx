export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold tabular-nums text-amber-400">{rating}★</span>
      <span className="text-xs text-[#555]">({reviewCount})</span>
    </div>
  )
}
