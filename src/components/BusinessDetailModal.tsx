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
import { SaveButton } from './SaveButton'
import type { useSavedLeads } from '../hooks/useSavedLeads'

interface BusinessDetailModalProps {
  business: LocalBusiness | null
  onClose: () => void
  savedLeadsHook?: ReturnType<typeof useSavedLeads>
}

const CONTACT_LABELS: Record<ContactMethod, string> = {
  instagram: 'Instagram DM',
  phone: 'Direct Call',
  website_form: 'Website Form',
  email: 'Email',
  facebook: 'Facebook Message',
}

const CONTACT_STYLES: Record<ContactMethod, string> = {
  instagram: 'text-pink-700 border-pink-200 bg-pink-50',
  phone: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  website_form: 'text-sky-700 border-sky-200 bg-sky-50',
  email: 'text-sky-700 border-sky-200 bg-sky-50',
  facebook: 'text-blue-700 border-blue-200 bg-blue-50',
}

function ChannelBar({ label, value, isBest }: { label: string; value: number; isBest: boolean }) {
  const barColor = isBest ? 'bg-indigo-500' : 'bg-stone-200'
  return (
    <div className="flex items-center gap-3">
      <span className={`w-28 shrink-0 text-xs ${isBest ? 'font-semibold text-stone-800' : 'text-stone-500'}`}>
        {label}
        {isBest && <CheckCircle2 className="ml-1 inline h-3 w-3 text-indigo-500" />}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
        <div className={`h-full bar-fill rounded-full ${barColor}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-7 text-right text-xs tabular-nums text-stone-400">{value}</span>
    </div>
  )
}

function contactChannelRows(visibility: ContactChannelVisibility, best: ContactMethod) {
  return (
    [
      { label: 'Instagram', key: 'instagram' as ContactMethod, value: visibility.instagram },
      { label: 'Phone', key: 'phone' as ContactMethod, value: visibility.phone },
      { label: 'Website form', key: 'website_form' as ContactMethod, value: visibility.website_form },
      { label: 'Facebook', key: 'facebook' as ContactMethod, value: visibility.facebook },
      { label: 'Email', key: 'email' as ContactMethod, value: visibility.email },
    ] as const
  ).sort((a, b) => (a.key === best ? -1 : b.key === best ? 1 : b.value - a.value))
}

function SectionLabel({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </h3>
  )
}

export function BusinessDetailModal({ business, onClose, savedLeadsHook }: BusinessDetailModalProps) {
  if (!business) return null
  const fp = business.footprint
  const channelRows = contactChannelRows(business.contactChannelVisibility, business.bestContactMethod)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="slide-up relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-2xl"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-stone-100 bg-white/95 backdrop-blur-sm px-5 py-4">
          <div className="flex items-start gap-4 pr-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-base font-bold text-stone-600">
              {business.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-stone-900">{business.name}</h2>
              <p className="text-sm text-stone-500">{business.industry} · {business.location}</p>
              <p className="mt-0.5 text-xs text-stone-400">{business.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {business.categories.map((c) => <OpportunityBadge key={c} category={c} />)}
                <DataSourceBadge source={business.dataSource} />
                <span className="text-[11px] text-stone-400">Updated {relativeTime(business.lastUpdated)}</span>
              </div>
            </div>
            <OpportunityScoreRing score={business.fitScore} size="lg" pulse={business.fitScore >= 80} />
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
            <PresenceChips footprint={fp} />
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <Phone className="h-3 w-3" />
                {business.phone}
              </span>
            )}
            {business.websiteUrl ? (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {business.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-xs text-amber-600">No website</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {savedLeadsHook && (
              <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="divide-y divide-stone-100">
          {/* Fit Analysis */}
          <section className="px-5 py-4">
            <SectionLabel icon={Sparkles} label={business.serviceType ? `Fit analysis — ${business.serviceType}` : 'Fit analysis'} />
            <p className="text-sm leading-relaxed text-stone-700">{business.fitExplanation}</p>
            <p className="mt-2 text-xs text-stone-400">
              Maturity: <span className="capitalize text-stone-600">{business.businessMaturity}</span>
            </p>
          </section>

          {/* Best Contact Method */}
          <section className="px-5 py-4">
            <SectionLabel icon={MessageCircle} label="Recommended contact" />
            <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${CONTACT_STYLES[business.bestContactMethod]}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {CONTACT_LABELS[business.bestContactMethod]}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">{business.bestContactMethodReason}</p>
            <div className="mt-4 space-y-2.5">
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
            <SectionLabel icon={AlertTriangle} label="Detected weaknesses" />
            <ul className="space-y-1.5">
              {business.weaknesses.map((w) => (
                <li
                  key={w}
                  className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-stone-700"
                >
                  {w}
                </li>
              ))}
            </ul>
          </section>

          {/* Digital Footprint */}
          <section className="px-5 py-4">
            <SectionLabel icon={BarChart3} label="Digital footprint" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SignalStrengthBar value={business.fitScore} label="Service fit" />
              <SignalStrengthBar value={fp.digitalPresenceStrength} label="Digital presence" />
              <SignalStrengthBar value={fp.marketingMaturity} label="Marketing maturity" />
              <SignalStrengthBar value={fp.growthIntent} label="Growth intent" />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Globe, label: 'Website', value: fp.websiteExists ? `${fp.websiteQualityScore}` : '—' },
                { icon: Instagram, label: 'Instagram', value: fp.instagramExists ? `${fp.instagramActivityScore}` : '—' },
                { icon: Facebook, label: 'Facebook', value: fp.facebookExists ? `${fp.facebookActivityScore}` : '—' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center">
                  <item.icon className="mx-auto h-3.5 w-3.5 text-stone-400" />
                  <p className="mt-1 text-[10px] text-stone-400">{item.label}</p>
                  <p className="text-sm font-bold text-stone-700">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Outreach Intelligence */}
          <section className="px-5 py-4">
            <SectionLabel icon={Target} label="Outreach intelligence" />
            <div className="space-y-4">
              {[
                { label: 'Opener', value: business.outreachOpener, style: 'text-stone-700' },
                { label: 'Pain point', value: business.painPoint, style: 'text-stone-600' },
                { label: 'Service fit', value: business.serviceSuggestion, style: 'font-semibold text-orange-700' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.label}</p>
                  <p className={`mt-1 text-sm leading-relaxed ${item.style}`}>{item.value}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-stone-500">{business.outreachRecommendation}</p>
            </div>
          </section>

          {/* Pitch */}
          <section className="px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Suggested pitch</p>
            <p className="text-sm leading-relaxed text-stone-600">{business.suggestedServicePitch}</p>
            <p className="mt-3 border-l-2 border-indigo-300 pl-3 text-sm font-medium italic text-stone-500">
              "{business.outreachAngle}"
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
