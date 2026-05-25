import { Link } from 'react-router-dom'
import {
  Sparkles,
  Radar,
  Target,
  TrendingUp,
  ArrowRight,
  Building2,
  Radio,
  Briefcase,
} from 'lucide-react'
import { Button } from '../components/Button'
import { searchBusinesses } from '../services/business'
import { useEffect, useState } from 'react'
import type { LocalBusiness } from '../types'

const features = [
  {
    icon: Radar,
    title: 'Local business recon',
    description: 'Enter a niche, city, and your service type. Get scored prospects ranked by fit — not just opportunity.',
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
    description: 'Know whether to DM on Instagram, call, or use the contact form — with reasoning for every recommendation.',
  },
]

const exampleSignals = [
  'No website detected',
  'Weak Instagram activity',
  'High reviews, weak branding',
  'Under-optimized digital presence',
  'Missing booking system',
  'Inconsistent social channels',
]

export function LandingPage() {
  const [previewBusinesses, setPreviewBusinesses] = useState<LocalBusiness[]>([])

  useEffect(() => {
    searchBusinesses('dentists', 'Utah', 'website redesign').then((r) => setPreviewBusinesses(r.businesses.slice(0, 3)))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="glass sticky top-0 z-30 border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-100">LocalIQ</span>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary" className="!py-2 !px-4 text-xs">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <section className="hero-glow relative overflow-hidden px-6 pb-24 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
            AI-powered local business opportunity intelligence
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">
              Find Local Businesses That Need Your Service Before Competitors Do.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Enter a niche, location, and your service type. Get a ranked list of local businesses scored specifically on how much they need what you offer.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button className="gap-2 px-8 py-3 text-base">
                Start Finding Prospects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
            <span>Built for agencies & freelancers</span>
            <span className="hidden sm:inline">·</span>
            <span>Service-aware fit scoring</span>
            <span className="hidden sm:inline">·</span>
            <span>AI outreach intelligence</span>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Built for agencies targeting local SMBs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500">
            Find businesses that are a strong fit for your specific service — not just anyone with weak digital presence.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-hover rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <f.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-zinc-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 bg-zinc-900/20 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Opportunity signals we detect</h2>
              <p className="mt-3 text-zinc-500">
                Surface weaknesses that make a business a high-fit prospect for your specific service.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {exampleSignals.map((signal) => (
                  <li
                    key={signal}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300"
                  >
                    <Radio className="h-4 w-4 shrink-0 text-indigo-400" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Live fit scoring example — dentists · website redesign
              </p>
              <div className="space-y-3">
                {previewBusinesses.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{row.name}</p>
                      <p className="text-xs text-zinc-500">{row.weaknesses[0] ?? row.outreachAngle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-sm font-semibold text-orange-400">
                        {row.fitScore}
                      </span>
                      <span className="text-[10px] text-zinc-600">fit score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Dashboard preview
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500">
            Maps-style results, fit scores, and AI outreach — built for agency prospecting.
          </p>
          <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-2xl shadow-indigo-500/5">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <span className="ml-2 text-xs text-zinc-600">localiq.app/dashboard · dentists in Utah · website redesign</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {previewBusinesses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm font-medium text-zinc-200">{c.name}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{c.fitScore}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{c.googleRating}★ · {c.reviewCount} reviews</p>
                  <p className="mt-1 text-xs text-indigo-400/80 capitalize">{c.bestContactMethod?.replace('_', ' ') ?? 'phone'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Start finding high-fit prospects today
          </h2>
          <p className="mt-4 text-zinc-500">
            Search any niche, any city, for any service — pitch with confidence.
          </p>
          <Link to="/dashboard" className="mt-8 inline-block">
            <Button className="gap-2 px-8 py-3 text-base">
              Find Prospects Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} LocalIQ. AI-powered local business opportunity intelligence.
      </footer>
    </div>
  )
}
