export function BusinessCardSkeleton() {
  return (
    <div className="glass animate-pulse rounded-xl p-5">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-800/80" />
        </div>
        <div className="h-11 w-11 rounded-full bg-zinc-800" />
      </div>
      <div className="mt-4 h-3 w-full rounded bg-zinc-800/60" />
      <div className="mt-2 h-3 w-4/5 rounded bg-zinc-800/60" />
    </div>
  )
}
