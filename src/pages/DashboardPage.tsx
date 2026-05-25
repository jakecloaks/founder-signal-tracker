import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Building2, Flame, Target, Sparkles } from 'lucide-react'
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
        .slice(0, 3)
        .map((b) => ({
          name: b.name,
          angle: b.outreachAngle,
          fitScore: b.fitScore,
          contactMethod: b.bestContactMethod,
        })),
    [businesses]
  )

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-zinc-100">LocalIQ</span>
          <Link to="/" className="ml-auto text-xs text-zinc-500 hover:text-zinc-300">
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

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="glass fade-in rounded-xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-500">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Businesses scanned</span>
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-100">{stats.total}</p>
            </div>
            <div className="glass fade-in stagger-1 rounded-xl p-4 transition-all hover:border-orange-500/20">
              <div className="flex items-center gap-2 text-zinc-500">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-xs">High fit (70+)</span>
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-orange-400">{stats.hot}</p>
            </div>
            <div className="glass fade-in stagger-2 rounded-xl p-4 transition-all hover:border-indigo-500/20">
              <div className="flex items-center gap-2 text-zinc-500">
                <Target className="h-4 w-4 text-indigo-400" />
                <span className="text-xs">Avg fit score</span>
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-indigo-300">{stats.avg}</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              {!scanning && businesses.length > 0 && (
                <MapsResultsPanel
                  industry={industry}
                  location={location}
                  serviceType={serviceType}
                  count={filtered.length}
                  dataSource={dataSource}
                />
              )}

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <BusinessFiltersBar
                  filters={filters}
                  onChange={(key: BusinessFilterKey) => setFilters({ active: key })}
                />
                <div className="flex rounded-lg border border-zinc-800 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setListView(true)}
                    className={`rounded-md px-3 py-1.5 transition-colors ${listView ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setListView(false)}
                    className={`rounded-md px-3 py-1.5 transition-colors ${!listView ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Cards
                  </button>
                </div>
              </div>

              {scanning ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center text-zinc-500">
                  No businesses match your filters. Try a new search or clear filters.
                </div>
              ) : listView ? (
                <div className="space-y-3">
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
                <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="space-y-6">
              <HotLeadsFeed events={feedEvents} title="Live opportunity feed" />

              <div className="glass fade-in rounded-xl p-4">
                <h3 className="mb-4 text-sm font-semibold text-zinc-200">
                  Top outreach targets
                </h3>
                <div className="space-y-4">
                  {topOutreach.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 transition-all hover:border-indigo-500/30 hover:bg-zinc-900/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                        <span className="text-xs font-semibold tabular-nums text-orange-400">{item.fitScore}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{item.angle}</p>
                      <p className="mt-2 text-xs text-indigo-400/80 capitalize">
                        Best contact: {item.contactMethod.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass fade-in rounded-xl p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Market snapshot
                </div>
                <div className="space-y-3 text-xs text-zinc-500">
                  <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                    <span>No website</span>
                    <span className="font-medium tabular-nums text-zinc-300">
                      {businesses.filter((b) => !b.footprint.websiteExists).length}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                    <span>Weak social</span>
                    <span className="font-medium tabular-nums text-zinc-300">
                      {
                        businesses.filter(
                          (b) =>
                            !b.footprint.instagramExists || b.footprint.instagramActivityScore < 40
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High reviews, weak digital</span>
                    <span className="font-medium tabular-nums text-orange-400/90">
                      {
                        businesses.filter(
                          (b) =>
                            b.googleRating >= 4.5 &&
                            b.footprint.digitalPresenceStrength < 45
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BusinessDetailModal business={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
