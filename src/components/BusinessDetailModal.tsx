import {
  X,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Instagram,
  Facebook,
  AlertTriangle,
  Phone,
  ExternalLink,
} from 'lucide-react'
import type { LocalBusiness } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { OpportunityBadge } from './OpportunityBadge'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { SignalStrengthBar } from './SignalStrengthBar'
import { OpportunityScoreRing } from './OpportunityScoreRing'
import { IntelligenceChart } from './IntelligenceChart'
import { DataSourceBadge } from './DataSourceBadge'

interface BusinessDetailModalProps {
  business: LocalBusiness | null
  onClose: () => void
}

export function BusinessDetailModal({ business, onClose }: BusinessDetailModalProps) {
  if (!business) return null

  const fp = business.footprint

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="glass fade-in relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-lg font-bold text-indigo-400 ring-1 ring-indigo-500/20">
            {business.logo}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-100">{business.name}</h2>
            <p className="text-sm text-zinc-500">
              {business.industry} · {business.location}
            </p>
            <p className="mt-1 text-xs text-zinc-600">{business.address}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {business.categories.map((c) => (
                <OpportunityBadge key={c} category={c} />
              ))}
              <DataSourceBadge source={business.dataSource} />
            </div>
            {business.phone && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                <Phone className="h-3.5 w-3.5" />
                {business.phone}
              </p>
            )}
            {business.websiteUrl ? (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {business.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <p className="mt-1 text-xs text-amber-500/90">No website on file</p>
            )}
          </div>
          <OpportunityScoreRing score={business.opportunityScore} size="lg" pulse={business.opportunityScore >= 75} />
        </div>

        <div className="mt-4">
          <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        </div>

        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-300">
            <Sparkles className="h-4 w-4" />
            Business summary
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{business.aiSummary}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Maturity: <span className="capitalize text-zinc-400">{business.businessMaturity}</span>
            {' · '}
            Updated {relativeTime(business.lastUpdated)}
          </p>
        </div>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <BarChart3 className="h-4 w-4 text-zinc-500" />
            Digital footprint analysis
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <IntelligenceChart label="Digital presence" value={fp.digitalPresenceStrength} accent="indigo" />
            <IntelligenceChart label="Marketing maturity" value={fp.marketingMaturity} accent="indigo" />
            <IntelligenceChart label="Growth intent" value={fp.growthIntent} accent="emerald" />
            <IntelligenceChart label="Outreach opportunity" value={business.opportunityScore} accent="orange" />
          </div>
          <div className="mt-3 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <SignalStrengthBar value={fp.websiteQualityScore} label="Website quality" />
            <SignalStrengthBar value={fp.consistencyScore} label="Online consistency" />
            <SignalStrengthBar value={fp.reviewQualityScore} label="Review quality" />
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">Social presence breakdown</h3>
          <div className="mb-3">
            <PresenceChips footprint={fp} />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
              <Globe className="mx-auto h-4 w-4 text-zinc-500" />
              <p className="mt-1 text-xs text-zinc-500">Website</p>
              <p className="text-sm font-semibold text-zinc-200">
                {fp.websiteExists ? `${fp.websiteQualityScore}%` : 'Missing'}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
              <Instagram className="mx-auto h-4 w-4 text-zinc-500" />
              <p className="mt-1 text-xs text-zinc-500">Instagram</p>
              <p className="text-sm font-semibold text-zinc-200">
                {fp.instagramExists ? `${fp.instagramActivityScore}%` : 'Missing'}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
              <Facebook className="mx-auto h-4 w-4 text-zinc-500" />
              <p className="mt-1 text-xs text-zinc-500">Facebook</p>
              <p className="text-sm font-semibold text-zinc-200">
                {fp.facebookExists ? `${fp.facebookActivityScore}%` : 'Missing'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Detected weaknesses
          </h3>
          <ul className="space-y-2">
            {business.weaknesses.map((w) => (
              <li
                key={w}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-sm text-zinc-300"
              >
                {w}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Target className="h-4 w-4 text-orange-400" />
            Outreach intelligence
          </h3>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Opener</p>
          <p className="mt-1 text-sm text-zinc-300">{business.outreachOpener}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Pain point</p>
          <p className="mt-1 text-sm text-zinc-400">{business.painPoint}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Service suggestion</p>
          <p className="mt-1 text-sm font-medium text-orange-300/90">{business.serviceSuggestion}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{business.outreachRecommendation}</p>
        </section>

        <section className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-indigo-300">Suggested service pitch</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{business.suggestedServicePitch}</p>
          <p className="mt-3 text-sm font-medium text-zinc-200">"{business.outreachAngle}"</p>
        </section>
      </div>
    </div>
  )
}
