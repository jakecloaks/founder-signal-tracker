import { ArrowUpRight, MapPin, Phone, Sparkles, ExternalLink } from 'lucide-react'
import type { LocalBusiness } from '../types'
import { OpportunityBadge } from './OpportunityBadge'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { SignalStrengthBar } from './SignalStrengthBar'
import { OpportunityScoreRing } from './OpportunityScoreRing'
import { DataSourceBadge } from './DataSourceBadge'

interface BusinessCardProps {
  business: LocalBusiness
  onClick: () => void
  listStyle?: boolean
  index?: number
  liveFlash?: boolean
}

export function BusinessCard({ business, onClick, listStyle, index = 0, liveFlash }: BusinessCardProps) {
  const stagger = `stagger-${Math.min(4, (index % 4) + 1)}`
  const hot = business.opportunityScore >= 75
  const pulse = hot || liveFlash

  const scoreBlock = <OpportunityScoreRing score={business.opportunityScore} pulse={pulse} />

  if (listStyle) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`card-hover glass group fade-in ${stagger} flex w-full gap-4 rounded-xl p-4 text-left sm:p-5 ${
          hot ? 'opportunity-hot border-orange-500/20' : ''
        } ${liveFlash ? 'live-flash' : ''}`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/20 transition-all group-hover:ring-indigo-500/40">
          {business.logo}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100 transition-colors group-hover:text-white">
                {business.name}
              </h3>
              <p className="text-xs text-zinc-500">
                {business.industry} ·{' '}
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {business.distance}
                </span>
              </p>
            </div>
            {scoreBlock}
          </div>
          <div className="mt-2">
            <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
          </div>
          <div className="mt-3">
            <PresenceChips footprint={business.footprint} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {business.categories.slice(0, 2).map((c) => (
              <OpportunityBadge key={c} category={c} />
            ))}
            <DataSourceBadge source={business.dataSource} />
          </div>
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">{business.outreachAngle}</p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-indigo-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-hover glass group fade-in ${stagger} w-full rounded-xl p-5 text-left ${
        hot ? 'opportunity-hot border-orange-500/20' : ''
      } ${liveFlash ? 'live-flash' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-indigo-500/20 transition-all group-hover:ring-indigo-500/40">
            {business.logo}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-white">{business.name}</h3>
            <p className="text-xs text-zinc-500">{business.industry} · {business.location}</p>
          </div>
        </div>
        {scoreBlock}
      </div>

      <div className="mt-3">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
      </div>

      <div className="mt-3">
        <PresenceChips footprint={business.footprint} />
      </div>

      {business.phone && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <Phone className="h-3 w-3" />
          {business.phone}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <OpportunityBadge category={business.opportunityCategory} />
        {business.categories
          .filter((c) => c !== business.opportunityCategory)
          .slice(0, 1)
          .map((c) => (
            <OpportunityBadge key={c} category={c} />
          ))}
        <DataSourceBadge source={business.dataSource} />
      </div>

      <div className="mt-4 space-y-2">
        <SignalStrengthBar
          value={100 - business.footprint.digitalPresenceStrength}
          label="Outreach opportunity"
          size="sm"
        />
        <SignalStrengthBar
          value={business.footprint.digitalPresenceStrength}
          label="Digital presence"
          size="sm"
        />
      </div>

      <div className="mt-4 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 transition-colors group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <p className="text-xs leading-relaxed text-zinc-400">{business.outreachAngle}</p>
        </div>
      </div>

      {business.websiteUrl && (
        <p className="mt-2 flex items-center gap-1 text-xs text-zinc-600">
          <ExternalLink className="h-3 w-3" />
          <span className="truncate">{business.websiteUrl.replace(/^https?:\/\//, '')}</span>
        </p>
      )}

      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
        View recon report
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </button>
  )
}
