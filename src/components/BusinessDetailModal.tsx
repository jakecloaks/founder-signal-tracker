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
  MessageCircle,
  CheckCircle2,
} from 'lucide-react'
import type { LocalBusiness, ContactMethod, ContactChannelVisibility } from '../types'
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

const CONTACT_LABELS: Record<ContactMethod, string> = {
  instagram: 'Instagram DM',
  phone: 'Direct Phone Call',
  website_form: 'Website Contact Form',
  email: 'Email',
  facebook: 'Facebook Message',
}

const CONTACT_COLORS: Record<ContactMethod, string> = {
  instagram: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  phone: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  website_form: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  email: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  facebook: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
}

function ChannelVisibilityRow({
  label,
  value,
  isBest,
}: {
  label: string
  value: number
  isBest: boolean
}) {
  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isBest ? 'border border-indigo-500/20 bg-indigo-500/5' : 'border border-zinc-800/60 bg-zinc-900/40'}`}>
      <span className={`w-28 text-xs ${isBest ? 'font-medium text-zinc-200' : 'text-zinc-500'}`}>{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${isBest ? 'bg-indigo-400' : 'bg-zinc-600'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`w-8 text-right text-xs tabular-nums ${isBest ? 'text-indigo-300' : 'text-zinc-500'}`}>{value}</span>
      {isBest && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
    </div>
  )
}

function contactChannelRows(
  visibility: ContactChannelVisibility,
  best: ContactMethod
): { label: string; key: ContactMethod; value: number }[] {
  return [
    { label: 'Instagram DM', key: 'instagram' as ContactMethod, value: visibility.instagram },
    { label: 'Phone', key: 'phone' as ContactMethod, value: visibility.phone },
    { label: 'Website Form', key: 'website_form' as ContactMethod, value: visibility.website_form },
    { label: 'Facebook', key: 'facebook' as ContactMethod, value: visibility.facebook },
    { label: 'Email', key: 'email' as ContactMethod, value: visibility.email },
  ].sort((a, b) => (a.key === best ? -1 : b.key === best ? 1 : b.value - a.value))
}

export function BusinessDetailModal({ business, onClose }: BusinessDetailModalProps) {
  if (!business) return null

  const fp = business.footprint
  const channelRows = contactChannelRows(business.contactChannelVisibility, business.bestContactMethod)

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
          <div className="flex flex-col items-center gap-1">
            <OpportunityScoreRing score={business.fitScore} size="lg" pulse={business.fitScore >= 75} />
            <span className="text-[10px] text-zinc-600">fit score</span>
          </div>
        </div>

        <div className="mt-4">
          <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        </div>

        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-300">
            <Sparkles className="h-4 w-4" />
            {business.serviceType ? `Fit analysis — ${business.serviceType}` : 'Business summary'}
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{business.fitExplanation}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Maturity: <span className="capitalize text-zinc-400">{business.businessMaturity}</span>
            {' · '}
            Updated {relativeTime(business.lastUpdated)}
          </p>
        </div>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <MessageCircle className="h-4 w-4 text-indigo-400" />
            Best contact method
          </h3>
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${CONTACT_COLORS[business.bestContactMethod]}`}>
            <CheckCircle2 className="h-4 w-4" />
            {CONTACT_LABELS[business.bestContactMethod]}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">{business.bestContactMethodReason}</p>
          <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Channel visibility scores</h4>
          <div className="space-y-2">
            {channelRows.map((row) => (
              <ChannelVisibilityRow
                key={row.key}
                label={row.label}
                value={row.value}
                isBest={row.key === business.bestContactMethod}
              />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <BarChart3 className="h-4 w-4 text-zinc-500" />
            Digital footprint analysis
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <IntelligenceChart label="Service fit score" value={business.fitScore} accent="orange" />
            <IntelligenceChart label="Digital presence" value={fp.digitalPresenceStrength} accent="indigo" />
            <IntelligenceChart label="Growth intent" value={fp.growthIntent} accent="emerald" />
            <IntelligenceChart label="Marketing maturity" value={fp.marketingMaturity} accent="indigo" />
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
