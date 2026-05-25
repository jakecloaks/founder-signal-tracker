import { useState, type FormEvent } from 'react'
import { Loader2, MapPin, Search, Briefcase } from 'lucide-react'
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
    <div className="border-b border-[#1c1c1c] bg-[#0d0d0d] px-4 py-3 sm:px-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Business niche — dentists, gyms…"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-[#1c1c1c] bg-[#111] py-2 pl-9 pr-3 text-sm text-[#ddd] placeholder:text-[#3a3a3a] focus:border-[#2a2a2a] focus:outline-none disabled:opacity-50"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Location — Utah, Miami…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-[#1c1c1c] bg-[#111] py-2 pl-9 pr-3 text-sm text-[#ddd] placeholder:text-[#3a3a3a] focus:border-[#2a2a2a] focus:outline-none disabled:opacity-50"
            />
          </div>
          <div className="relative flex-1">
            <Briefcase className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Your service — website redesign, SEO…"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-[#1c1c1c] bg-[#111] py-2 pl-9 pr-3 text-sm text-[#ddd] placeholder:text-[#3a3a3a] focus:border-[#2a2a2a] focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !industry.trim() || !location.trim()}
          className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <MapPin className="h-3.5 w-3.5" />
              Find opportunities
            </>
          )}
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
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
            className="rounded border border-[#1c1c1c] bg-transparent px-2 py-1 text-[11px] text-[#555] transition-colors hover:border-[#252525] hover:text-[#888] disabled:opacity-40"
          >
            {s.industry} in {s.location}
          </button>
        ))}
      </div>
    </div>
  )
}
