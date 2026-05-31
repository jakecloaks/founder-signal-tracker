import { Link } from 'react-router-dom'
import {
  ArrowRight, Globe, CheckCircle2, Star, Zap, Building2,
  Smartphone, Palette, BarChart3, Target, TrendingUp,
} from 'lucide-react'
import { SignalScopeLogo, SignalIcon } from '../components/SignalScopeLogo'
import { searchBusinesses } from '../services/business'
import { useEffect, useState } from 'react'
import type { LocalBusiness } from '../types'

const TARGET_INDUSTRIES = [
  { name: 'Dentists', icon: '🦷', avg: '$5,000–$10,000' },
  { name: 'HVAC',     icon: '❄️', avg: '$2,500–$6,000'  },
  { name: 'Roofers',  icon: '🏠', avg: '$2,500–$5,000'  },
  { name: 'Plumbers', icon: '🔧', avg: '$2,500–$5,000'  },
  { name: 'Chiropractors', icon: '🩺', avg: '$4,000–$8,000' },
  { name: 'Landscaping',   icon: '🌿', avg: '$2,000–$4,500' },
  { name: 'Pest Control',  icon: '🛡️', avg: '$2,000–$4,000' },
  { name: 'Med Spas',      icon: '✨', avg: '$6,000–$15,000' },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Pick an industry and city',
    description: 'Select one of the 8 target niches — dentists, HVAC, roofers, plumbers, chiropractors, landscaping, pest control, or med spas — and enter any city.',
  },
  {
    step: '2',
    title: 'Get scored leads instantly',
    description: 'Every business is scored across 5 website-specific signals: website quality, mobile friendliness, branding, social activity, and lead opportunity.',
  },
  {
    step: '3',
    title: 'Pitch with confidence',
    description: 'Each lead includes why they need a new site, the revenue impact, your pitch angle, and how difficult they are to close.',
  },
]

const SCORES = [
  { icon: Globe,      label: 'Website Quality',   description: 'Quality of their current site (or zero if they have none)' },
  { icon: Smartphone, label: 'Mobile Friendliness', description: 'Whether their site works on the phones their customers use' },
  { icon: Palette,    label: 'Branding Score',    description: 'Visual consistency and professionalism across their presence' },
  { icon: BarChart3,  label: 'Social Activity',   description: 'How active they are on Instagram and Facebook' },
  { icon: Target,     label: 'Lead Opportunity',  description: 'Overall website redesign opportunity score (0–100)' },
]

const testimonials = [
  {
    quote: "Closed a $7,200 dentist website in my first week. The 'no website' filter alone is worth it.",
    name: "Matt R.",
    role: "Web designer, solo",
    stars: 5,
  },
  {
    quote: "We target HVAC and roofing. SignalScope shows us exactly who to call and what to say.",
    name: "Lauren H.",
    role: "Website agency, 6 clients",
    stars: 5,
  },
  {
    quote: "The pitch angle it generates is scarily specific. Our close rate went up noticeably.",
    name: "Chris D.",
    role: "Freelance web designer",
    stars: 5,
  },
]

const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For freelancers',
    searches: '20 searches/month',
    highlighted: false,
    features: ['20 searches/month', 'All 8 target industries', 'Full 5-score analysis', 'Pitch angle per business', 'Saved leads (50)'],
    cta: 'Start free trial',
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For active agencies',
    searches: 'Unlimited searches',
    highlighted: true,
    features: ['Unlimited searches', 'All 8 industries, all cities', 'Revenue impact estimates', 'Difficulty-to-close scoring', 'Saved leads (unlimited)', 'Collections & notes', 'Lead exports (CSV)'],
    cta: 'Start free trial',
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For growing teams',
    searches: 'Everything in Pro',
    highlighted: false,
    features: ['Everything in Pro', 'Up to 5 team members', 'Bulk export', 'White-label reports', 'Dedicated support'],
    cta: 'Start free trial',
  },
]

