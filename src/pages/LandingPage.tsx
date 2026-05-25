import { Link } from 'react-router-dom'
import {
  Radar,
  Target,
  TrendingUp,
  ArrowRight,
  Radio,
  Briefcase,
  MessageCircle,
} from 'lucide-react'
import { Button } from '../components/Button'
import { searchBusinesses } from '../services/business'
import { useEffect, useState } from 'react'
import type { LocalBusiness } from '../types'

const features = [
  {
    icon: Radar,
    title: 'Local business recon',
    description: 'Enter a niche, city, and your service type. Get scored prospects ranked by fit — not just generic opportunity.',
  },
  {
    icon: Briefcase,
    title: 'Service-aware fit scoring',
    description: 'Each business is scored specifically against your service — website redesign, SEO, social media, and more.',
  },
  {
    icon: Target,
    title: 'AI outreach intelligence',
    description: 'Custom openers, pain points, and pitches tailored to each business and your specific service offering.',
  },
  {
    icon: TrendingUp,
    title: 'Best contact method',
    description: 'Know whether to DM on Instagram, call, or use the contact form — with channel visibility scores.',
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

function fitBadgeColor(score: number) {
  if (score >= 80) return 'bg-orange-500/15 text-orange-300 border-orange-500/25'
  if (score >= 65) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
  if (score >= 45) return 'bg-amber-500/15 text-amber-300 border-amber-500/25'
  return 'bg-zinc-800 text-zinc-400 border-zinc-700'
}

export function LandingPage() {
  const [previewBusinesses, setPreviewBusinesses] = useState<LocalBusiness[]>([])

  useEffect(() => {
    searchBusinesses('dentists', 'Utah', 'website redesign')
      .then((r) => setPreviewBusinesses(r.businesses.slice(0, 4)))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-[#1c1c1c] bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
              <Radar className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">SignalScope</span>
              <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-[#444]">Agency Intel</span>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary" className="!py-1.5 !px-4 !text-xs">
              Open app
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-glow px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-3.5 py-1.5 text-xs text-indigo-300">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
            AI-powered local business opportunity intelligence
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Find local businesses that need your service.{' '}
            <span className="text-[#888]">Before competitors do.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#666]">
            Enter a niche, location, and your service type. Get a ranked list of local businesses scored specifically on how much they need what you offer — with AI-generated outreach for each.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <Link to="/dashboard">
              <Button className="gap-2 px-6 py-2.5 text-sm font-semibold">
                Start prospecting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-[#444]">
              No account needed · Works without API keys
            </span>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#444]">
            <span>Agencies &amp; freelancers</span>
            <span className="h-3 w-px bg-[#222]" />
            <span>Service-aware fit scoring</span>
            <span className="h-3 w-px bg-[#222]" />
            <span>AI outreach intelligence</span>
            <span className="h-3 w-px bg-[#222]" />
            <span>Best contact method per business</span>
          </div>
        </div>
      </section>

      {/* Live preview panel */}
      <section className="border-t border-[#1c1c1c] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-xs font-medium text-[#555] uppercase tracking-widest">
              Live example — dentists in Utah · website redesign
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#0f0f0f]">
            {/* Fake toolbar */}
            <div className="flex items-center gap-1.5 border-b border-[#1c1c1c] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
              <span className="ml-3 text-[11px] text-[#333]">signalscope.app/dashboard · dentists in Utah · website redesign</span>
            </div>
            {/* Business rows */}
            <div className="divide-y divide-[#161616]">
              {previewBusinesses.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <div className="shimmer-bar h-8 w-8 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="shimmer-bar h-3 w-40 rounded" />
                        <div className="shimmer-bar h-2.5 w-64 rounded" />
                      </div>
                      <div className="shimmer-bar h-7 w-10 rounded-md" />
                    </div>
                  ))
                : previewBusinesses.map((b) => (
                    <div key={b.id} className="flex items-start gap-3 px-5 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#141414] text-xs font-bold text-[#888]">
                        {b.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#ddd]">{b.name}</p>
                        <p className="mt-0.5 text-xs text-[#555]">
                          {b.googleRating}★ · {b.reviewCount} reviews · {b.weaknesses[0] ?? b.industry}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-[#444]">{b.fitExplanation}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-sm font-bold tabular-nums ${fitBadgeColor(b.fitScore)}`}>
                          {b.fitScore}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium text-[#666] border-[#1c1c1c]`}>
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
      <section className="border-t border-[#1c1c1c] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-white">Built for outbound agency work</h2>
          <p className="mt-2 text-sm text-[#555]">
            Stop cold-searching LinkedIn. Find local businesses that actually need your service.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-[#1c1c1c] bg-[#111] p-5"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/15">
                  <f.icon className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-[#ccc]">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#555]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals */}
      <section className="border-t border-[#1c1c1c] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-white">Signals we detect</h2>
              <p className="mt-2 text-sm text-[#555]">
                Weaknesses that make a business a high-fit prospect for your specific service.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {signals.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2.5 rounded-md border border-[#1c1c1c] bg-[#111] px-3 py-2.5 text-xs text-[#888]"
                  >
                    <Radio className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#444]">
                Contact channel visibility scores
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Instagram DM', value: 78, color: 'bg-indigo-500' },
                  { label: 'Direct call', value: 64, color: 'bg-emerald-600' },
                  { label: 'Website form', value: 41, color: 'bg-amber-600' },
                  { label: 'Facebook', value: 28, color: 'bg-zinc-600' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs text-[#666]">{row.label}</span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
                      <div className={`h-full bar-fill rounded-full ${row.color}`} style={{ width: `${row.value}%` }} />
                    </div>
                    <span className="w-7 text-right text-xs tabular-nums text-[#555]">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[#444]">
                AI determines the best channel to reach each business based on presence, activity, and context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1c1c1c] px-6 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-white">Start finding high-fit prospects today</h2>
          <p className="mt-2 text-sm text-[#555]">
            Search any niche, any city, for any service. Pitch with confidence.
          </p>
          <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2">
            <Button className="gap-2 px-5 py-2.5 text-sm font-semibold">
              Open SignalScope
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#1c1c1c] px-6 py-6 text-xs text-[#333]">
        © {new Date().getFullYear()} SignalScope · AI-powered local business opportunity intelligence
      </footer>
    </div>
  )
}
