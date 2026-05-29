import { Globe, Instagram, Facebook } from 'lucide-react'
import type { DigitalFootprint } from '../types'

function Chip({
  active,
  icon: Icon,
  label,
  weak,
}: {
  active: boolean
  icon: typeof Globe
  label: string
  weak?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
        active
          ? weak
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
            : 'bg-white/8 text-[#FAFAF9] border-[#333]'
          : 'bg-transparent text-[#555] border-[#2A2A2A]'
      }`}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" />
      {label}
    </span>
  )
}

export function PresenceChips({ footprint }: { footprint: DigitalFootprint }) {
  const igWeak = footprint.instagramExists && footprint.instagramActivityScore < 40
  const fbWeak = footprint.facebookExists && footprint.facebookActivityScore < 35

  return (
    <div className="flex flex-wrap gap-1">
      <Chip
        active={footprint.websiteExists}
        icon={Globe}
        label={footprint.websiteExists ? 'Site' : 'No site'}
        weak={footprint.websiteExists && footprint.websiteQualityScore < 45}
      />
      <Chip active={footprint.instagramExists} icon={Instagram} label="IG" weak={igWeak} />
      <Chip active={footprint.facebookExists} icon={Facebook} label="FB" weak={fbWeak} />
    </div>
  )
}
