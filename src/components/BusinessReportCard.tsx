import {
  Globe, Smartphone, Zap, MousePointer, Phone,
  ImageIcon, Layers, Star, Activity, AlignLeft,
  Heart, TrendingUp, AlertTriangle, CheckCircle2,
  Minus, AlertCircle, MessageCircle, Instagram,
  Facebook, Mail, ExternalLink,
} from 'lucide-react'
import type { LocalBusiness, ContactMethod } from '../types'

/* ── Helpers ─────────────────────────────────────────────────────────── */
function clamp(n: number) {
  return Math.min(100, Math.max(0, Math.round(n)))
}

/** Deterministic variance from business ID + salt, returns -8..+8 */
function hv(id: string, salt: number): number {
  let h = salt * 0x9e3779b9
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x6d2b79f5)
  return ((h >>> 0) % 17) - 8
}

interface Grade { letter: 'A' | 'B' | 'C' | 'D' | 'F' | '—'; ring: string; text: string; bg: string }

function grade(score: number, na = false): Grade {
  if (na || score === 0) return { letter: '—', ring: 'border-[#2A2A2A]', text: 'text-[#555]', bg: 'bg-[#1A1A1A]' }
  if (score >= 80) return { letter: 'A', ring: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  if (score >= 65) return { letter: 'B', ring: 'border-[#4A90E2]/40',   text: 'text-[#4A90E2]',   bg: 'bg-[#4A90E2]/10' }
  if (score >= 50) return { letter: 'C', ring: 'border-amber-500/40',   text: 'text-amber-400',   bg: 'bg-amber-500/10' }
  if (score >= 35) return { letter: 'D', ring: 'border-orange-500/40',  text: 'text-orange-400',  bg: 'bg-orange-500/10' }
  return              { letter: 'F', ring: 'border-red-500/40',      text: 'text-red-400',    bg: 'bg-red-500/10' }
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 65) return 'bg-[#4A90E2]'
  if (score >= 50) return 'bg-amber-500'
  if (score >= 35) return 'bg-orange-500'
  return 'bg-red-500'
}

function insight(score: number, na: boolean, labels: [number, string][]): string {
  if (na) return 'No website'
  for (const [thresh, label] of [...labels].reverse()) {
    if (score >= thresh) return label
  }
  return labels[0][1]
}

/* ── Insight label maps ─────────────────────────────────────────────── */
const DESIGN_LABELS:  [number, string][] = [[0,'Very outdated'],[30,'Outdated layout'],[50,'Plain & generic'],[65,'Decent design'],[80,'Clean & modern'],[90,'Professional']]
const MOBILE_LABELS:  [number, string][] = [[0,'Not responsive'],[30,'Barely usable'],[50,'Poor UX on mobile'],[65,'Partially responsive'],[80,'Mobile-friendly'],[90,'Fully responsive']]
const SPEED_LABELS:   [number, string][] = [[0,'Likely very slow'],[30,'Slow (3+ sec)'],[50,'Average speed'],[65,'Acceptable'],[80,'Fast'],[90,'Very fast']]
const CTA_LABELS:     [number, string][] = [[0,'No CTAs found'],[30,'CTAs missing/buried'],[50,'Weak CTA copy'],[65,'Basic CTAs present'],[80,'Clear CTAs'],[90,'Strong conversion CTAs']]
const CONTACT_LABELS_MAP: [number, string][] = [[0,'No contact option'],[25,'Phone number only'],[40,'Contact form only'],[60,'Moderate ease'],[75,'Easy to contact'],[88,'Frictionless booking']]
const LOGO_LABELS:    [number, string][] = [[0,'No logo'],[25,'Generic or missing'],[40,'Outdated logo'],[55,'Basic logo'],[70,'Professional logo'],[85,'Strong brand mark']]
const BRAND_CON:      [number, string][] = [[0,'Very inconsistent'],[30,'Fragmented'],[50,'Partially consistent'],[65,'Mostly consistent'],[80,'Well-branded'],[90,'Highly consistent']]
const PROF_LABELS:    [number, string][] = [[0,'Unprofessional'],[30,'Below average'],[50,'Average appearance'],[65,'Decent presentation'],[80,'Professional'],[90,'Premium look']]
const ACTIVITY_LABELS:[number, string][] = [[0,'No presence'],[20,'Rarely posts'],[40,'Inconsistent'],[60,'Moderate activity'],[78,'Active'],[90,'Very active']]
const CONTENT_LABELS: [number, string][] = [[0,'No content strategy'],[20,'Sporadic posts'],[40,'Irregular posting'],[60,'Some consistency'],[78,'Regular content'],[90,'Consistent strategy']]
const ENGAGE_LABELS:  [number, string][] = [[0,'No engagement'],[20,'Minimal likes/shares'],[40,'Low engagement'],[60,'Moderate engagement'],[78,'Good engagement'],[90,'Strong engagement']]

