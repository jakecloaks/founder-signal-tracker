import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  MapPin,
  Crosshair,
  Target,
  Settings,
  Radar,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/dashboard', icon: MapPin, label: 'Local Search', end: false },
  { to: '/dashboard', icon: Crosshair, label: 'Targets', end: false },
  { to: '/dashboard', icon: Target, label: 'Opportunities', end: false },
]

export function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-[#1c1c1c] bg-[#0a0a0a] md:flex">
      <div className="flex items-center gap-2.5 border-b border-[#1c1c1c] px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
          <Radar className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-white">SignalScope</p>
          <p className="mt-0.5 text-[10px] font-medium text-[#555] uppercase tracking-wider">Agency Intel</p>
        </div>
      </div>

      <nav className="flex-1 p-2">
        <p className="mb-1 mt-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#444]">Workspace</p>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-[#161624] text-white border-l-2 border-indigo-500 pl-[9px]'
                  : 'text-[#777] hover:bg-[#141414] hover:text-[#ccc]'
              }`
            }
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#1c1c1c] p-2">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[#555] transition-colors hover:bg-[#141414] hover:text-[#999]"
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
