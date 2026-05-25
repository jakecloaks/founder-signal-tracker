import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Flame, Target, Radar } from 'lucide-react'
import {
  DEFAULT_SEARCH,
  searchBusinesses,
} from '../services/business'
import type { BusinessDataSource } from '../types'
import { filterBusinesses } from '../utils/businessFilters'
import {
  buildFeedFromBusinesses,
  tickLiveIntelligence,
  injectLiveOpportunity,
} from '../utils/liveIntelligence'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { LocalBusinessSearch } from '../components/LocalBusinessSearch'
import { BusinessFiltersBar } from '../components/BusinessFiltersBar'
import { BusinessCard } from '../components/BusinessCard'
import { BusinessCardSkeleton } from '../components/BusinessCardSkeleton'
import { BusinessDetailModal } from '../components/BusinessDetailModal'
import { MapsResultsPanel } from '../components/MapsResultsPanel'
import { HotLeadsFeed } from '../components/HotLeadsFeed'
import type { BusinessFilterKey, BusinessFilters, LocalBusiness } from '../types'

export function DashboardPage() {
  const [industry, setIndustry] = useState(DEFAULT_SEARCH.industry)
  const [location, setLocation] = useState(DEFAULT_SEARCH.location)
  const [serviceType, setServiceType] = useState(DEFAULT_SEARCH.serviceType)
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([])
  const [dataSource, setDataSource] = useState<BusinessDataSource>('mock')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<BusinessFilters>({ active: 'all' })
  const [selected, setSelected] = useState<LocalBusiness | null>(null)
  const [scanning, setScanning] = useState(false)
  const [listView, setListView] = useState(true)
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  const runSearch = useCallback(async (ind: string, loc: string, svc: string) => {
    setScanning(true)
    setIndustry(ind)
    setLocation(loc)
    setServiceType(svc)
    try {
      const result = await searchBusinesses(ind, loc, svc)
      setBusinesses(result.businesses)
      setDataSource(result.source)
    } finally {
      setScanning(false)
    }
  }, [])

  useEffect(() => {
    if (!initialized) {
      runSearch(DEFAULT_SEARCH.industry, DEFAULT_SEARCH.location, DEFAULT_SEARCH.serviceType)
      setInitialized(true)
    }
  }, [initialized, runSearch])

  useEffect(() => {
    const interval = setInterval(() => {
      setBusinesses((prev) => {
        let next = tickLiveIntelligence(prev)
        const injected = injectLiveOpportunity(next, industry, location, serviceType)
        if (injected) {
          next = [injected, ...next]
          setFlashIds((ids) => new Set(ids).add(injected.id))
          setTimeout(() => {
            setFlashIds((ids) => {
              const n = new Set(ids)
              n.delete(injected.id)
              return n
            })
          }, 800)
        }
        return next
      })
    }, 14000)
    return () => clearInterval(interval)
  }, [industry, location, serviceType])

  const filtered = useMemo(
    () => filterBusinesses(businesses, filters, search),
    [businesses, filters, search]
  )

  const feedEvents = useMemo(() => buildFeedFromBusinesses(businesses), [businesses])

  const stats = useMemo(() => {
    const hot = businesses.filter((b) => b.fitScore >= 70).length
    const avg = businesses.length
      ? Math.round(businesses.reduce((s, b) => s + b.fitScore, 0) / businesses.length)
      : 0
    return { total: businesses.length, hot, avg }
  }, [businesses])

  const topOutreach = useMemo(
    () =>
      [...businesses]
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, 4)
        .map((b) => ({
          id: b.id,
          name: b.name,
          angle: b.outreachAngle,
          fitScore: b.fitScore,
          contactMethod: b.bestContactMethod,
          business: b,
        })),
    [businesses]
  )

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center gap-2 border-b border-[#1c1c1c] px-4 py-3 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Radar className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">SignalScope</span>
          <Link to="/" className="ml-auto text-xs text-[#444] hover:text-[#888]">
            Home
          </Link>
        </div>

        <TopBar
          search={search}
          onSearchChange={setSearch}
          minIntent={0}
          onMinIntentChange={() => {}}
          searchPlaceholder="Filter results by business name…"
          hideIntentFilter
        />

        <LocalBusinessSearch
          onSearch={runSearch}
          loading={scanning}
          initialIndustry={industry}
          initialLocation={location}
          initialServiceType={serviceType}
        />

        <main className="flex-1 overflow-auto">
          {/* Compact stats strip */}
          {!scanning && businesses.length > 0 && (
            <div className="flex items-center gap-0 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-2.5 border-r border-[#1c1c1c] px-5 py-3">
                <Building2 className="h-3.5 w-3.5 text-[#444]" />
                <span className="text-xs text-[#555]">Scanned</span>
                <span className="text-sm font-bold tabular-nums text-[#ccc]">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2.5 border-r border-[#1c1c1c] px-5 py-3">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs text-[#555]">High fit ≥70</span>
                <span className="text-sm font-bold tabular-nums text-orange-400">{stats.hot}</span>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-3">
                <Target className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs text-[#555]">Avg fit</span>
                <span className="text-sm font-bold tabular-nums text-indigo-300">{stats.avg}</span>
              </div>
            </div>
          )}

          <div className="grid xl:grid-cols-3">
            {/* Main results panel */}
            <div className="min-w-0 xl:col-span-2 xl:border-r xl:border-[#1c1c1c]">
              {/* Toolbar */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#1c1c1c] bg-[#0a0a0a] px-4 py-2 sm:px-5">
                <BusinessFiltersBar
                  filters={filters}
                  onChange={(key: BusinessFilterKey) => setFilters({ active: key })}
                />
                <div className="flex shrink-0 rounded-md border border-[#1c1c1c] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setListView(true)}
                    className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                      listView
                        ? 'bg-indigo-500/15 text-indigo-300'
                        : 'text-[#555] hover:text-[#999]'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setListView(false)}
                    className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                      !listView
                        ? 'bg-indigo-500/15 text-indigo-300'
                        : 'text-[#555] hover:text-[#999]'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>

              {/* Results info */}
              {!scanning && businesses.length > 0 && (
                <div className="px-4 py-2 sm:px-5">
                  <MapsResultsPanel
                    industry={industry}
                    location={location}
                    serviceType={serviceType}
                    count={filtered.length}
                    dataSource={dataSource}
                  />
                </div>
              )}

              {/* Results */}
              {scanning ? (
                <div className="divide-y divide-[#161616]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 sm:px-5">
                      <BusinessCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-5 py-16 text-center text-sm text-[#444]">
                  No businesses match your filters.
                </div>
              ) : listView ? (
                <div>
                  {filtered.map((business, i) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      listStyle
                      index={i}
                      liveFlash={flashIds.has(business.id)}
                      onClick={() => setSelected(business)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  {filtered.map((business, i) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      index={i}
                      liveFlash={flashIds.has(business.id)}
                      onClick={() => setSelected(business)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="hidden p-4 xl:block xl:space-y-4">
              <HotLeadsFeed events={feedEvents} title="Live opportunity feed" />

              {topOutreach.length > 0 && (
                <div className="rounded-lg border border-[#1c1c1c] bg-[#111] overflow-hidden">
                  <div className="border-b border-[#161616] px-4 py-2.5">
                    <h3 className="text-xs font-semibold text-[#aaa]">Top outreach targets</h3>
                  </div>
                  <div className="divide-y divide-[#161616]">
                    {topOutreach.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.business)}
                        className="w-full px-4 py-3 text-left transition-colors hover:bg-[#141414]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#ccc] truncate">{item.name}</span>
                          <span className="shrink-0 text-xs font-bold tabular-nums text-orange-400">{item.fitScore}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#555]">{item.angle}</p>
                        <p className="mt-1 text-[10px] capitalize text-indigo-400/70">
                          {item.contactMethod.replace('_', ' ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {businesses.length > 0 && (
                <div className="rounded-lg border border-[#1c1c1c] bg-[#111] overflow-hidden">
                  <div className="border-b border-[#161616] px-4 py-2.5">
                    <h3 className="text-xs font-semibold text-[#aaa]">Market breakdown</h3>
                  </div>
                  <div className="divide-y divide-[#161616]">
                    {[
                      {
                        label: 'No website',
                        value: businesses.filter((b) => !b.footprint.websiteExists).length,
                        color: 'text-red-400',
                      },
                      {
                        label: 'Weak social',
                        value: businesses.filter(
                          (b) => !b.footprint.instagramExists || b.footprint.instagramActivityScore < 40
                        ).length,
                        color: 'text-amber-400',
                      },
                      {
                        label: '★4.5+ weak digital',
                        value: businesses.filter(
                          (b) => b.googleRating >= 4.5 && b.footprint.digitalPresenceStrength < 45
                        ).length,
                        color: 'text-orange-400',
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-[#555]">{row.label}</span>
                        <span className={`text-xs font-bold tabular-nums ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BusinessDetailModal business={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
