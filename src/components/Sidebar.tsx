import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  MapPin,
  Bookmark,
  Radar,
  Settings,
  Zap,
} from 'lucide-react'

interface SidebarProps {
  credits?: number
  savedCount?: number
}

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/dashboard', icon: MapPin, label: 'Local Search', end: false },
  { to: '/saved', icon: Bookmark, label: 'Saved Leads', end: false, countProp: true },
]

export function Sidebar({ credits = 5, savedCount = 0 }: SidebarProps) {
  const creditColor =
    credits >= 3 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
    credits >= 1 ? 'text-amber-700 bg-amber-50 border-amber-200' :
    'text-red-700 bg-red-50 border-red-200'

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 shadow-sm">
          <Radar className="h-3.5 w-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-stone-900">SignalScope</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">Agency Intel</p>
        </div>
      </div>

      {/* Credits */}
      <div className="border-b border-stone-100 px-3 py-2.5">
        <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold ${creditColor}`}>
          <Zap className="h-3.5 w-3.5 shrink-0" />
          <span>
            {credits > 0 ? `${credits} search${credits !== 1 ? 'es' : ''} left` : 'No searches left'}
          </span>
          {credits === 0 && (
            <span className="ml-auto rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Upgrade
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2">
        <p className="mb-1 mt-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
          Workspace
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-stone-400 group-hover:text-stone-600'}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.countProp && savedCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-stone-200 px-1.5 text-[10px] font-bold text-stone-600">
                    {savedCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-100 p-2">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </button>
      </div>
    </aside>
  )
}
