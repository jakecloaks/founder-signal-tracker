import { ArrowRight, Phone, Globe, AlertCircle, CheckCircle2, Minus } from 'lucide-react'
import type { LocalBusiness, DifficultyToClose } from '../types'
import { PresenceChips } from './PresenceChips'
import { StarRating } from './StarRating'
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

/* ── Score mini-bar ──────────────────────────────────────────────────── */
function ScorePip({ value, label }: { value: number; label: string }) {
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
    <div className="flex flex-col items-center gap-1" title={`${label}: ${value}/100`}>
      <div className="h-8 w-1.5 overflow-hidden rounded-full bg-[#2A2A2A] flex flex-col justify-end">
        <div
          className={`w-full rounded-full transition-all ${bar}`}
          style={{ height: `${Math.max(value, 3)}%` }}
        />
      </div>
      <span className={`text-[9px] font-bold tabular-nums leading-none ${color}`}>
        {value}
      </span>
      <span className="text-[8px] text-[#555] leading-none text-center" style={{ fontSize: '7.5px' }}>
        {label}
      </span>
    </div>
  )
}

/* ── 5-score mini panel ──────────────────────────────────────────────── */
function ScorePanel({ business }: { business: LocalBusiness }) {
  const scores = [
    { label: 'Website', value: business.footprint.websiteQualityScore },
    { label: 'Mobile',  value: business.footprint.mobileFriendlinessScore },
    { label: 'Brand',   value: business.footprint.brandingScore },
    { label: 'Social',  value: business.socialActivityScore },
    { label: 'Lead',    value: business.websiteOpportunityScore },
  ]
  return (
    <div className="flex items-end gap-2 rounded-lg border border-[#2A2A2A] bg-[#111] px-3 py-2">
      {scores.map((s) => (
        <ScorePip key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  )
}

/* ── Difficulty badge ────────────────────────────────────────────────── */
function DifficultyBadge({ level }: { level: DifficultyToClose }) {
  const styles = {
    easy:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    medium: 'bg-amber-500/10   text-amber-400   border-amber-500/25',
    hard:   'bg-red-500/10     text-red-400     border-red-500/25',
  }
  const icons = {
    easy:   <CheckCircle2 className="h-2.5 w-2.5" />,
    medium: <Minus className="h-2.5 w-2.5" />,
    hard:   <AlertCircle className="h-2.5 w-2.5" />,
  }
  const labels = { easy: 'Easy close', medium: 'Med', hard: 'Hard close' }

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${styles[level]}`}>
      {icons[level]}{labels[level]}
    </span>
  )
}

/* ── Website opportunity score ring ──────────────────────────────────── */
function WOSBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
    score >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
    score >= 45 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
    'bg-white/5 text-[#888] border-[#333]'

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border px-2.5 py-1.5 ${style} ${score >= 80 ? 'score-hot-glow' : ''}`}>
      <span className="text-lg font-bold tabular-nums leading-none">{score}</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider opacity-60">WOS</span>
    </div>
  )
}

/* ── Revenue tag ─────────────────────────────────────────────────────── */
function RevenueTag({ impact }: { impact: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/8 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
      {impact}
    </span>
  )
}

/* ── List card ───────────────────────────────────────────────────────── */
export function BusinessCard({
  business,
  onClick,
  listStyle,
  index = 0,
  liveFlash,
  savedLeadsHook,
}: BusinessCardProps) {
  const stagger = `stagger-${Math.min(4, (index % 4) + 1)}`
  const hot = business.websiteOpportunityScore >= 80
  const noSite = !business.footprint.websiteExists

  if (listStyle) {
    return (
      <div
        className={`fade-in ${stagger} group relative cursor-pointer ${liveFlash ? 'live-flash' : ''} ${
          hot ? 'border-l-2 border-l-orange-500' : noSite ? 'border-l-2 border-l-red-500/50' : 'border-l-2 border-l-transparent'
        }`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div className="flex items-start gap-3 border-b border-[#1E1E1E] px-4 py-4 transition-colors hover:bg-[#141414] sm:px-5">
          {/* Avatar */}
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
            hot ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
            business.websiteOpportunityScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
            'bg-white/5 text-[#888] border-[#2A2A2A]'
          }`}>
            {business.logo}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + score */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold text-[#FAFAF9]">{business.name}</span>
                <span className="ml-2 text-xs text-[#555]">{business.industry}</span>
              </div>
              <div className="flex shrink-0 items-start gap-1.5">
                {savedLeadsHook && <SaveButton business={business} savedLeadsHook={savedLeadsHook} />}
                <WOSBadge score={business.websiteOpportunityScore} />
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
              {business.phone && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#555]">
                  <Phone className="h-2.5 w-2.5" />{business.phone}
                </span>
              )}
              {business.footprint.websiteExists ? (
                <span className="flex items-center gap-0.5 text-[11px] text-emerald-500">
                  <Globe className="h-2.5 w-2.5" />has site
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-red-400">
                  <Globe className="h-2.5 w-2.5" />no website
                </span>
              )}
              <PresenceChips footprint={business.footprint} />
              <DataSourceBadge source={business.dataSource} />
            </div>

            {/* Why they need a site */}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#888]">
              {business.whyTheyNeedWebsite}
            </p>

            {/* 5-score panel + tags */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <ScorePanel business={business} />
              <div className="flex flex-wrap gap-1.5">
                <DifficultyBadge level={business.difficultyToClose} />
                <RevenueTag impact={business.revenueImpact} />
              </div>
            </div>
          </div>

          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#2A2A2A] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[#555]" />
        </div>
      </div>
    )
  }

  /* Grid card */
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fade-in ${stagger} group w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-left card-lift ${
        liveFlash ? 'live-flash' : ''
      } ${hot ? 'border-l-2 border-l-orange-500' : noSite ? 'border-l-2 border-l-red-500/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
            hot ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
            business.websiteOpportunityScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
            'bg-white/5 text-[#888] border-[#2A2A2A]'
          }`}>
            {business.logo}
          </div>
          <div>
            <p className="font-semibold text-[#FAFAF9] leading-snug">{business.name}</p>
            <p className="text-[11px] text-[#555]">{business.industry} · {business.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 shrink-0">
          {savedLeadsHook && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
            </div>
          )}
          <WOSBadge score={business.websiteOpportunityScore} />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        {noSite ? (
          <span className="text-[11px] font-semibold text-red-400">no website</span>
        ) : (
          <span className="text-[11px] text-emerald-500">has site</span>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#888]">
        {business.whyTheyNeedWebsite}
      </p>

      {/* 5 scores */}
      <div className="mt-3">
        <ScorePanel business={business} />
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <DifficultyBadge level={business.difficultyToClose} />
        <RevenueTag impact={business.revenueImpact} />
      </div>

      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#555] opacity-0 transition-opacity group-hover:opacity-100">
        View full analysis <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}
