import { ArrowRight, Phone, MessageCircle, MapPin } from 'lucide-react'
import type { LocalBusiness, ContactMethod } from '../types'
import { OpportunityBadge } from './OpportunityBadge'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { OpportunityScoreRing } from './OpportunityScoreRing'
import { DataSourceBadge } from './DataSourceBadge'
import { SaveButton } from './SaveButton'
import type { useSavedLeads } from '../hooks/useSavedLeads'

interface BusinessCardProps {
  business: LocalBusiness
  onClick: () => void
  listStyle?: boolean
  index?: number
  liveFlash?: boolean
  savedLeadsHook?: ReturnType<typeof useSavedLeads>
}

const CONTACT_LABELS: Record<ContactMethod, string> = {
  instagram: 'DM on IG',
  phone: 'Call',
  website_form: 'Web form',
  email: 'Email',
  facebook: 'FB msg',
}

const CONTACT_STYLES: Record<ContactMethod, string> = {
  instagram: 'text-pink-400 border-pink-500/25 bg-pink-500/10',
  phone:     'text-emerald-400 border-emerald-500/25 bg-emerald-500/10',
  website_form: 'text-[#4A90E2] border-[#4A90E2]/25 bg-[#4A90E2]/10',
  email:     'text-[#4A90E2] border-[#4A90E2]/25 bg-[#4A90E2]/10',
  facebook:  'text-blue-400 border-blue-500/25 bg-blue-500/10',
}

function getFitBarClass(score: number) {
  if (score >= 80) return 'fit-bar-hot'
  if (score >= 65) return 'fit-bar-strong'
  if (score >= 45) return 'fit-bar-mid'
  return 'fit-bar-low'
}

function getAvatarClass(score: number) {
  if (score >= 80) return 'bg-orange-500/15 text-orange-400 border-orange-500/25'
  if (score >= 65) return 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25'
  if (score >= 45) return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
  return 'bg-white/5 text-[#888] border-[#2A2A2A]'
}

export function BusinessCard({
  business,
  onClick,
  listStyle,
  index = 0,
  liveFlash,
  savedLeadsHook,
}: BusinessCardProps) {
  const stagger = `stagger-${Math.min(4, (index % 4) + 1)}`
  const hot = business.fitScore >= 80

  if (listStyle) {
    return (
      <div
        className={`fade-in ${stagger} group relative cursor-pointer ${
          liveFlash ? 'live-flash' : ''
        } ${hot ? 'border-l-2 border-l-orange-500' : 'border-l-2 border-l-transparent'}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div className="flex items-start gap-3 border-b border-[#1E1E1E] px-4 py-4 transition-colors hover:bg-[#141414] sm:px-5">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${getAvatarClass(business.fitScore)}`}>
            {business.logo}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold text-[#FAFAF9]">{business.name}</span>
                <span className="ml-2 text-xs text-[#555]">{business.industry}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {savedLeadsHook && (
                  <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
                )}
                <OpportunityScoreRing score={business.fitScore} pulse={hot} />
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
              {business.distance && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#555]">
                  <MapPin className="h-2.5 w-2.5" />{business.distance}
                </span>
              )}
              {business.phone && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#555]">
                  <Phone className="h-2.5 w-2.5" />{business.phone}
                </span>
              )}
              <PresenceChips footprint={business.footprint} />
              <DataSourceBadge source={business.dataSource} />
            </div>

            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#888]">
              {business.fitExplanation}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {business.categories.slice(0, 2).map((c) => (
                <OpportunityBadge key={c} category={c} />
              ))}
              <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_STYLES[business.bestContactMethod]}`}>
                <MessageCircle className="h-2.5 w-2.5" />
                {CONTACT_LABELS[business.bestContactMethod]}
              </span>
            </div>
          </div>

          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#2A2A2A] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[#555]" />
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full">
          <div
            className={`h-full bar-fill ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%`, opacity: 0.3 }}
          />
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fade-in ${stagger} group w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-left card-lift ${
        liveFlash ? 'live-flash' : ''
      } ${hot ? 'border-l-2 border-l-orange-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${getAvatarClass(business.fitScore)}`}>
            {business.logo}
          </div>
          <div>
            <p className="font-semibold text-[#FAFAF9] leading-snug">{business.name}</p>
            <p className="text-[11px] text-[#555]">{business.industry} · {business.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 shrink-0">
          {savedLeadsHook && (
            <SaveButton business={business} savedLeadsHook={savedLeadsHook} className="opacity-0 group-hover:opacity-100" />
          )}
          <OpportunityScoreRing score={business.fitScore} pulse={hot} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        <PresenceChips footprint={business.footprint} />
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <OpportunityBadge category={business.opportunityCategory} />
        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_STYLES[business.bestContactMethod]}`}>
          <MessageCircle className="h-2.5 w-2.5" />
          {CONTACT_LABELS[business.bestContactMethod]}
        </span>
        <DataSourceBadge source={business.dataSource} />
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-[#555]">
          <span>Service fit</span>
          <span className="tabular-nums font-medium text-[#888]">{business.fitScore}/100</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#2A2A2A]">
          <div
            className={`h-full bar-fill rounded-full ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%` }}
          />
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#888]">
        {business.fitExplanation}
      </p>

      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#555] opacity-0 transition-opacity group-hover:opacity-100">
        View analysis <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}
