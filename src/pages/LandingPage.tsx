import { Link } from 'react-router-dom'
import {
  Radar,
  Target,
  TrendingUp,
  ArrowRight,
  Radio,
  Briefcase,
  MessageCircle,
  Check,
  Star,
  Zap,
  Building2,
} from 'lucide-react'
import { Button } from '../components/Button'
import { searchBusinesses } from '../services/business'
import { useEffect, useState } from 'react'
import type { LocalBusiness } from '../types'

const features = [
  {
    icon: Radar,
    title: 'Local business recon',
    description: 'Enter a niche, city, and your service type. Get prospects ranked by service fit — not generic signals.',
  },
  {
    icon: Briefcase,
    title: 'Service-aware fit scoring',
    description: 'Each business is scored specifically against your offering. Website redesign, SEO, social — all different scores.',
  },
  {
    icon: Target,
    title: 'AI outreach intelligence',
    description: 'Custom openers, pain points, and pitches tailored to each business and your specific service.',
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
    features: ['20 searches/month', 'Full business profiles', 'AI fit scoring', 'Saved leads (50)'],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For agencies actively prospecting',
    searches: 'Unlimited searches',
    features: [
      'Unlimited searches',
      'Full AI insights',
      'Contact channel scoring',
      'Lead exports (CSV)',
      'Saved leads (unlimited)',
      'Collections & notes',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For growing teams',
    searches: 'Unlimited everything',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Bulk analysis mode',
      'Advanced filters',
      'White-label reports',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
]

function fitBadgeClass(score: number) {
  if (score >= 80) return 'bg-orange-50 text-orange-700 border-orange-200'
  if (score >= 65) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  if (score >= 45) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-stone-100 text-stone-500 border-stone-200'
}

export function LandingPage() {
  const [previewBusinesses, setPreviewBusinesses] = useState<LocalBusiness[]>([])

  useEffect(() => {
    searchBusinesses('dentists', 'Utah', 'website redesign')
      .then((r) => setPreviewBusinesses(r.businesses.slice(0, 4)))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 shadow-sm">
              <Radar className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-stone-900">SignalScope</span>
            <span className="hidden rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 sm:inline">
              Agency Intel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link to="/auth">
              <Button size="sm" className="shadow-sm">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-glow px-6 pb-16 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-indigo-500" />
            5 free searches — no credit card needed
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Find local businesses that<br />
            <span className="text-indigo-600">need your service.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-500">
            Search by niche, location, and what you sell. Get a scored list of local businesses ranked by how much they need your specific service — with AI outreach for each one.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <Button className="gap-2 px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all">
                Start finding prospects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
              Create free account →
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Service-aware scoring</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> AI outreach per business</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Best contact method</span>
          </div>
        </div>
      </section>

      {/* Live demo panel */}
      <section className="border-y border-stone-100 bg-stone-50 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              Live example — dentists in Utah · website redesign
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
            {/* Fake toolbar */}
            <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-[11px] font-medium text-stone-400">
                signalscope.app/dashboard · dentists in Utah · website redesign
              </span>
            </div>
            <div className="divide-y divide-stone-100">
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
                    <div key={b.id} className="flex items-start gap-3 px-5 py-4 hover:bg-stone-50 transition-colors">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                        b.fitScore >= 80 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        b.fitScore >= 65 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {b.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-900">{b.name}</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {b.googleRating}★ · {b.reviewCount} reviews · {b.industry}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-stone-400">{b.fitExplanation}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={`inline-flex min-w-[2.2rem] items-center justify-center rounded-lg border px-2 py-0.5 text-sm font-bold tabular-nums ${fitBadgeClass(b.fitScore)}`}>
                          {b.fitScore}
                        </span>
                        <span className="flex items-center gap-1 rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-medium text-stone-500">
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
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
              Built for outbound agency work
            </h2>
            <p className="mt-3 text-sm text-stone-500 max-w-lg mx-auto">
              Stop cold-searching directories. Find businesses that actually match your service.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50">
                  <f.icon className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals + Channel chart */}
      <section className="border-y border-stone-100 bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900">Signals we detect</h2>
              <p className="mt-2 text-sm text-stone-500 max-w-sm">
                Weaknesses that make a business a strong fit for your specific service.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {signals.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 shadow-sm"
                  >
                    <Radio className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Contact channel visibility scoring
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Instagram DM', value: 78, color: 'bg-pink-500', best: true },
                  { label: 'Direct call', value: 64, color: 'bg-emerald-500', best: false },
                  { label: 'Website form', value: 41, color: 'bg-amber-500', best: false },
                  { label: 'Facebook', value: 28, color: 'bg-stone-300', best: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className={`w-28 shrink-0 text-xs ${row.best ? 'font-semibold text-stone-800' : 'text-stone-500'}`}>
                      {row.label}
                      {row.best && (
                        <span className="ml-1 rounded border border-emerald-200 bg-emerald-50 px-1 text-[9px] font-bold text-emerald-700">
                          Best
                        </span>
                      )}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                      <div className={`h-full rounded-full bar-fill ${row.color}`} style={{ width: `${row.value}%` }} />
                    </div>
                    <span className="w-7 text-right text-xs tabular-nums text-stone-400">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-stone-400 leading-relaxed">
                AI determines the best channel to reach each business based on their presence, activity score, and engagement patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-extrabold text-stone-900">What agencies are saying</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{t.name}</p>
                    <p className="text-[10px] text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-stone-100 bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">Simple, outcome-based pricing</h2>
            <p className="mt-3 text-sm text-stone-500">Priced around the value of finding one good client.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border bg-white ${
                  plan.highlighted
                    ? 'border-indigo-300 shadow-xl shadow-indigo-500/10'
                    : 'border-stone-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-indigo-600 px-5 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-white">
                    Most popular
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-stone-900">{plan.name}</h3>
                  <p className="mt-0.5 text-xs text-stone-500">{plan.description}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-stone-900">${plan.price}</span>
                    <span className="mb-1 text-sm text-stone-400">/mo</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-indigo-600">{plan.searches}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-stone-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <button
                      type="button"
                      className={`mt-5 w-full rounded-lg py-2.5 text-sm font-bold transition-all ${
                        plan.highlighted
                          ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm hover:shadow-md'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                  <p className="mt-2 text-center text-[10px] text-stone-400">7-day free trial · No credit card</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-stone-900">
            Start finding high-fit prospects today
          </h2>
          <p className="mt-3 text-sm text-stone-500">
            Search any niche, any city, for any service. Pitch with confidence.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <Button className="gap-2 px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all">
                <Zap className="h-4 w-4" />
                Open SignalScope free
              </Button>
            </Link>
            <a href="#pricing" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
              View pricing →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Radar className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-stone-600">SignalScope</span>
          </div>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} SignalScope · AI-powered agency prospecting
          </p>
        </div>
      </footer>
    </div>
  )
}
