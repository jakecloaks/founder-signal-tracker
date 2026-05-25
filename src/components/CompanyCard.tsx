import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { Company } from '../types'
import { GrowthBadge } from './Badge'
import { IntentScore } from './IntentScore'
import { SignalStrengthBar } from './SignalStrengthBar'

interface CompanyCardProps {
  company: Company
  onClick: () => void
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  const topSignals = company.signals.slice(0, 3)

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-hover glass group w-full rounded-xl p-5 text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-indigo-500/20">
            {company.logo}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-white">{company.name}</h3>
            <p className="text-xs text-zinc-500">{company.industry}</p>
          </div>
        </div>
        <IntentScore score={company.intentScore} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <GrowthBadge status={company.growthStatus} />
        <span className="text-xs text-zinc-500">{company.signals.length} signals</span>
      </div>

      <div className="mt-4">
        <SignalStrengthBar value={company.signalStrength} label="Signal strength" size="sm" />
      </div>

      <ul className="mt-4 space-y-1.5">
        {topSignals.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-1 w-1 rounded-full bg-indigo-500" />
            {s.label}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <p className="text-xs leading-relaxed text-zinc-400">{company.outreachAngle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
        View intelligence
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </button>
  )
}
