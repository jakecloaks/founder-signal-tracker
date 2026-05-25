import { useState, type FormEvent } from 'react'
import { Loader2, MapPin, Search, Briefcase } from 'lucide-react'
import { Button } from './Button'
import { SUGGESTED_SEARCHES } from '../services/business'

interface LocalBusinessSearchProps {
  onSearch: (industry: string, location: string, serviceType: string) => void
  loading?: boolean
  initialIndustry?: string
  initialLocation?: string
  initialServiceType?: string
}

export function LocalBusinessSearch({
  onSearch,
  loading,
  initialIndustry = 'dentists',
  initialLocation = 'Utah',
  initialServiceType = 'website redesign',
}: LocalBusinessSearchProps) {
  const [industry, setIndustry] = useState(initialIndustry)
  const [location, setLocation] = useState(initialLocation)
  const [serviceType, setServiceType] = useState(initialServiceType)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!industry.trim() || !location.trim() || loading) return
    onSearch(industry.trim(), location.trim(), serviceType.trim())
  }

  return (
    <div className="border-b border-zinc-800 bg-gradient-to-r from-indigo-500/5 to-transparent px-4 py-4 sm:px-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Business niche (dentists, gyms…)"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-60"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Location (Utah, Miami, London…)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-60"
            />
          </div>
          <div className="relative flex-1">
            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Your service (website redesign, SEO…)"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-60"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !industry.trim() || !location.trim()} className="shrink-0">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Find opportunities
            </>
          )}
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_SEARCHES.map((s) => (
          <button
            key={`${s.industry}-${s.location}`}
            type="button"
            disabled={loading}
            onClick={() => {
              setIndustry(s.industry)
              setLocation(s.location)
              setServiceType(s.service)
              onSearch(s.industry, s.location, s.service)
            }}
            className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-indigo-500/40 hover:text-indigo-300 disabled:opacity-50"
          >
            {s.industry} in {s.location}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        AI-powered local business opportunity finder — fit scored against your service type on every result.
      </p>
    </div>
  )
}
