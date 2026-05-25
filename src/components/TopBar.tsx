import { Search, Bell, SlidersHorizontal } from 'lucide-react'

interface TopBarProps {
  search: string
  onSearchChange: (value: string) => void
  minIntent: number
  onMinIntentChange: (value: number) => void
  searchPlaceholder?: string
  hideIntentFilter?: boolean
}

export function TopBar({
  search,
  onSearchChange,
  minIntent,
  onMinIntentChange,
  searchPlaceholder = 'Search companies, signals, industries...',
  hideIntentFilter,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-3">
          {!hideIntentFilter && (
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                Min intent
                <select
                  value={minIntent}
                  onChange={(e) => onMinIntentChange(Number(e.target.value))}
                  className="rounded border-0 bg-transparent text-sm font-medium text-zinc-200 focus:outline-none focus:ring-0"
                >
                  <option value={0}>All</option>
                  <option value={45}>45+</option>
                  <option value={65}>65+</option>
                  <option value={80}>80+ Hot</option>
                </select>
              </label>
            </div>
          )}

          <button
            type="button"
            className="relative rounded-lg border border-zinc-800 p-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>
        </div>
      </div>
    </header>
  )
}
