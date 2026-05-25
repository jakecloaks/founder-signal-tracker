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
  instagram: 'text-pink-600 border-pink-200 bg-pink-50',
  phone: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  website_form: 'text-sky-700 border-sky-200 bg-sky-50',
  email: 'text-sky-700 border-sky-200 bg-sky-50',
  facebook: 'text-blue-700 border-blue-200 bg-blue-50',
}

function getFitBarClass(score: number) {
  if (score >= 80) return 'fit-bar-hot'
  if (score >= 65) return 'fit-bar-strong'
  if (score >= 45) return 'fit-bar-mid'
  return 'fit-bar-low'
}

function getAvatarClass(score: number) {
  if (score >= 80) return 'bg-orange-50 text-orange-700 border-orange-200'
  if (score >= 65) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  if (score >= 45) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-stone-100 text-stone-500 border-stone-200'
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
        } ${hot ? 'border-l-2 border-l-orange-400' : 'border-l-2 border-l-transparent'}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div className="flex items-start gap-3 border-b border-stone-100 px-4 py-4 transition-colors hover:bg-stone-50 sm:px-5">
          {/* Avatar */}
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${getAvatarClass(business.fitScore)}`}
          >
            {business.logo}
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Name + score */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold text-stone-900">{business.name}</span>
                <span className="ml-2 text-xs text-stone-400">{business.industry}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {savedLeadsHook && (
                  <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
                )}
                <OpportunityScoreRing score={business.fitScore} pulse={hot} />
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
              {business.distance && (
                <span className="flex items-center gap-0.5 text-[11px] text-stone-400">
                  <MapPin className="h-2.5 w-2.5" />
                  {business.distance}
                </span>
              )}
              {business.phone && (
                <span className="flex items-center gap-0.5 text-[11px] text-stone-400">
                  <Phone className="h-2.5 w-2.5" />
                  {business.phone}
                </span>
              )}
              <PresenceChips footprint={business.footprint} />
              <DataSourceBadge source={business.dataSource} />
            </div>

            {/* AI fit explanation */}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500">
              {business.fitExplanation}
            </p>

            {/* Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {business.categories.slice(0, 2).map((c) => (
                <OpportunityBadge key={c} category={c} />
              ))}
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_STYLES[business.bestContactMethod]}`}
              >
                <MessageCircle className="h-2.5 w-2.5" />
                {CONTACT_LABELS[business.bestContactMethod]}
              </span>
            </div>
          </div>

          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-stone-300 opacity-0 transition-all group-hover:opacity-100" />
        </div>

        {/* Fit bar */}
        <div className="absolute bottom-0 left-0 h-px w-full">
          <div
            className={`h-full bar-fill ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%`, opacity: 0.5 }}
          />
        </div>
      </div>
    )
  }

  // Card view
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fade-in ${stagger} group w-full rounded-xl border border-stone-200 bg-white p-4 text-left shadow-sm card-lift ${
        liveFlash ? 'live-flash' : ''
      } ${hot ? 'border-l-2 border-l-orange-400' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${getAvatarClass(business.fitScore)}`}>
            {business.logo}
          </div>
          <div>
            <p className="font-semibold text-stone-900 leading-snug">{business.name}</p>
            <p className="text-[11px] text-stone-400">{business.industry} · {business.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 shrink-0">
          {savedLeadsHook && (
            <SaveButton business={business} savedLeadsHook={savedLeadsHook} className="opacity-0 group-hover:opacity-100" />
          )}
          <OpportunityScoreRing score={business.fitScore} pulse={hot} />
        </div>
      </div>

      {/* Rating + presence */}
      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        <PresenceChips footprint={business.footprint} />
      </div>

      {/* Contact + source */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <OpportunityBadge category={business.opportunityCategory} />
        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_STYLES[business.bestContactMethod]}`}>
          <MessageCircle className="h-2.5 w-2.5" />
          {CONTACT_LABELS[business.bestContactMethod]}
        </span>
        <DataSourceBadge source={business.dataSource} />
      </div>

      {/* Fit bar */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-stone-400">
          <span>Service fit</span>
          <span className="tabular-nums font-medium text-stone-500">{business.fitScore}/100</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full bar-fill rounded-full ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%` }}
          />
        </div>
      </div>

      {/* Fit explanation */}
      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-stone-500">
        {business.fitExplanation}
      </p>

      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-stone-400 opacity-0 transition-opacity group-hover:opacity-100">
        View full analysis
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}
