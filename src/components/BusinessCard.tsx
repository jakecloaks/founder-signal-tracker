import { ArrowRight, Phone, Globe, CheckCircle2, Minus, AlertCircle } from 'lucide-react'
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

/* ── WOS score badge — clean, no glow ─────────────────────────── */
function WOSBadge({ score, compact = false }: { score: number; compact?: boolean }) {
  const [bg, fg, border] =
    score >= 80 ? ['bg-[#E07A45]/10', 'text-[#E07A45]', 'border-[#E07A45]/20'] :
    score >= 65 ? ['bg-[#4A8FE0]/10', 'text-[#4A8FE0]', 'border-[#4A8FE0]/20'] :
    score >= 45 ? ['bg-[#E8A520]/10', 'text-[#E8A520]', 'border-[#E8A520]/20'] :
    ['bg-[#1F1F30]',  'text-[#82829A]', 'border-[#1F1F30]']

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border ${bg} ${border} ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'}`}>
      <span className={`font-bold tabular-nums leading-none ${compact ? 'text-base' : 'text-lg'} ${fg}`}>{score}</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest opacity-50 text-current">WOS</span>
    </div>
  )
}

/* ── Inline 5-score strip (replaces vertical bar chart) ────────── */
function ScoreStrip({ business }: { business: LocalBusiness }) {
  const scores = [
    { label: 'Web',    value: business.footprint.websiteQualityScore },
    { label: 'Mobile', value: business.footprint.mobileFriendlinessScore },
    { label: 'Brand',  value: business.footprint.brandingScore },
    { label: 'Social', value: business.socialActivityScore },
    { label: 'Lead',   value: business.websiteOpportunityScore },
  ]

  function dot(v: number) {
    if (v === 0 || v < 30)  return 'bg-[#D95555]'
    if (v < 55)             return 'bg-[#E8A520]'
    if (v < 75)             return 'bg-[#4A8FE0]'
    return 'bg-[#3DCC6E]'
  }
  function numColor(v: number) {
    if (v === 0 || v < 30)  return 'text-[#D95555]'
    if (v < 55)             return 'text-[#E8A520]'
    if (v < 75)             return 'text-[#4A8FE0]'
    return 'text-[#3DCC6E]'
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1F1F30] bg-[#101015] px-3 py-2">
      {scores.map((s, i) => (
        <div key={s.label} className={`flex items-center gap-1.5 ${i < scores.length - 1 ? 'border-r border-[#1F1F30] pr-3' : ''}`}>
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot(s.value)}`} />
          <span className="text-[9px] text-[#424258] font-medium">{s.label}</span>
          <span className={`text-[11px] font-bold tabular-nums ${numColor(s.value)}`}>{s.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Difficulty badge ──────────────────────────────────────────── */
function DifficultyBadge({ level }: { level: DifficultyToClose }) {
  const [bg, fg] = level === 'easy'
    ? ['bg-[#3DCC6E]/8 border-[#3DCC6E]/20', 'text-[#3DCC6E]']
    : level === 'medium'
    ? ['bg-[#E8A520]/8 border-[#E8A520]/20', 'text-[#E8A520]']
    : ['bg-[#D95555]/8 border-[#D95555]/20', 'text-[#D95555]']

  const Icon = level === 'easy' ? CheckCircle2 : level === 'medium' ? Minus : AlertCircle
  const label = level === 'easy' ? 'Easy close' : level === 'medium' ? 'Medium' : 'Hard close'

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${bg} ${fg}`}>
      <Icon className="h-2.5 w-2.5" />{label}
    </span>
  )
}

/* ── Revenue tag ───────────────────────────────────────────────── */
function RevenueTag({ impact }: { impact: string }) {
  return (
    <span className="inline-flex items-center rounded border border-[#3DCC6E]/15 bg-[#3DCC6E]/7 px-1.5 py-0.5 text-[10px] font-semibold text-[#3DCC6E]">
      {impact}
    </span>
  )
}

/* ── Avatar ────────────────────────────────────────────────────── */
function Avatar({ business }: { business: LocalBusiness }) {
  const score = business.websiteOpportunityScore
  const [bg, fg, border] =
    score >= 80 ? ['bg-[#E07A45]/10', 'text-[#E07A45]', 'border-[#E07A45]/20'] :
    score >= 65 ? ['bg-[#4A8FE0]/10', 'text-[#4A8FE0]', 'border-[#4A8FE0]/20'] :
    ['bg-[#1F1F30]', 'text-[#82829A]', 'border-[#1F1F30]']
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${bg} ${fg} ${border}`}>
      {business.logo}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   List card
══════════════════════════════════════════════════════════════════ */
export function BusinessCard({
  business,
  onClick,
  listStyle,
  index = 0,
  liveFlash,
  savedLeadsHook,
}: BusinessCardProps) {
  const stagger = `stagger-${Math.min(4, (index % 4) + 1)}`

  if (listStyle) {
    return (
      <div
        className={`fade-in ${stagger} group cursor-pointer ${liveFlash ? 'live-flash' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div className="flex items-start gap-3.5 border-b border-[#1A1A28] px-5 py-4 transition-colors hover:bg-[#16161D] sm:px-6">
          {/* Avatar */}
          <div className="mt-0.5 shrink-0">
            <Avatar business={business} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Top row: name + WOS */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-semibold leading-snug text-[#EAEAF0]">{business.name}</span>
                <span className="ml-2 text-xs text-[#424258]">
                  {business.industry}
                  {business.distance && business.distance !== '—' ? ` · ${business.distance}` : ''}
                </span>
              </div>
              <div className="flex shrink-0 items-start gap-1.5">
                {savedLeadsHook && <SaveButton business={business} savedLeadsHook={savedLeadsHook} />}
                <WOSBadge score={business.websiteOpportunityScore} compact />
              </div>
            </div>

            {/* Meta: rating + phone + presence */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
              {business.phone && (
                <span className="flex items-center gap-0.5 text-[11px] text-[#424258]">
                  <Phone className="h-2.5 w-2.5" />{business.phone}
                </span>
              )}
              {business.footprint.websiteExists ? (
                <span className="flex items-center gap-0.5 text-[11px] text-[#3DCC6E]">
                  <Globe className="h-2.5 w-2.5" />has site
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#D95555]">
                  <Globe className="h-2.5 w-2.5" />no website
                </span>
              )}
              <PresenceChips footprint={business.footprint} />
              <DataSourceBadge source={business.dataSource} />
            </div>

            {/* Insight text */}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#82829A]">
              {business.whyTheyNeedWebsite}
            </p>

            {/* Score strip + tags */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <ScoreStrip business={business} />
              <div className="flex flex-wrap gap-1.5">
                <DifficultyBadge level={business.difficultyToClose} />
                <RevenueTag impact={business.revenueImpact} />
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#1F1F30] opacity-0 transition-all group-hover:opacity-100 group-hover:text-[#424258]" />
        </div>
      </div>
    )
  }

  /* ── Grid card ──────────────────────────────────────────────── */
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fade-in ${stagger} group w-full rounded-xl border border-[#1F1F30] bg-[#16161D] p-4 text-left card-lift ${liveFlash ? 'live-flash' : ''}`}
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar business={business} />
          <div>
            <p className="font-semibold leading-snug text-[#EAEAF0]">{business.name}</p>
            <p className="text-[11px] text-[#424258]">{business.industry} · {business.location}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-1.5">
          {savedLeadsHook && (
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <SaveButton business={business} savedLeadsHook={savedLeadsHook} />
            </div>
          )}
          <WOSBadge score={business.websiteOpportunityScore} compact />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <StarRating rating={business.googleRating} reviewCount={business.reviewCount} />
        {!business.footprint.websiteExists
          ? <span className="text-[11px] font-semibold text-[#D95555]">no website</span>
          : <span className="text-[11px] text-[#3DCC6E]">has site</span>}
        {business.distance && business.distance !== '—' && (
          <span className="text-[11px] text-[#888]">{business.distance}</span>
        )}
      </div>

      {/* Insight */}
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#82829A]">
        {business.whyTheyNeedWebsite}
      </p>

      {/* Scores */}
      <div className="mt-3">
        <ScoreStrip business={business} />
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <DifficultyBadge level={business.difficultyToClose} />
        <RevenueTag impact={business.revenueImpact} />
      </div>

      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#424258] opacity-0 transition-opacity group-hover:opacity-100">
        View full analysis <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}