function WOSBadge({ score }: { score: number }) {
  const style =
    score >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
    score >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
    score >= 45 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
    'bg-white/5 text-[#888] border-[#333]'
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border px-2.5 py-1.5 ${style}`}>
      <span className="text-lg font-bold tabular-nums leading-none">{score}</span>
      <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">WOS</span>
    </div>
  )
}

export function LandingPage() {
  const [previewBusinesses, setPreviewBusinesses] = useState<LocalBusiness[]>([])

  useEffect(() => {
    searchBusinesses('dentists', 'Salt Lake City, UT', 'website redesign')
      .then((r) => setPreviewBusinesses(r.businesses.slice(0, 4)))
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FAFAF9]">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-[#1E1E1E] bg-[#0D0D0D]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <SignalScopeLogo size="md" />
          <div className="hidden items-center gap-8 sm:flex">
            <a href="#how-it-works" className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">How it works</a>
            <a href="#industries"   className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">Industries</a>
            <a href="#pricing"      className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">Pricing</a>
            <Link to="/auth" className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">Sign in</Link>
          </div>
          <Link to="/auth">
            <button type="button" className="rounded-lg bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#3D7CC9]">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-glow px-6 pb-20 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-1.5 text-xs font-medium text-[#888]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#4A90E2]" />
            Built for web designers and website agencies
          </div>
          <h1 className="heading-display text-[#FAFAF9]">
            Find local businesses<br />that need a new website
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#888]">
            Stop cold-guessing. SignalScope scores every local business on 5 website signals and tells you exactly why they need a redesign, what to pitch, and how hard they are to close.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <button type="button" className="flex items-center gap-2 rounded-lg bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3D7CC9]">
                Start finding leads
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button type="button" className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-[#FAFAF9] transition-all hover:bg-[#222] hover:border-[#333]">
                See a demo search
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-[#555]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#4A90E2]" />No credit card needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#4A90E2]" />8 target industries</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#4A90E2]" />Revenue impact per lead</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#4A90E2]" />Difficulty to close score</span>
          </div>
        </div>
      </section>

      {/* Live preview */}
      <section className="border-y border-[#1E1E1E] bg-[#111] px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555]">
              Live example — Dentists in Salt Lake City, UT · website redesign
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111]" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center gap-2 border-b border-[#1E1E1E] bg-[#0D0D0D] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="ml-3 text-[11px] font-medium text-[#555]">signalscope.app/dashboard · Dentists · Salt Lake City · website redesign</span>
            </div>
            <div className="divide-y divide-[#1E1E1E]">
              {previewBusinesses.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <div className="shimmer-bar h-9 w-9 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="shimmer-bar h-3.5 w-40 rounded" />
                        <div className="shimmer-bar h-3 w-64 rounded" />
                        <div className="shimmer-bar h-3 w-5/6 rounded" />
                      </div>
                      <div className="shimmer-bar h-10 w-12 rounded-lg" />
                    </div>
                  ))
                : previewBusinesses.map((b) => (
                    <div key={b.id} className="flex items-start gap-3 px-5 py-4 hover:bg-[#141414] transition-colors">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                        b.websiteOpportunityScore >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
                        b.websiteOpportunityScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
                        'bg-white/5 text-[#888] border-[#2A2A2A]'
                      }`}>
                        {b.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-[#FAFAF9]">{b.name}</p>
                            <p className="mt-0.5 text-xs text-[#888]">{b.googleRating}★ · {b.reviewCount} reviews · {b.industry}</p>
                          </div>
                          <WOSBadge score={b.websiteOpportunityScore} />
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[11px] text-[#555]">{b.whyTheyNeedWebsite}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                          {!b.footprint.websiteExists
                            ? <span className="font-semibold text-red-400">No website</span>
                            : <span className="text-emerald-500">Site: {b.footprint.websiteQualityScore}/100</span>
                          }
                          <span className="text-[#555]">Mobile: {b.footprint.mobileFriendlinessScore}/100</span>
                          <span className="text-[#555]">Brand: {b.footprint.brandingScore}/100</span>
                          <span className="font-semibold text-emerald-400">{b.revenueImpact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-1 text-[#FAFAF9]">Find your next website client in 60 seconds</h2>
            <p className="mt-3 text-sm text-[#888] max-w-md mx-auto">
              A tool built specifically for web designers selling to local service businesses.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#4A90E2]/30 bg-[#4A90E2]/10 text-sm font-bold text-[#4A90E2]">
                  {step.step}
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#FAFAF9]">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#888]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 scores */}
      <section className="border-y border-[#1E1E1E] bg-[#111] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-2 text-[#FAFAF9]">5 website signals per business</h2>
              <p className="mt-2 text-sm text-[#888] max-w-sm">
                Each business is scored on the exact signals that determine whether a web redesign pitch will land.
              </p>
              <ul className="mt-6 space-y-3">
                {SCORES.map((s) => (
                  <li key={s.label} className="flex items-start gap-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4A90E2]/10 border border-[#4A90E2]/20">
                      <s.icon className="h-3.5 w-3.5 text-[#4A90E2]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#FAFAF9]">{s.label}</p>
                      <p className="mt-0.5 text-[11px] text-[#888]">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#555]">Per-lead analysis includes</p>
              <div className="space-y-3">
                {[
                  { icon: Globe,       label: 'Why they need a new website',   color: 'text-red-400',     desc: 'Specific reasoning tied to their situation' },
                  { icon: TrendingUp,  label: 'Revenue impact estimate',       color: 'text-emerald-400', desc: 'Project value range for your pipeline' },
                  { icon: Target,      label: 'Suggested pitch angle',         color: 'text-[#4A90E2]',   desc: 'Tailored to their industry and pain point' },
                  { icon: Zap,         label: 'Difficulty to close',           color: 'text-amber-400',   desc: 'Easy, medium, or hard — with reasoning' },
                  { icon: SignalIcon,  label: 'Best contact channel',          color: 'text-[#FAFAF9]',   desc: 'Phone, IG DM, form, or email — ranked' },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 rounded-lg border border-[#2A2A2A] bg-[#111] px-3 py-2.5">
                    <row.icon className={`mt-0.5 h-4 w-4 shrink-0 ${row.color}`} />
                    <div>
                      <p className={`text-xs font-semibold ${row.color}`}>{row.label}</p>
                      <p className="text-[11px] text-[#555]">{row.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-1 text-[#FAFAF9]">8 high-value local niches</h2>
            <p className="mt-3 text-sm text-[#888] max-w-md mx-auto">
              Chosen because they have high website budgets, consistent demand, and are systematically underserved online.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TARGET_INDUSTRIES.map((ind) => (
              <Link to="/dashboard" key={ind.name}>
                <div className="group flex flex-col items-center rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 text-center transition-colors hover:border-[#4A90E2]/30 hover:bg-[#1E1E1E]">
                  <span className="text-3xl">{ind.icon}</span>
                  <p className="mt-2 font-bold text-[#FAFAF9]">{ind.name}</p>
                  <p className="mt-1 text-xs text-emerald-400 font-semibold">{ind.avg}</p>
                  <p className="mt-0.5 text-[10px] text-[#555]">avg project value</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-[#1E1E1E] bg-[#111] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-[#FAFAF9] tracking-tight">Used by freelancers and website agencies</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#888]">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4A90E2]/15 border border-[#4A90E2]/25 text-xs font-bold text-[#4A90E2]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FAFAF9]">{t.name}</p>
                    <p className="text-[10px] text-[#555]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-1 text-[#FAFAF9]">Simple pricing</h2>
            <p className="mt-3 text-sm text-[#888]">One good lead pays for the tool. No contracts.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative overflow-hidden rounded-2xl border ${plan.highlighted ? 'border-[#4A90E2]/40 bg-[#4A90E2]/5' : 'border-[#2A2A2A] bg-[#1A1A1A]'}`}>
                {plan.highlighted && (
                  <div className="border-b border-[#4A90E2]/20 bg-[#4A90E2]/10 px-5 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#4A90E2]">Most popular</div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-[#FAFAF9]">{plan.name}</h3>
                  <p className="mt-0.5 text-xs text-[#888]">{plan.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-[#FAFAF9]">${plan.price}</span>
                    <span className="mb-1 text-sm text-[#555]">/mo</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#4A90E2]">{plan.searches}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[#888]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4A90E2]" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <button type="button" className={`mt-5 w-full rounded-lg py-2.5 text-sm font-bold transition-all ${plan.highlighted ? 'bg-[#4A90E2] text-white hover:bg-[#3D7CC9]' : 'bg-[#1E1E1E] text-[#FAFAF9] hover:bg-[#252525] border border-[#2A2A2A]'}`}>
                      {plan.cta}
                    </button>
                  </Link>
                  <p className="mt-2 text-center text-[10px] text-[#555]">7-day free trial · No credit card</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1E1E1E] bg-[#111] px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4A90E2]/10 border border-[#4A90E2]/20">
            <Building2 className="h-8 w-8 text-[#4A90E2]" />
          </div>
          <h2 className="mt-5 heading-1 text-[#FAFAF9]">Your next website client is already out there</h2>
          <p className="mt-3 text-sm text-[#888]">Search any niche, any city. Know exactly who to call and what to say.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <button type="button" className="flex items-center gap-2 rounded-lg bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3D7CC9]">
                <Zap className="h-4 w-4" />Start finding leads free
              </button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-[#888] hover:text-[#FAFAF9] transition-colors">View pricing →</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1E1E1E] px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <SignalScopeLogo size="sm" />
          <p className="text-xs text-[#555]">© {new Date().getFullYear()} SignalScope · Website redesign leads for web designers</p>
        </div>
      </footer>
    </div>
  )
}
