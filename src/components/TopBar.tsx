import { Search } from 'lucide-react'

interface TopBarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  minIntent?: number
  onMinIntentChange?: (value: number) => void
  hideIntentFilter?: boolean
}

export function TopBar({ search, onSearchChange, searchPlaceholder = 'Filter results by business name…' }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1E1E1E] bg-[#0D0D0D]/95 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] py-2 pl-9 pr-4 text-sm text-[#FAFAF9] placeholder:text-[#555] focus:border-[#4A90E2]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/10 transition-all"
          />
        </div>
      </div>
    </header>
  )
}
