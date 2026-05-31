import { NavLink } from 'react-router-dom'
import { LayoutGrid, Bookmark, Settings, Zap, MapPin } from 'lucide-react'
import { SignalScopeLogo } from './SignalScopeLogo'
import { MrQuakMark } from './MrQuak'

interface SidebarProps {
  credits?: number
  savedCount?: number
}

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/dashboard', icon: MapPin,     label: 'Local Search', end: false },
  { to: '/saved',     icon: Bookmark,   label: 'Saved Leads',  end: false, showCount: true },
]

export function Sidebar({ credits = 5, savedCount = 0 }: SidebarProps) {
  const creditColor =
    credits >= 3 ? 'text-[#3DCC6E] bg-[#3DCC6E]/8 border-[#3DCC6E]/20' :
    credits >= 1 ? 'text-[#E8A520] bg-[#E8A520]/8 border-[#E8A520]/20' :
    'text-[#D95555] bg-[#D95555]/8 border-[#D95555]/20'

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-[#1F1F30] bg-[#101015] md:flex">
      {/* Logo */}
      <div className="flex items-center border-b border-[#1F1F30] px-4 py-[14px]">
        <SignalScopeLogo size="md" />
      </div>

      {/* Credits pill */}
      <div className="border-b border-[#1F1F30] px-3 py-3">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${creditColor}`}>
          <Zap className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          <span className="flex-1">
            {credits > 0
              ? `${credits} search${credits !== 1 ? 'es' : ''} left`
              : 'No searches left'}
          </span>
          {credits === 0 && (
            <span className="rounded bg-[#4A8FE0] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Upgrade
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3">
        <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#424258]">
          Workspace
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#4A8FE0]/10 text-[#4A8FE0] font-semibold'
                  : 'text-[#82829A] hover:bg-[#1C1C26] hover:text-[#EAEAF0] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-[15px] w-[15px] shrink-0 ${
                    isActive ? 'text-[#4A8FE0]' : 'text-[#424258] group-hover:text-[#82829A]'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="flex-1 leading-none">{item.label}</span>
                {item.showCount && savedCount > 0 && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1F1F30] px-1.5 text-[10px] font-bold text-[#82829A]">
                    {savedCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — MrQuak lives here */}
      <div className="border-t border-[#1F1F30] px-2 py-2.5">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-sm font-medium text-[#424258] transition-colors hover:bg-[#1C1C26] hover:text-[#82829A]"
        >
          <Settings className="h-[15px] w-[15px]" strokeWidth={2} />
          Settings
        </button>
        <div className="mt-2.5 flex items-center justify-center border-t border-[#1A1A28] pt-2.5">
          <MrQuakMark />
        </div>
      </div>
    </aside>
  )
}
