import { Link } from 'react-router-dom'
import {
  Target, TrendingUp, ArrowRight, Radio,
  Briefcase, MessageCircle, Check, Star, Zap, Building2,
} from 'lucide-react'
import { SignalScopeLogo, SignalIcon } from '../components/SignalScopeLogo'
import { searchBusinesses } from '../services/business'
import { useEffect, useState } from 'react'
import type { LocalBusiness } from '../types'

const features = [
  {
    icon: Radio,
    title: 'Local business recon',
    description: 'Enter a niche, city, and your service. Get prospects ranked by service fit — not generic signals.',
  },
  {
    icon: Briefcase,
    title: 'Service-aware fit scoring',
    description: 'Each business is scored specifically for your offering. Website redesign, SEO, social — all different scores.',
  },
  {
    icon: Target,
    title: 'AI outreach intelligence',
    description: 'Custom openers, pain points, and pitches tailored to each business and your service.',
  },
  {
    icon: TrendingUp,
    title: 'Best contact method',
    description: 'Channel visibility scores tell you whether to call, DM on Instagram, or use the contact form.',
  },
]

const signals = [
  'No website detected',
  'Weak Instagram activity',
  'High reviews, weak branding',
  'Under-optimized digital presence',
  'Missing booking system',
  'Inconsistent social channels',
]

const testimonials = [
  {
    quote: "Found 4 website clients in the first week. The fit scoring actually works.",
    name: "Jordan K.",
    role: "Web design freelancer",
    stars: 5,
  },
  {
    quote: "Way better than cold-searching LinkedIn. Actual signal, not noise.",
    name: "Sarah M.",
    role: "Agency owner, 6 clients",
    stars: 5,
  },
  {
    quote: "The outreach angle it generates is surprisingly specific. Clients respond to it.",
    name: "Chris D.",
    role: "SEO consultant",
    stars: 5,
  },
]

const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For freelancers starting out',
    searches: '20 searches/month',
    highlighted: false,
    features: ['20 searches/month', 'Full business profiles', 'AI fit scoring', 'Saved leads (50)'],
    cta: 'Start free trial',
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For agencies actively prospecting',
    searches: 'Unlimited searches',
    highlighted: true,
    features: ['Unlimited searches', 'Full AI insights', 'Contact channel scoring', 'Lead exports (CSV)', 'Saved leads (unlimited)', 'Collections & notes'],
    cta: 'Start free trial',
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For growing teams',
    searches: 'Unlimited everything',
    highlighted: false,
    features: ['Everything in Pro', 'Up to 5 team members', 'Bulk analysis mode', 'Advanced filters', 'White-label reports'],
    cta: 'Start free trial',
  },
]

function fitBadgeClass(score: number) {
  if (score >= 80) return 'bg-orange-500/15 text-orange-400 border-orange-500/25'
  if (score >= 65) return 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25'
  if (score >= 45) return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
  return 'bg-white/5 text-[#888] border-[#2A2A2A]'
}

