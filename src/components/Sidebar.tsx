import { NavLink } from 'react-router-dom'
import { LayoutGrid, Bookmark, Settings, Zap, MapPin } from 'lucide-react'
import { SignalScopeLogo } from './SignalScopeLogo'

interface SidebarProps {
  credits?: number
  savedCount?: number
}

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/dashboard', icon: MapPin, label: 'Local Search', end: false },
  { to: '/saved', icon: Bookmark, label: 'Saved Leads', end: false, showCount: true },
]

export function Sidebar({ credits = 5, savedCount = 0 }: SidebarProps) {
  const creditColor =
    credits >= 3 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' :
    credits >= 1 ? 'text-amber-400 bg-amber-500/10 border-amber-500/25' :
    'text-red-400 bg-red-500/10 border-red-500/25'

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-[#1E1E1E] bg-[#111] md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-[#1E1E1E] px-4 py-4">
        <SignalScopeLogo size="md" />
      </div>

      {/* Credits */}
      <div className="border-b border-[#1E1E1E] px-3 py-2.5">
        <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold ${creditColor}`}>
          <Zap className="h-3.5 w-3.5 shrink-0" />
          <span>
            {credits > 0
              ? `${credits} search${credits !== 1 ? 'es' : ''} left`
              : 'No searches left'}
          </span>
          {credits === 0 && (
            <span className="ml-auto rounded bg-[#4A90E2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Upgrade
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2">
        <p className="mb-1 mt-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#555]">
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
                  ? 'bg-[#4A90E2]/10 text-[#4A90E2] font-semibold'
                  : 'text-[#888] hover:bg-[#1A1A1A] hover:text-[#FAFAF9] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#4A90E2]' : 'text-[#555] group-hover:text-[#888]'}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.showCount && savedCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#2A2A2A] px-1.5 text-[10px] font-bold text-[#888]">
                    {savedCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1E1E1E] p-2">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#1A1A1A] hover:text-[#888]"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </button>
      </div>
    </aside>
  )
}
