import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Crosshair,
  Settings,
  Sparkles,
  Target,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard', icon: MapPin, label: 'Local Search', end: false },
  { to: '/dashboard', icon: Crosshair, label: 'Targets', end: false },
  { to: '/dashboard', icon: Target, label: 'Opportunities', end: false },
]

export function Sidebar() {
  return (
    <aside className="glass hidden w-56 shrink-0 flex-col border-r border-zinc-800 md:flex">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">LocalIQ</p>
          <p className="text-[10px] text-zinc-500">Agency Prospecting</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end !== false}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-300'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  )
}