export function LandingPage() {
  const [previewBusinesses, setPreviewBusinesses] = useState<LocalBusiness[]>([])

  useEffect(() => {
    searchBusinesses('dentists', 'Utah', 'website redesign')
      .then((r) => setPreviewBusinesses(r.businesses.slice(0, 4)))
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FAFAF9]">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-[#1E1E1E] bg-[#0D0D0D]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <SignalScopeLogo size="md" />
          <div className="hidden items-center gap-8 sm:flex">
            <a href="#features" className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-[#888] hover:text-[#FAFAF9] transition-colors">Pricing</a>
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
            AI-powered intelligence
          </div>
          <h1 className="heading-display text-[#FAFAF9]">
            Find local businesses<br />ready to close
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#888]">
            AI-powered opportunity intelligence that analyzes online presence, branding quality, and business signals to identify your best prospects.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <button type="button" className="flex items-center gap-2 rounded-lg bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3D7CC9]">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button type="button" className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-[#FAFAF9] transition-all hover:bg-[#222] hover:border-[#333]">
                Watch Demo
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-[#555]">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4A90E2]" />No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4A90E2]" />Service-aware scoring</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4A90E2]" />AI outreach per business</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4A90E2]" />Best contact method</span>
          </div>
        </div>
      </section>

      {/* Live demo panel */}
      <section className="border-y border-[#1E1E1E] bg-[#111] px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555]">
              Live example — dentists in Utah · website redesign
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111]" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            {/* Fake toolbar */}
            <div className="flex items-center gap-2 border-b border-[#1E1E1E] bg-[#0D0D0D] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
              <span className="ml-3 text-[11px] font-medium text-[#555]">
                signalscope.app/dashboard · dentists in Utah · website redesign
              </span>
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
                      <div className="shimmer-bar h-7 w-10 rounded-lg" />
                    </div>
                  ))
                : previewBusinesses.map((b) => (
                    <div key={b.id} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[#141414]">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                        b.fitScore >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
                        b.fitScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
                        'bg-white/5 text-[#888] border-[#2A2A2A]'
                      }`}>
                        {b.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#FAFAF9]">{b.name}</p>
                        <p className="mt-0.5 text-xs text-[#888]">{b.googleRating}★ · {b.reviewCount} reviews · {b.industry}</p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-[#555]">{b.fitExplanation}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={`inline-flex min-w-[2.2rem] items-center justify-center rounded-lg border px-2 py-0.5 text-sm font-bold tabular-nums ${fitBadgeClass(b.fitScore)}`}>
                          {b.fitScore}
                        </span>
                        <span className="flex items-center gap-1 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-1.5 py-0.5 text-[10px] font-medium text-[#888]">
                          <MessageCircle className="h-2.5 w-2.5" />
                          {b.bestContactMethod?.replace('_', ' ') ?? 'phone'}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-1 text-[#FAFAF9]">Built for outbound agency work</h2>
            <p className="mt-3 text-sm text-[#888] max-w-lg mx-auto">
              Stop cold-searching directories. Find businesses that actually match your service.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 transition-colors hover:border-[#333] hover:bg-[#1E1E1E]">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#4A90E2]/20 bg-[#4A90E2]/10">
                  <f.icon className="h-4 w-4 text-[#4A90E2]" />
                </div>
                <h3 className="text-sm font-bold text-[#FAFAF9]">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#888]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals + Channel chart */}
      <section className="border-y border-[#1E1E1E] bg-[#111] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-2 text-[#FAFAF9]">Signals we detect</h2>
              <p className="mt-2 text-sm text-[#888] max-w-sm">
                Weaknesses that make a business a strong fit for your specific service.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {signals.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2.5 text-xs font-medium text-[#888]">
                    <SignalIcon size={14} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#555]">
                Contact channel visibility scoring
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Instagram DM', value: 78, isBest: true },
                  { label: 'Direct call', value: 64, isBest: false },
                  { label: 'Website form', value: 41, isBest: false },
                  { label: 'Facebook', value: 28, isBest: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className={`w-28 shrink-0 text-xs ${row.isBest ? 'font-semibold text-[#FAFAF9]' : 'text-[#888]'}`}>
                      {row.label}
                      {row.isBest && (
                        <span className="ml-1 rounded border border-[#4A90E2]/25 bg-[#4A90E2]/10 px-1 text-[9px] font-bold text-[#4A90E2]">
                          Best
                        </span>
                      )}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2A2A2A]">
                      <div
                        className={`h-full bar-fill rounded-full ${row.isBest ? 'bg-[#4A90E2]' : 'bg-[#333]'}`}
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-xs tabular-nums text-[#555]">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[#555] leading-relaxed">
                AI determines the best channel to reach each business based on their presence, activity score, and engagement patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-[#FAFAF9] tracking-tight">What agencies are saying</h2>
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
      <section id="pricing" className="border-y border-[#1E1E1E] bg-[#111] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-1 text-[#FAFAF9]">Simple, outcome-based pricing</h2>
            <p className="mt-3 text-sm text-[#888]">Priced around the value of finding one good client.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border ${
                  plan.highlighted
                    ? 'border-[#4A90E2]/40 bg-[#4A90E2]/5'
                    : 'border-[#2A2A2A] bg-[#1A1A1A]'
                }`}
              >
                {plan.highlighted && (
                  <div className="border-b border-[#4A90E2]/20 bg-[#4A90E2]/10 px-5 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#4A90E2]">
                    Most popular
                  </div>
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
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4A90E2]" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <button
                      type="button"
                      className={`mt-5 w-full rounded-lg py-2.5 text-sm font-bold transition-all ${
                        plan.highlighted
                          ? 'bg-[#4A90E2] text-white hover:bg-[#3D7CC9]'
                          : 'bg-[#1E1E1E] text-[#FAFAF9] hover:bg-[#252525] border border-[#2A2A2A]'
                      }`}
                    >
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
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4A90E2]/10 border border-[#4A90E2]/20">
            <Building2 className="h-8 w-8 text-[#4A90E2]" />
          </div>
          <h2 className="mt-5 heading-1 text-[#FAFAF9]">Start finding high-fit prospects today</h2>
          <p className="mt-3 text-sm text-[#888]">Search any niche, any city, for any service. Pitch with confidence.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <button type="button" className="flex items-center gap-2 rounded-lg bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3D7CC9]">
                <Zap className="h-4 w-4" />
                Open SignalScope free
              </button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-[#888] hover:text-[#FAFAF9] transition-colors">
              View pricing →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1E1E1E] px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <SignalScopeLogo size="sm" />
          <p className="text-xs text-[#555]">
            © {new Date().getFullYear()} SignalScope · AI-powered agency prospecting
          </p>
        </div>
      </footer>
    </div>
  )
}
