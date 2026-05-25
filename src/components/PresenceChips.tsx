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
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${
        active
          ? weak
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-zinc-700 bg-zinc-800/50 text-zinc-500'
      }`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

export function PresenceChips({ footprint }: { footprint: DigitalFootprint }) {
  const igWeak = footprint.instagramExists && footprint.instagramActivityScore < 40
  const fbWeak = footprint.facebookExists && footprint.facebookActivityScore < 35

  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip
        active={footprint.websiteExists}
        icon={Globe}
        label={footprint.websiteExists ? 'Website' : 'No site'}
        weak={footprint.websiteExists && footprint.websiteQualityScore < 45}
      />
      <Chip
        active={footprint.instagramExists}
        icon={Instagram}
        label="IG"
        weak={igWeak}
      />
      <Chip
        active={footprint.facebookExists}
        icon={Facebook}
        label="FB"
        weak={fbWeak}
      />
    </div>
  )
}
