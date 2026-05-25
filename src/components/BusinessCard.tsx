import { ArrowRight, Phone, MessageCircle, MapPin } from 'lucide-react'
import type { LocalBusiness, ContactMethod } from '../types'
import { OpportunityBadge } from './OpportunityBadge'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { OpportunityScoreRing } from './OpportunityScoreRing'
import { DataSourceBadge } from './DataSourceBadge'

interface BusinessCardProps {
  business: LocalBusiness
  onClick: () => void
  listStyle?: boolean
  index?: number
  liveFlash?: boolean
}

const CONTACT_LABELS: Record<ContactMethod, string> = {
  instagram: 'DM on IG',
  phone: 'Call',
  website_form: 'Web form',
  email: 'Email',
  facebook: 'FB message',
}

const CONTACT_COLORS: Record<ContactMethod, string> = {
  instagram: 'text-pink-400 border-pink-500/20 bg-pink-500/8',
  phone: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8',
  website_form: 'text-sky-400 border-sky-500/20 bg-sky-500/8',
  email: 'text-sky-400 border-sky-500/20 bg-sky-500/8',
  facebook: 'text-blue-400 border-blue-500/20 bg-blue-500/8',
}

function getFitBarClass(score: number) {
  if (score >= 80) return 'fit-bar-hot'
  if (score >= 65) return 'fit-bar-strong'
  if (score >= 45) return 'fit-bar-mid'
  return 'fit-bar-low'
}

function getAvatarClass(score: number) {
  if (score >= 80) return 'bg-orange-500/15 text-orange-300 border border-orange-500/20'
  if (score >= 65) return 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
  if (score >= 45) return 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
  return 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40'
}

export function BusinessCard({ business, onClick, listStyle, index = 0, liveFlash }: BusinessCardProps) {
  const stagger = `stagger-${Math.min(4, (index % 4) + 1)}`
  const hot = business.fitScore >= 80

  if (listStyle) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group fade-in ${stagger} relative w-full text-left transition-colors hover:bg-[#111] ${
          liveFlash ? 'live-flash' : ''
        } ${hot ? 'border-l-2 border-l-orange-500/50' : 'border-l-2 border-l-transparent'}`}
      >
        <div className="flex items-start gap-3 border-b border-[#161616] px-4 py-3.5 sm:px-5">
          {/* Avatar */}
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${getAvatarClass(business.fitScore)}`}
          >
            {business.logo}
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Name + score row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold text-[#e2e2e2] group-hover:text-white transition-colors">
                  {business.name}
                </span>
                <span className="ml-2 text-xs text-[#555]">{business.industry}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_COLORS[business.bestContactMethod]}`}>
                  <MessageCircle className="h-2.5 w-2.5" />
                  {CONTACT_LABELS[business.bestContactMethod]}
                </span>
                <OpportunityScoreRing score={business.fitScore} pulse={hot} />
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
              <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
              <span className="flex items-center gap-0.5 text-[11px] text-[#444]">
                <MapPin className="h-2.5 w-2.5" />
                {business.distance}
              </span>
              {business.phone && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#444]">
                  <Phone className="h-2.5 w-2.5" />
                  {business.phone}
                </span>
              )}
              <PresenceChips footprint={business.footprint} />
              <DataSourceBadge source={business.dataSource} />
            </div>

            {/* AI explanation */}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666]">
              {business.fitExplanation}
            </p>

            {/* Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {business.categories.slice(0, 2).map((c) => (
                <OpportunityBadge key={c} category={c} />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#333] opacity-0 transition-all group-hover:text-[#666] group-hover:opacity-100" />
        </div>

        {/* Fit strength bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-[#111]" style={{ width: '100%' }}>
          <div
            className={`h-full bar-fill ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%`, opacity: 0.7 }}
          />
        </div>
      </button>
    )
  }

  // Card view
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group fade-in ${stagger} w-full rounded-lg border border-[#1c1c1c] bg-[#111] p-4 text-left transition-colors hover:border-[#252525] hover:bg-[#141414] ${
        liveFlash ? 'live-flash' : ''
      } ${hot ? 'border-l-[3px] border-l-orange-500/50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${getAvatarClass(business.fitScore)}`}>
            {business.logo}
          </div>
          <div>
            <p className="font-semibold text-[#e2e2e2] group-hover:text-white transition-colors leading-snug">
              {business.name}
            </p>
            <p className="text-[11px] text-[#555]">{business.industry} · {business.location}</p>
          </div>
        </div>
        <OpportunityScoreRing score={business.fitScore} pulse={hot} />
      </div>

      {/* Rating + presence */}
      <div className="mt-3 flex items-center gap-2.5">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        <PresenceChips footprint={business.footprint} />
      </div>

      {/* Badges */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <OpportunityBadge category={business.opportunityCategory} />
        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_COLORS[business.bestContactMethod]}`}>
          <MessageCircle className="h-2.5 w-2.5" />
          {CONTACT_LABELS[business.bestContactMethod]}
        </span>
        <DataSourceBadge source={business.dataSource} />
      </div>

      {/* Fit score bar */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-[#555]">
          <span>Service fit</span>
          <span className="tabular-nums text-[#777]">{business.fitScore}/100</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#1a1a1a]">
          <div
            className={`h-full bar-fill rounded-full ${getFitBarClass(business.fitScore)}`}
            style={{ width: `${business.fitScore}%` }}
          />
        </div>
      </div>

      {/* AI fit explanation */}
      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#666]">
        {business.fitExplanation}
      </p>

      <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#444] opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-[#888]">
        View full analysis
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}