/* ── Derive all sub-scores ──────────────────────────────────────────── */
function deriveSubScores(b: LocalBusiness) {
  const fp = b.footprint
  const id = b.id
  const hasWeb = fp.websiteExists
  const wq = fp.websiteQualityScore

  return {
    // Website
    designScore:    hasWeb ? wq : 0,
    mobileScore:    fp.mobileFriendlinessScore,
    loadingSpeed:   hasWeb ? clamp(wq * 0.65 + 20 + hv(id, 1)) : 0,
    ctaQuality:     hasWeb ? clamp(wq * 0.5 + 12 + (fp.brandingScore > 60 ? 8 : 0) + hv(id, 2)) : 0,
    contactEase:    hasWeb
      ? clamp(wq * 0.4 + (b.phone ? 22 : 0) + 10 + hv(id, 3))
      : b.phone ? clamp(22 + hv(id, 3)) : 5,
    // Brand
    logoQuality:     clamp(fp.brandingScore * 0.85 + hv(id, 4) * 1.2),
    brandConsistency: fp.consistencyScore,
    profAppearance:  hasWeb
      ? clamp((wq * 0.55 + fp.brandingScore * 0.45) + hv(id, 5))
      : clamp(fp.brandingScore * 0.5 + hv(id, 5)),
    // Social
    activityLevel:    b.socialActivityScore,
    contentConsist:   fp.instagramExists || fp.facebookExists
      ? clamp((fp.instagramExists && fp.facebookExists ? 12 : 0) + b.socialActivityScore * 0.75 + hv(id, 6))
      : 0,
    engagementEst:    fp.instagramExists || fp.facebookExists
      ? clamp(b.socialActivityScore * 0.8 + fp.reviewQualityScore * 0.15 + hv(id, 7))
      : 0,
  }
}

/* ── Derive opportunity reasons ─────────────────────────────────────── */
type Severity = 'critical' | 'warning' | 'info'
function deriveReasons(b: LocalBusiness, s: ReturnType<typeof deriveSubScores>): { text: string; sev: Severity }[] {
  const fp = b.footprint
  const out: { text: string; sev: Severity }[] = []
  if (!fp.websiteExists)                               out.push({ text: 'No website — invisible to Google searches',           sev: 'critical' })
  if (fp.websiteExists && s.mobileScore < 40)         out.push({ text: 'Site is not mobile-friendly',                         sev: 'critical' })
  if (fp.websiteExists && s.designScore < 40)         out.push({ text: 'Outdated or broken website design',                   sev: 'critical' })
  if (fp.websiteExists && s.ctaQuality < 35)          out.push({ text: 'No clear call-to-action for visitors',                sev: 'warning' })
  if (fp.websiteExists && s.loadingSpeed < 40)        out.push({ text: 'Site likely loads slowly — losing mobile visitors',   sev: 'warning' })
  if (fp.brandingScore < 40)                          out.push({ text: 'Inconsistent or dated visual branding',               sev: 'warning' })
  if (!fp.instagramExists && !fp.facebookExists)      out.push({ text: 'Zero social media presence',                         sev: 'warning' })
  if (b.googleRating >= 4.5 && fp.digitalPresenceStrength < 45) out.push({ text: `${b.reviewCount} reviews — online presence doesn't match`, sev: 'info' })
  if (b.difficultyToClose === 'easy')                 out.push({ text: 'Easy pitch — the gap is obvious',                    sev: 'info' })
  if (b.activeGrowth && !fp.websiteExists)            out.push({ text: 'Growing business, high urgency for a site',           sev: 'info' })
  return out.slice(0, 5)
}

/* ── Urgency ─────────────────────────────────────────────────────────── */
type Urgency = 'critical' | 'high' | 'medium' | 'low'
function urgency(score: number): Urgency {
  if (score >= 80) return 'critical'
  if (score >= 65) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}
const URGENCY_CONFIG: Record<Urgency, { label: string; style: string; icon: typeof AlertCircle }> = {
  critical: { label: 'Critical urgency',   style: 'bg-red-500/10 text-red-400 border-red-500/30',      icon: AlertCircle },
  high:     { label: 'High urgency',       style: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: AlertTriangle },
  medium:   { label: 'Medium urgency',     style: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Minus },
  low:      { label: 'Low urgency',        style: 'bg-white/5 text-[#888] border-[#2A2A2A]',           icon: CheckCircle2 },
}

