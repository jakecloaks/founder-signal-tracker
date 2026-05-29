export function BusinessCardSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-[#1E1E1E] px-4 py-4 sm:px-5">
      <div className="shimmer-bar h-9 w-9 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="shimmer-bar h-4 w-48 rounded" />
        <div className="shimmer-bar h-3 w-64 rounded" />
        <div className="shimmer-bar h-3 w-full rounded" />
        <div className="shimmer-bar h-3 w-4/5 rounded" />
        <div className="flex gap-1.5">
          <div className="shimmer-bar h-5 w-20 rounded" />
          <div className="shimmer-bar h-5 w-20 rounded" />
        </div>
      </div>
      <div className="shimmer-bar h-7 w-10 shrink-0 rounded-lg" />
    </div>
  )
}
