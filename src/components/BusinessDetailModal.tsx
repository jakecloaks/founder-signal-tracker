import {
  X, Globe, Instagram, Facebook,
  AlertTriangle, Phone, ExternalLink, MessageCircle,
  CheckCircle2, BarChart3, Minus, AlertCircle,
  DollarSign, Target, Zap, TrendingUp,
} from 'lucide-react'
import type { LocalBusiness, ContactMethod, ContactChannelVisibility, DifficultyToClose } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
import { SignalStrengthBar } from './SignalStrengthBar'
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

function SectionLabel({ icon: Icon, label }: { icon: typeof Zap; label: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">
      <Icon className="h-3.5 w-3.5" />{label}
    </h3>
  )
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  const color =
    value === 0 ? 'text-red-400' :
    value < 35  ? 'text-red-400' :
    value < 55  ? 'text-amber-400' :
    value < 75  ? 'text-[#4A90E2]' :
    'text-emerald-400'

  const bar =
    value === 0 ? 'bg-red-500' :
    value < 35  ? 'bg-red-500' :
    value < 55  ? 'bg-amber-500' :
    value < 75  ? 'bg-[#4A90E2]' :
    'bg-emerald-500'

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-3">
      <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}</span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
        <div className={`h-full bar-fill rounded-full ${bar}`} style={{ width: `${Math.max(value, 2)}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-[#555]">{label}</span>
    </div>
  )
}

function DifficultyBadge({ level }: { level: DifficultyToClose }) {
  const styles = {
    easy:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    medium: 'bg-amber-500/10   text-amber-400   border-amber-500/25',
    hard:   'bg-red-500/10     text-red-400     border-red-500/25',
  }
  const icons = {
    easy:   <CheckCircle2 className="h-3.5 w-3.5" />,
    medium: <Minus className="h-3.5 w-3.5" />,
    hard:   <AlertCircle className="h-3.5 w-3.5" />,
  }
  const desc = {
    easy:   'No website or very poor quality — the pitch is obvious. Lead with "you need a website" and show them what they\'re missing.',
    medium: 'Has a website but it\'s underperforming. Lead with conversion gaps, mobile issues, or specific SEO opportunities.',
    hard:   'Has a decent website. Needs a strong specific angle — focus on a measurable improvement, not just aesthetics.',
  }
  return (
    <div className={`rounded-lg border p-3 ${styles[level]}`}>
      <div className="flex items-center gap-2">
        {icons[level]}
        <span className="font-semibold capitalize">{level} to close</span>
      </div>
      <p className="mt-1.5 text-xs opacity-80">{desc[level]}</p>
    </div>
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] text-base font-bold text-[#888]">
              {business.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#FAFAF9] tracking-tight">{business.name}</h2>
              <p className="text-sm text-[#888]">{business.industry} · {business.location}</p>
              <p className="mt-0.5 text-xs text-[#555]">{business.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <DataSourceBadge source={business.dataSource} />
                <span className="text-[11px] text-[#555]">Updated {relativeTime(business.lastUpdated)}</span>
              </div>
            </div>
            {/* WOS badge */}
            <div className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2.5 ${
              business.websiteOpportunityScore >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 score-hot-glow' :
              business.websiteOpportunityScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30 accent-glow' :
              business.websiteOpportunityScore >= 45 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
              'bg-white/5 text-[#888] border-[#333]'
            }`}>
              <span className="text-2xl font-bold tabular-nums">{business.websiteOpportunityScore}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">WOS</span>
            </div>
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
                {business.websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                <Globe className="h-3 w-3" />No website
              </span>
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

          {/* ── 5 Website Scores ─────────────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={BarChart3} label="Website Opportunity Scores" />
            <div className="grid grid-cols-5 gap-2">
              <ScoreCell label="Website"  value={fp.websiteQualityScore} />
              <ScoreCell label="Mobile"   value={fp.mobileFriendlinessScore} />
              <ScoreCell label="Branding" value={fp.brandingScore} />
              <ScoreCell label="Social"   value={business.socialActivityScore} />
              <ScoreCell label="Lead opp" value={business.websiteOpportunityScore} />
            </div>
          </section>

          {/* ── Why they need a website ──────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={Globe} label="Why they need a new website" />
            <p className="text-sm leading-relaxed text-[#FAFAF9]">{business.whyTheyNeedWebsite}</p>
            <div className="mt-3">
              <DifficultyBadge level={business.difficultyToClose} />
            </div>
          </section>

          {/* ── Revenue impact ───────────────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={DollarSign} label="Potential revenue impact" />
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4">
              <TrendingUp className="h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-lg font-bold text-emerald-400">{business.revenueImpact}</p>
                <p className="mt-0.5 text-xs text-emerald-400/70">Estimated project value for your pipeline</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#888]">
              Based on industry averages for {business.industry.toLowerCase()} website projects. Actual project value depends on scope, custom features, and ongoing retainer structure.
            </p>
          </section>

          {/* ── Pitch angle ──────────────────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={Target} label="Suggested website pitch angle" />
            <div className="rounded-xl border border-[#4A90E2]/20 bg-[#4A90E2]/5 p-4">
              <p className="text-sm leading-relaxed text-[#FAFAF9]">{business.fitExplanation}</p>
            </div>
            <div className="mt-3 border-l-2 border-[#4A90E2]/40 pl-3">
              <p className="text-xs font-semibold text-[#888]">Outreach opener:</p>
              <p className="mt-1 text-xs leading-relaxed text-[#888] italic">"{business.outreachOpener}"</p>
            </div>
          </section>

          {/* ── Weaknesses ───────────────────────────────────────── */}
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

          {/* ── Contact recommendation ───────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={MessageCircle} label="Best way to reach them" />
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

          {/* ── Digital footprint detail ─────────────────────────── */}
          <section className="px-5 py-4">
            <SectionLabel icon={BarChart3} label="Full digital footprint" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SignalStrengthBar value={fp.digitalPresenceStrength} label="Overall presence" />
              <SignalStrengthBar value={fp.marketingMaturity} label="Marketing maturity" />
              <SignalStrengthBar value={fp.growthIntent} label="Growth intent" />
              <SignalStrengthBar value={fp.consistencyScore} label="Brand consistency" />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Globe,     label: 'Website',   value: fp.websiteExists ? `${fp.websiteQualityScore}/100` : 'None' },
                { icon: Instagram, label: 'Instagram', value: fp.instagramExists ? `${fp.instagramActivityScore}/100` : 'None' },
                { icon: Facebook,  label: 'Facebook',  value: fp.facebookExists ? `${fp.facebookActivityScore}/100` : 'None' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-3 text-center">
                  <item.icon className="mx-auto h-3.5 w-3.5 text-[#555]" />
                  <p className="mt-1 text-[10px] text-[#555]">{item.label}</p>
                  <p className="text-sm font-bold text-[#FAFAF9]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Outreach recommendation ──────────────────────────── */}
          <section className="px-5 py-5">
            <SectionLabel icon={Zap} label="Outreach playbook" />
            <div className="space-y-4">
              {[
                { label: 'Pain point to lead with', value: business.painPoint, style: 'text-[#FAFAF9]' },
                { label: 'Service to pitch', value: business.serviceSuggestion, style: 'font-semibold text-[#4A90E2]' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{item.label}</p>
                  <p className={`mt-1 text-sm leading-relaxed ${item.style}`}>{item.value}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-[#888]">{business.outreachRecommendation}</p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#888]">{business.suggestedServicePitch}</p>
          </section>

        </div>
      </div>
    </div>
  )
}
