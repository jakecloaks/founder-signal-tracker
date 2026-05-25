import { Search } from 'lucide-react'

interface TopBarProps {
  search: string
  onSearchChange: (value: string) => void
  minIntent?: number
  onMinIntentChange?: (value: number) => void
  searchPlaceholder?: string
  hideIntentFilter?: boolean
}

export function TopBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Filter results by business name…',
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
      </div>
    </header>
  )
}
