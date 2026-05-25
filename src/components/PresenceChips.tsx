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
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-stone-100 text-stone-700 border-stone-200'
          : 'bg-stone-50 text-stone-400 border-stone-200'
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
