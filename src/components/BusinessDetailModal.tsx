import {
  X, Globe, Phone, ExternalLink, Star,
} from 'lucide-react'
import type { LocalBusiness } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { DataSourceBadge } from './DataSourceBadge'
import { SaveButton } from './SaveButton'
import { BusinessReportCard } from './BusinessReportCard'
import type { useSavedLeads } from '../hooks/useSavedLeads'

interface BusinessDetailModalProps {
  business: LocalBusiness | null
  onClose: () => void
  savedLeadsHook?: ReturnType<typeof useSavedLeads>
}

function WOSBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 score-hot-glow' :
    score >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30 accent-glow' :
    score >= 45 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
    'bg-white/5 text-[#888] border-[#333]'
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2.5 shrink-0 ${style}`}>
      <span className="text-2xl font-black tabular-nums leading-none">{score}</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest opacity-60">WOS</span>
    </div>
  )
}

export function BusinessDetailModal({ business, onClose, savedLeadsHook }: BusinessDetailModalProps) {
  if (!business) return null
  const fp = business.footprint

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Panel */}
      <div
        className="slide-up relative z-10 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#111] shadow-2xl"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.65)' }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-[#555] transition-colors hover:bg-[#1A1A1A] hover:text-[#888]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Sticky header ───────────────────────────────────── */}
        <div className="sticky top-0 z-10 border-b border-[#1E1E1E] bg-[#111]/96 backdrop-blur-sm px-5 py-4">
          <div className="flex items-start gap-3 pr-10">
            {/* Logo avatar */}
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
              business.websiteOpportunityScore >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
              business.websiteOpportunityScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
              'bg-white/5 text-[#888] border-[#2A2A2A]'
            }`}>
              {business.logo}
            </div>

            {/* Name + meta */}
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold tracking-tight text-[#FAFAF9]">{business.name}</h2>
              <p className="text-sm text-[#888]">{business.industry} · {business.location}</p>
              <p className="mt-0.5 text-xs text-[#555]">{business.address}</p>
            </div>

            {/* WOS */}
            <WOSBadge score={business.websiteOpportunityScore} />
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
            <PresenceChips footprint={fp} />
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-[#888]">
                <Phone className="h-3 w-3" />{business.phone}
              </span>
            )}
            {business.websiteUrl ? (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-[#4A90E2] hover:text-[#6aaff0]"
              >
                <ExternalLink className="h-3 w-3" />
                {business.websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                <Globe className="h-3 w-3" />No website
              </span>
            )}
            <DataSourceBadge source={business.dataSource} />
            <span className="text-[11px] text-[#555]">Updated {relativeTime(business.lastUpdated)}</span>
          </div>

          {/* Save + review count pill */}
          <div className="mt-2.5 flex items-center gap-2">
            {savedLeadsHook && <SaveButton business={business} savedLeadsHook={savedLeadsHook} />}
            <span className="flex items-center gap-1 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-2 py-0.5 text-[11px] text-[#888]">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              {business.googleRating} · {business.reviewCount} reviews
            </span>
          </div>
        </div>

        {/* ── Report Card ─────────────────────────────────────── */}
        <BusinessReportCard business={business} />
      </div>
    </div>
  )
}
