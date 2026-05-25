import {
  X,
  Target,
  Globe,
  Instagram,
  Facebook,
  AlertTriangle,
  Phone,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import type { LocalBusiness, ContactMethod, ContactChannelVisibility } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { OpportunityBadge } from './OpportunityBadge'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { SignalStrengthBar } from './SignalStrengthBar'
import { OpportunityScoreRing } from './OpportunityScoreRing'
import { DataSourceBadge } from './DataSourceBadge'

interface BusinessDetailModalProps {
  business: LocalBusiness | null
  onClose: () => void
}

const CONTACT_LABELS: Record<ContactMethod, string> = {
  instagram: 'Instagram DM',
  phone: 'Direct Call',
  website_form: 'Website Form',
  email: 'Email',
  facebook: 'Facebook Message',
}

const CONTACT_COLORS: Record<ContactMethod, string> = {
  instagram: 'text-pink-400 border-pink-500/25 bg-pink-500/8',
  phone: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/8',
  website_form: 'text-sky-400 border-sky-500/25 bg-sky-500/8',
  email: 'text-sky-400 border-sky-500/25 bg-sky-500/8',
  facebook: 'text-blue-400 border-blue-500/25 bg-blue-500/8',
}

function ChannelBar({
  label,
  value,
  isBest,
}: {
  label: string
  value: number
  isBest: boolean
}) {
  const barColor = isBest ? 'bg-indigo-500' : 'bg-zinc-700'
  return (
    <div className="flex items-center gap-3">
      <span className={`w-28 shrink-0 text-xs ${isBest ? 'font-medium text-[#ccc]' : 'text-[#555]'}`}>
        {label}
        {isBest && <CheckCircle2 className="ml-1 inline h-3 w-3 text-indigo-400" />}
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
        <div className={`h-full bar-fill rounded-full ${barColor}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-7 text-right text-xs tabular-nums text-[#555]">{value}</span>
    </div>
  )
}

function contactChannelRows(
  visibility: ContactChannelVisibility,
  best: ContactMethod
) {
  return [
    { label: 'Instagram', key: 'instagram' as ContactMethod, value: visibility.instagram },
    { label: 'Phone', key: 'phone' as ContactMethod, value: visibility.phone },
    { label: 'Website form', key: 'website_form' as ContactMethod, value: visibility.website_form },
    { label: 'Facebook', key: 'facebook' as ContactMethod, value: visibility.facebook },
    { label: 'Email', key: 'email' as ContactMethod, value: visibility.email },
  ].sort((a, b) => (a.key === best ? -1 : b.key === best ? 1 : b.value - a.value))
}

export function BusinessDetailModal({ business, onClose }: BusinessDetailModalProps) {
  if (!business) return null
  const fp = business.footprint
  const channelRows = contactChannelRows(business.contactChannelVisibility, business.bestContactMethod)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#222] bg-[#0f0f0f] shadow-2xl"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#1c1c1c] bg-[#0f0f0f] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-[#555] transition-colors hover:bg-[#1a1a1a] hover:text-[#aaa]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#222] bg-[#161616] text-base font-bold text-[#aaa]">
              {business.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white">{business.name}</h2>
              <p className="text-sm text-[#666]">
                {business.industry} · {business.location}
              </p>
              <p className="mt-0.5 text-xs text-[#444]">{business.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {business.categories.map((c) => <OpportunityBadge key={c} category={c} />)}
                <DataSourceBadge source={business.dataSource} />
                <span className="text-[11px] text-[#444]">Updated {relativeTime(business.lastUpdated)}</span>
              </div>
            </div>
            <OpportunityScoreRing score={business.fitScore} size="lg" pulse={business.fitScore >= 80} />
          </div>

          {/* Contact + rating inline */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
            <PresenceChips footprint={fp} />
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-[#555]">
                <Phone className="h-3 w-3" />
                {business.phone}
              </span>
            )}
            {business.websiteUrl ? (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {business.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-xs text-amber-500/80">No website</span>
            )}
          </div>
        </div>

        <div className="space-y-0 divide-y divide-[#161616]">

          {/* Fit Analysis */}
          <section className="px-5 py-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              {business.serviceType ? `Fit analysis — ${business.serviceType}` : 'Fit analysis'}
            </h3>
            <p className="text-sm leading-relaxed text-[#bbb]">{business.fitExplanation}</p>
            <p className="mt-2 text-xs text-[#555]">
              Maturity: <span className="capitalize text-[#777]">{business.businessMaturity}</span>
            </p>
          </section>

          {/* Best Contact Method */}
          <section className="px-5 py-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
              <MessageCircle className="h-3.5 w-3.5 text-indigo-400" />
              Recommended contact
            </h3>
            <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold ${CONTACT_COLORS[business.bestContactMethod]}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {CONTACT_LABELS[business.bestContactMethod]}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#666]">{business.bestContactMethodReason}</p>
            <div className="mt-4 space-y-2">
              {channelRows.map((row) => (
                <ChannelBar
                  key={row.key}
                  label={row.label}
                  value={row.value}
                  isBest={row.key === business.bestContactMethod}
                />
              ))}
            </div>
          </section>

          {/* Weaknesses */}
          <section className="px-5 py-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              Detected weaknesses
            </h3>
            <ul className="space-y-1.5">
              {business.weaknesses.map((w) => (
                <li
                  key={w}
                  className="rounded-md border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-xs text-[#bbb]"
                >
                  {w}
                </li>
              ))}
            </ul>
          </section>

          {/* Digital Footprint */}
          <section className="px-5 py-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
              <BarChart3 className="h-3.5 w-3.5" />
              Digital footprint
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <SignalStrengthBar value={business.fitScore} label="Service fit" />
              <SignalStrengthBar value={fp.digitalPresenceStrength} label="Digital presence" />
              <SignalStrengthBar value={fp.marketingMaturity} label="Marketing maturity" />
              <SignalStrengthBar value={fp.growthIntent} label="Growth intent" />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-[#1c1c1c] bg-[#111] p-3 text-center">
                <Globe className="mx-auto h-3.5 w-3.5 text-[#555]" />
                <p className="mt-1 text-[10px] text-[#555]">Website</p>
                <p className="text-sm font-bold text-[#ccc]">
                  {fp.websiteExists ? `${fp.websiteQualityScore}` : '—'}
                </p>
              </div>
              <div className="rounded-md border border-[#1c1c1c] bg-[#111] p-3 text-center">
                <Instagram className="mx-auto h-3.5 w-3.5 text-[#555]" />
                <p className="mt-1 text-[10px] text-[#555]">Instagram</p>
                <p className="text-sm font-bold text-[#ccc]">
                  {fp.instagramExists ? `${fp.instagramActivityScore}` : '—'}
                </p>
              </div>
              <div className="rounded-md border border-[#1c1c1c] bg-[#111] p-3 text-center">
                <Facebook className="mx-auto h-3.5 w-3.5 text-[#555]" />
                <p className="mt-1 text-[10px] text-[#555]">Facebook</p>
                <p className="text-sm font-bold text-[#ccc]">
                  {fp.facebookExists ? `${fp.facebookActivityScore}` : '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Outreach Intelligence */}
          <section className="px-5 py-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
              <Target className="h-3.5 w-3.5 text-orange-400" />
              Outreach intelligence
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">Opener</p>
                <p className="mt-1 text-sm leading-relaxed text-[#bbb]">{business.outreachOpener}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">Pain point</p>
                <p className="mt-1 text-sm leading-relaxed text-[#888]">{business.painPoint}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444]">Service fit</p>
                <p className="mt-1 text-sm font-semibold text-orange-300/90">{business.serviceSuggestion}</p>
              </div>
              <p className="text-xs leading-relaxed text-[#666]">{business.outreachRecommendation}</p>
            </div>
          </section>

          {/* Pitch */}
          <section className="px-5 py-4">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#444]">
              Suggested pitch
            </h3>
            <p className="text-sm leading-relaxed text-[#999]">{business.suggestedServicePitch}</p>
            <p className="mt-3 border-l-2 border-indigo-500/40 pl-3 text-sm font-medium italic text-[#777]">
              "{business.outreachAngle}"
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
