import {
  X, Target, Globe, Instagram, Facebook,
  AlertTriangle, Phone, ExternalLink, MessageCircle,
  CheckCircle2, Sparkles, BarChart3,
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
  instagram:    'text-pink-400 border-pink-500/25 bg-pink-500/10',
  phone:        'text-emerald-400 border-emerald-500/25 bg-emerald-500/10',
  website_form: 'text-[#4A90E2] border-[#4A90E2]/25 bg-[#4A90E2]/10',
  email:        'text-[#4A90E2] border-[#4A90E2]/25 bg-[#4A90E2]/10',
  facebook:     'text-blue-400 border-blue-500/25 bg-blue-500/10',
}

function ChannelBar({ label, value, isBest }: { label: string; value: number; isBest: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-28 shrink-0 text-xs ${isBest ? 'font-semibold text-[#FAFAF9]' : 'text-[#888]'}`}>
        {label}
        {isBest && <CheckCircle2 className="ml-1 inline h-3 w-3 text-[#4A90E2]" />}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2A2A2A]">
        <div
          className={`h-full bar-fill rounded-full ${isBest ? 'bg-[#4A90E2]' : 'bg-[#333]'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-7 text-right text-xs tabular-nums text-[#555]">{value}</span>
    </div>
  )
}

type ChannelKey = ContactMethod
type ChannelRow = { label: string; key: ChannelKey; value: number }

function contactChannelRows(visibility: ContactChannelVisibility, best: ContactMethod): ChannelRow[] {
  const rows: ChannelRow[] = [
    { label: 'Instagram', key: 'instagram', value: visibility.instagram },
    { label: 'Phone', key: 'phone', value: visibility.phone },
    { label: 'Website form', key: 'website_form', value: visibility.website_form },
    { label: 'Facebook', key: 'facebook', value: visibility.facebook },
    { label: 'Email', key: 'email', value: visibility.email },
  ]
  return rows.sort((a, b) => (a.key === best ? -1 : b.key === best ? 1 : b.value - a.value))
}

function SectionLabel({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">
      <Icon className="h-3.5 w-3.5" />{label}
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
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="slide-up relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#111] shadow-2xl"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[#1E1E1E] bg-[#111]/95 backdrop-blur-sm px-5 py-4">
          <div className="flex items-start gap-4 pr-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] text-base font-bold text-[#888]">
              {business.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#FAFAF9] tracking-tight">{business.name}</h2>
              <p className="text-sm text-[#888]">{business.industry} · {business.location}</p>
              <p className="mt-0.5 text-xs text-[#555]">{business.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {business.categories.map((c) => <OpportunityBadge key={c} category={c} />)}
                <DataSourceBadge source={business.dataSource} />
                <span className="text-[11px] text-[#555]">Updated {relativeTime(business.lastUpdated)}</span>
              </div>
            </div>
            <OpportunityScoreRing score={business.fitScore} size="lg" pulse={business.fitScore >= 80} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
            <PresenceChips footprint={fp} />
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-[#888]">
                <Phone className="h-3 w-3" />{business.phone}
              </span>
            )}
            {business.websiteUrl ? (
              <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#4A90E2] hover:text-[#6aaff0]"
                onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-3 w-3" />
                {business.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-xs text-amber-400">No website</span>
            )}
          </div>

          {savedLeadsHook && (
            <div className="mt-3">
              <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
            </div>
          )}
        </div>

        <button type="button" onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-[#555] transition-colors hover:bg-[#1A1A1A] hover:text-[#888]">
          <X className="h-4 w-4" />
        </button>

        <div className="divide-y divide-[#1E1E1E]">
          <section className="px-5 py-4">
            <SectionLabel icon={Sparkles} label={business.serviceType ? `Fit analysis — ${business.serviceType}` : 'Fit analysis'} />
            <p className="text-sm leading-relaxed text-[#FAFAF9]">{business.fitExplanation}</p>
            <p className="mt-2 text-xs text-[#555]">
              Maturity: <span className="capitalize text-[#888]">{business.businessMaturity}</span>
            </p>
          </section>

          <section className="px-5 py-4">
            <SectionLabel icon={MessageCircle} label="Recommended contact" />
            <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${CONTACT_STYLES[business.bestContactMethod]}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {CONTACT_LABELS[business.bestContactMethod]}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#888]">{business.bestContactMethodReason}</p>
            <div className="mt-4 space-y-2.5">
              {channelRows.map((row) => (
                <ChannelBar key={row.key} label={row.label} value={row.value} isBest={row.key === business.bestContactMethod} />
              ))}
            </div>
          </section>

          <section className="px-5 py-4">
            <SectionLabel icon={AlertTriangle} label="Detected weaknesses" />
            <ul className="space-y-1.5">
              {business.weaknesses.map((w) => (
                <li key={w} className="rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-xs text-[#FAFAF9]">
                  {w}
                </li>
              ))}
            </ul>
          </section>

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
                <div key={item.label} className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-3 text-center">
                  <item.icon className="mx-auto h-3.5 w-3.5 text-[#555]" />
                  <p className="mt-1 text-[10px] text-[#555]">{item.label}</p>
                  <p className="text-sm font-bold text-[#FAFAF9]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="px-5 py-4">
            <SectionLabel icon={Target} label="Outreach intelligence" />
            <div className="space-y-4">
              {[
                { label: 'Opener', value: business.outreachOpener, style: 'text-[#FAFAF9]' },
                { label: 'Pain point', value: business.painPoint, style: 'text-[#888]' },
                { label: 'Service fit', value: business.serviceSuggestion, style: 'font-semibold text-orange-400' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{item.label}</p>
                  <p className={`mt-1 text-sm leading-relaxed ${item.style}`}>{item.value}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-[#888]">{business.outreachRecommendation}</p>
            </div>
          </section>

          <section className="px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-2">Suggested pitch</p>
            <p className="text-sm leading-relaxed text-[#888]">{business.suggestedServicePitch}</p>
            <p className="mt-3 border-l-2 border-[#4A90E2]/40 pl-3 text-sm font-medium italic text-[#888]">
              "{business.outreachAngle}"
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
