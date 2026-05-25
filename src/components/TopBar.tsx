import { Search } from 'lucide-react'

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
  searchPlaceholder = 'Filter results by business name…',
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1c1c1c] bg-[#0a0a0a]">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444]" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-[#1c1c1c] bg-[#111] py-2 pl-9 pr-4 text-sm text-[#ccc] placeholder:text-[#444] focus:border-[#333] focus:outline-none"
          />
        </div>
      </div>
    </header>
  )
}