/* ── Contact method config ───────────────────────────────────────────── */
const CONTACT_METHOD_ICONS: Record<ContactMethod, typeof Phone> = {
  phone: Phone, instagram: Instagram, facebook: Facebook,
  website_form: Globe, email: Mail,
}
const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  phone: 'Direct Call', instagram: 'Instagram DM', facebook: 'Facebook Message',
  website_form: 'Website Form', email: 'Email',
}
const CONTACT_METHOD_STYLES: Record<ContactMethod, string> = {
  phone:        'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  instagram:    'text-pink-400 border-pink-500/30 bg-pink-500/10',
  facebook:     'text-blue-400 border-blue-500/30 bg-blue-500/10',
  website_form: 'text-[#4A90E2] border-[#4A90E2]/30 bg-[#4A90E2]/10',
  email:        'text-[#4A90E2] border-[#4A90E2]/30 bg-[#4A90E2]/10',
}

/* ── Conversation starter ────────────────────────────────────────────── */
function conversationStarter(b: LocalBusiness, s: ReturnType<typeof deriveSubScores>): string {
  const name = b.name
  const rating = b.googleRating
  const reviews = b.reviewCount
  const fp = b.footprint

  if (!fp.websiteExists)
    return `"I noticed ${name} doesn't have a website yet — with your ${rating}★ rating and ${reviews}+ reviews, you're likely missing new clients every single day on Google."`
  if (s.mobileScore < 40)
    return `"I pulled up ${name}'s website on my phone and noticed it's not loading well on mobile — that's where most of your new customers are searching right now."`
  if (s.designScore < 45)
    return `"I came across ${name}'s website and noticed it looks like it hasn't been refreshed in a while — your ${rating}★ reviews tell a better story than the site does."`
  if (s.ctaQuality < 40)
    return `"I was on ${name}'s site and couldn't easily find how to book or contact you — that's likely costing you leads every week."`
  return `"I checked out ${name} online and noticed a few things that could be losing you new clients — worth a 10-minute call to share what I found?"`
}

/* ── Sub-components ──────────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, label }: { icon: typeof Globe; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2A2A2A]">
        <Icon className="h-3 w-3 text-[#888]" />
      </div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#555]">{label}</h3>
    </div>
  )
}

interface MetricRowProps {
  icon: typeof Globe
  label: string
  score: number
  labelMap: [number, string][]
  na?: boolean
}

function MetricRow({ icon: Icon, label, score, labelMap, na = false }: MetricRowProps) {
  const g = grade(score, na)
  const naDisplay = na && score === 0
  const insightText = naDisplay ? 'No website' : insight(score, false, labelMap)

  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-[#111] px-3 py-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#555]" />
      <span className="w-28 shrink-0 text-xs text-[#888]">{label}</span>
      {/* Grade badge */}
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[9px] font-black ${g.ring} ${g.text} ${g.bg}`}>
        {g.letter}
      </span>
      {/* Bar */}
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2A2A2A]">
        {!naDisplay && (
          <div
            className={`h-full bar-fill rounded-full ${barColor(score)}`}
            style={{ width: `${Math.max(score, 2)}%` }}
          />
        )}
      </div>
      {/* Score number */}
      <span className={`w-8 text-right text-[11px] font-bold tabular-nums ${naDisplay ? 'text-[#555]' : g.text}`}>
        {naDisplay ? 'N/A' : score}
      </span>
      {/* Insight chip */}
      <span className={`hidden w-32 truncate text-right text-[10px] font-medium sm:block ${naDisplay ? 'text-[#555]' : g.text}`}>
        {insightText}
      </span>
    </div>
  )
}

function SeverityDot({ sev }: { sev: Severity }) {
  const styles: Record<Severity, string> = {
    critical: 'bg-red-500',
    warning:  'bg-amber-500',
    info:     'bg-[#4A90E2]',
  }
  return <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles[sev]}`} />
}

/* ── Main Report Card ────────────────────────────────────────────────── */
export function BusinessReportCard({ business }: { business: LocalBusiness }) {
  const b = business
  const fp = b.footprint
  const hasWeb = fp.websiteExists
  const s = deriveSubScores(b)
  const reasons = deriveReasons(b, s)
  const urg = urgency(b.websiteOpportunityScore)
  const urgCfg = URGENCY_CONFIG[urg]
  const UrgIcon = urgCfg.icon
  const starter = conversationStarter(b, s)
  const ContactIcon = CONTACT_METHOD_ICONS[b.bestContactMethod]

  return (
    <div className="divide-y divide-[#1E1E1E]">

      {/* ── 1. Website Analysis ─────────────────────────────── */}
      <section className="px-5 py-4">
        <SectionHeader icon={Globe} label="Website Analysis" />
        <div className="space-y-1.5">
          <MetricRow icon={Globe}         label="Design quality"  score={s.designScore}  labelMap={DESIGN_LABELS}   na={!hasWeb} />
          <MetricRow icon={Smartphone}    label="Mobile"          score={s.mobileScore}  labelMap={MOBILE_LABELS}   na={!hasWeb} />
          <MetricRow icon={Zap}           label="Loading speed"   score={s.loadingSpeed} labelMap={SPEED_LABELS}    na={!hasWeb} />
          <MetricRow icon={MousePointer}  label="CTA quality"     score={s.ctaQuality}   labelMap={CTA_LABELS}      na={!hasWeb} />
          <MetricRow icon={Phone}         label="Contact ease"    score={s.contactEase}  labelMap={CONTACT_LABELS_MAP} />
        </div>
        {!hasWeb && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
            <p className="text-xs text-red-400">No website exists — all website metrics scored as N/A. This is your pitch.</p>
          </div>
        )}
      </section>

      {/* ── 2. Brand + Social side by side ──────────────────── */}
      <section className="grid gap-0 sm:grid-cols-2">

        {/* Brand Analysis */}
        <div className="px-5 py-4 sm:border-r sm:border-[#1E1E1E]">
          <SectionHeader icon={Layers} label="Brand Analysis" />
          <div className="space-y-1.5">
            <MetricRow icon={ImageIcon}   label="Logo quality"     score={s.logoQuality}     labelMap={LOGO_LABELS}  />
            <MetricRow icon={Layers}      label="Consistency"      score={s.brandConsistency} labelMap={BRAND_CON}   />
            <MetricRow icon={Star}        label="Professionalism"  score={s.profAppearance}  labelMap={PROF_LABELS}  />
          </div>
        </div>

        {/* Social Presence */}
        <div className="px-5 py-4">
          <SectionHeader icon={Activity} label="Social Presence" />
          {(!fp.instagramExists && !fp.facebookExists) ? (
            <div className="flex items-start gap-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-3 mt-1">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-amber-400">No social media</p>
                <p className="mt-0.5 text-[11px] text-[#888]">No Instagram or Facebook detected. Mention this as a missed discovery channel.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <MetricRow icon={Activity}  label="Activity level"  score={s.activityLevel}  labelMap={ACTIVITY_LABELS} />
              <MetricRow icon={AlignLeft} label="Content consist" score={s.contentConsist} labelMap={CONTENT_LABELS}  />
              <MetricRow icon={Heart}     label="Engagement est." score={s.engagementEst}  labelMap={ENGAGE_LABELS}   />
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {fp.instagramExists && (
              <span className="flex items-center gap-1 rounded border border-pink-500/20 bg-pink-500/8 px-1.5 py-0.5 text-[10px] font-semibold text-pink-400">
                <Instagram className="h-2.5 w-2.5" />IG active
              </span>
            )}
            {fp.facebookExists && (
              <span className="flex items-center gap-1 rounded border border-blue-500/20 bg-blue-500/8 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
                <Facebook className="h-2.5 w-2.5" />FB active
              </span>
            )}
            {!fp.instagramExists && (
              <span className="flex items-center gap-1 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-1.5 py-0.5 text-[10px] text-[#555]">
                No Instagram
              </span>
            )}
            {!fp.facebookExists && (
              <span className="flex items-center gap-1 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-1.5 py-0.5 text-[10px] text-[#555]">
                No Facebook
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Business Opportunity Analysis ────────────────── */}
      <section className="px-5 py-4">
        <SectionHeader icon={TrendingUp} label="Business Opportunity Analysis" />
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Score block */}
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${
            urg === 'critical' ? 'border-red-500/30 bg-red-500/8' :
            urg === 'high'     ? 'border-orange-500/30 bg-orange-500/8' :
            urg === 'medium'   ? 'border-amber-500/30 bg-amber-500/8' :
            'border-[#2A2A2A] bg-[#1A1A1A]'
          }`}>
            <div className="text-center">
              <div className={`text-4xl font-black tabular-nums ${
                urg === 'critical' ? 'text-red-400' :
                urg === 'high'     ? 'text-orange-400' :
                urg === 'medium'   ? 'text-amber-400' : 'text-[#888]'
              }`}>{b.websiteOpportunityScore}</div>
              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#555]">WOS / 100</div>
            </div>
            <div>
              <div className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-bold ${urgCfg.style}`}>
                <UrgIcon className="h-3 w-3" />
                {urgCfg.label}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#888]">
                {urg === 'critical' ? 'Act fast — obvious need, easy pitch.' :
                 urg === 'high'     ? 'Strong opportunity — reach out this week.' :
                 urg === 'medium'   ? 'Worth outreach — specific angle needed.' :
                                     'Lower priority — harder sell.'}
              </p>
              <div className="mt-2 text-[11px] font-semibold text-emerald-400">{b.revenueImpact}</div>
            </div>
          </div>

          {/* Reasons list */}
          <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">Why they need a redesign</p>
            <ul className="space-y-2">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <SeverityDot sev={r.sev} />
                  <span className="text-xs leading-relaxed text-[#FAFAF9]">{r.text}</span>
                </li>
              ))}
              {reasons.length === 0 && (
                <li className="text-xs text-[#555]">No critical gaps detected. Hard sell — position as upgrade.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Difficulty strip */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
          {(['easy', 'medium', 'hard'] as const).map((lvl) => {
            const active = b.difficultyToClose === lvl
            const styles = {
              easy:   active ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-[#2A2A2A] bg-[#111] text-[#555]',
              medium: active ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-[#2A2A2A] bg-[#111] text-[#555]',
              hard:   active ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-[#2A2A2A] bg-[#111] text-[#555]',
            }
            const icons = { easy: CheckCircle2, medium: Minus, hard: AlertCircle }
            const Icon = icons[lvl]
            return (
              <div key={lvl} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 font-semibold ${styles[lvl]}`}>
                {active && <Icon className="h-3 w-3" />}
                <span className="capitalize">{lvl} close</span>
                {active && <span className="text-[9px]">◀</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. Recommended Outreach ──────────────────────────── */}
      <section className="px-5 py-4">
        <SectionHeader icon={MessageCircle} label="Recommended Outreach" />
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Contact method */}
          <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">Best contact method</p>
            <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${CONTACT_METHOD_STYLES[b.bestContactMethod]}`}>
              <ContactIcon className="h-4 w-4" />
              {CONTACT_METHOD_LABELS[b.bestContactMethod]}
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[#888]">{b.bestContactMethodReason}</p>
            {/* Channel visibility bars */}
            <div className="mt-3 space-y-2">
              {(
                [
                  { key: 'phone' as ContactMethod, label: 'Phone', val: b.contactChannelVisibility.phone },
                  { key: 'instagram' as ContactMethod, label: 'Instagram', val: b.contactChannelVisibility.instagram },
                  { key: 'website_form' as ContactMethod, label: 'Website form', val: b.contactChannelVisibility.website_form },
                  { key: 'facebook' as ContactMethod, label: 'Facebook', val: b.contactChannelVisibility.facebook },
                  { key: 'email' as ContactMethod, label: 'Email', val: b.contactChannelVisibility.email },
                ] as { key: ContactMethod; label: string; val: number }[]
              )
                .filter(r => r.val > 0)
                .sort((a, b) => b.val - a.val)
                .slice(0, 3)
                .map((row) => (
                  <div key={row.key} className="flex items-center gap-2">
                    <span className={`w-20 shrink-0 text-[10px] ${row.key === b.bestContactMethod ? 'font-bold text-[#FAFAF9]' : 'text-[#555]'}`}>
                      {row.label}
                      {row.key === b.bestContactMethod && ' ★'}
                    </span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2A2A2A]">
                      <div
                        className={`h-full bar-fill rounded-full ${row.key === b.bestContactMethod ? 'bg-[#4A90E2]' : 'bg-[#333]'}`}
                        style={{ width: `${row.val}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-[10px] tabular-nums text-[#555]">{row.val}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Conversation starter */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-[#4A90E2]/20 bg-[#4A90E2]/5 p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#4A90E2]">Suggested conversation starter</p>
              <p className="text-sm leading-relaxed text-[#FAFAF9] italic">{starter}</p>
            </div>
            {b.websiteUrl ? (
              <a
                href={b.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-xs font-semibold text-[#888] transition-colors hover:border-[#333] hover:text-[#FAFAF9]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit their site before reaching out
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs font-semibold text-red-400">
                <Globe className="h-3.5 w-3.5" />
                No website — lead with this in your pitch
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
