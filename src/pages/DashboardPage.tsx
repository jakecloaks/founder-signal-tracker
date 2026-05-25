import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Flame, Target, Radar, TrendingUp, DollarSign } from 'lucide-react'
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
import { UpgradeGate } from '../components/UpgradeGate'
import { UpgradeModal } from '../components/UpgradeModal'
import { useCredits } from '../hooks/useCredits'
import { useSavedLeads } from '../hooks/useSavedLeads'
import type { BusinessFilterKey, BusinessFilters, LocalBusiness } from '../types'

const FREE_RESULTS_LIMIT = 3

function estimateOpportunityValue(businesses: LocalBusiness[], serviceType: string) {
  const highFit = businesses.filter((b) => b.fitScore >= 65).length
  const svc = serviceType.toLowerCase()
  let min = 1500, max = 5000
  if (svc.includes('website') || svc.includes('redesign')) { min = 2500; max = 8000 }
  else if (svc.includes('seo')) { min = 1000; max = 4000 }
  else if (svc.includes('social')) { min = 800; max = 3000 }
  else if (svc.includes('ads') || svc.includes('ppc')) { min = 1500; max = 6000 }
  return { min: highFit * min, max: highFit * max }
}

function formatMoney(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`
}

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const credits = useCredits()
  const savedLeadsHook = useSavedLeads()

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

  const handleSearch = useCallback(async (ind: string, loc: string, svc: string) => {
    if (!credits.hasCredits) {
      setShowUpgradeModal(true)
      return
    }
    credits.useCredit()
    await runSearch(ind, loc, svc)
  }, [credits, runSearch])

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
        .map((b) => ({ id: b.id, name: b.name, angle: b.outreachAngle, fitScore: b.fitScore, contactMethod: b.bestContactMethod, business: b })),
    [businesses]
  )

  const opportunityValue = useMemo(
    () => estimateOpportunityValue(businesses, serviceType),
    [businesses, serviceType]
  )

  const isLocked = !credits.hasCredits
  const visibleResults = isLocked ? filtered.slice(0, FREE_RESULTS_LIMIT) : filtered
  const lockedResults = isLocked ? filtered.slice(FREE_RESULTS_LIMIT) : []

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar credits={credits.credits} savedCount={savedLeadsHook.savedLeads.length} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 shadow-sm">
            <Radar className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-stone-900">SignalScope</span>
          <Link to="/" className="ml-auto text-xs text-stone-400 hover:text-stone-700 transition-colors">
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
          onSearch={handleSearch}
          loading={scanning}
          initialIndustry={industry}
          initialLocation={location}
          initialServiceType={serviceType}
        />

        <main className="flex-1 overflow-auto">
          {/* Stats + opportunity value strip */}
          {!scanning && businesses.length > 0 && (
            <div className="flex items-center gap-0 border-b border-stone-200 bg-white overflow-x-auto">
              <div className="flex items-center gap-2 border-r border-stone-100 px-5 py-3 shrink-0">
                <Building2 className="h-3.5 w-3.5 text-stone-400" />
                <span className="text-xs text-stone-500">Scanned</span>
                <span className="text-sm font-bold tabular-nums text-stone-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2 border-r border-stone-100 px-5 py-3 shrink-0">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs text-stone-500">High fit ≥70</span>
                <span className="text-sm font-bold tabular-nums text-orange-600">{stats.hot}</span>
              </div>
              <div className="flex items-center gap-2 border-r border-stone-100 px-5 py-3 shrink-0">
                <Target className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs text-stone-500">Avg fit</span>
                <span className="text-sm font-bold tabular-nums text-indigo-700">{stats.avg}</span>
              </div>
              {opportunityValue.min > 0 && (
                <div className="flex items-center gap-2 px-5 py-3 shrink-0">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-stone-500">Est. opportunity</span>
                  <span className="text-sm font-bold tabular-nums text-emerald-700">
                    {formatMoney(opportunityValue.min)}–{formatMoney(opportunityValue.max)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid xl:grid-cols-3">
            {/* Main results */}
            <div className="min-w-0 xl:col-span-2 xl:border-r xl:border-stone-200">
              {/* Toolbar */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-200 bg-white/95 backdrop-blur-sm px-4 py-2 sm:px-5">
                <BusinessFiltersBar
                  filters={filters}
                  onChange={(key: BusinessFilterKey) => setFilters({ active: key })}
                />
                <div className="flex shrink-0 rounded-lg border border-stone-200 p-0.5 text-xs shadow-sm">
                  <button
                    type="button"
                    onClick={() => setListView(true)}
                    className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                      listView ? 'bg-indigo-50 text-indigo-700' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setListView(false)}
                    className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                      !listView ? 'bg-indigo-50 text-indigo-700' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>

              {/* Results info */}
              {!scanning && businesses.length > 0 && (
                <div className="px-4 pt-3 sm:px-5">
                  <MapsResultsPanel
                    industry={industry}
                    location={location}
                    serviceType={serviceType}
                    count={filtered.length}
                    dataSource={dataSource}
                  />
                </div>
              )}

              {/* Credit warning */}
              {!scanning && isLocked && filtered.length > FREE_RESULTS_LIMIT && (
                <div className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 sm:mx-5">
                  <p className="text-xs text-amber-800">
                    Showing <span className="font-bold">3 of {filtered.length}</span> results — no searches left.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              )}

              {/* Results */}
              {scanning ? (
                <div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <p className="text-sm text-stone-400">No businesses match your filters.</p>
                </div>
              ) : listView ? (
                <div>
                  {visibleResults.map((business, i) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      listStyle
                      index={i}
                      liveFlash={flashIds.has(business.id)}
                      onClick={() => setSelected(business)}
                      savedLeadsHook={savedLeadsHook}
                    />
                  ))}
                  {lockedResults.length > 0 && (
                    <UpgradeGate
                      lockedCount={lockedResults.length}
                      onUpgrade={() => setShowUpgradeModal(true)}
                      lockedPreviews={
                        <div>
                          {lockedResults.slice(0, 3).map((business, i) => (
                            <BusinessCard
                              key={business.id}
                              business={business}
                              listStyle
                              index={i}
                              onClick={() => {}}
                            />
                          ))}
                        </div>
                      }
                    />
                  )}
                </div>
              ) : (
                <div>
                  <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                    {visibleResults.map((business, i) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        index={i}
                        liveFlash={flashIds.has(business.id)}
                        onClick={() => setSelected(business)}
                        savedLeadsHook={savedLeadsHook}
                      />
                    ))}
                  </div>
                  {lockedResults.length > 0 && (
                    <UpgradeGate
                      lockedCount={lockedResults.length}
                      onUpgrade={() => setShowUpgradeModal(true)}
                      lockedPreviews={
                        <div className="grid gap-3 px-4 pb-2 sm:grid-cols-2 sm:px-5">
                          {lockedResults.slice(0, 4).map((business, i) => (
                            <BusinessCard key={business.id} business={business} index={i} onClick={() => {}} />
                          ))}
                        </div>
                      }
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="hidden p-4 xl:block xl:space-y-4">
              <HotLeadsFeed events={feedEvents} title="Live opportunity feed" />

              {topOutreach.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                  <div className="border-b border-stone-100 bg-stone-50 px-4 py-2.5">
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Top outreach targets</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {topOutreach.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.business)}
                        className="w-full px-4 py-3 text-left transition-colors hover:bg-stone-50 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-stone-800 truncate group-hover:text-stone-900">{item.name}</span>
                          <span className="shrink-0 text-xs font-bold tabular-nums text-orange-600">{item.fitScore}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-stone-500">{item.angle}</p>
                        <p className="mt-1 text-[10px] capitalize text-indigo-600 font-medium">
                          {item.contactMethod.replace('_', ' ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {businesses.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                  <div className="flex items-center gap-1.5 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Market breakdown</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {[
                      { label: 'No website', value: businesses.filter((b) => !b.footprint.websiteExists).length, color: 'text-red-600' },
                      { label: 'Weak social', value: businesses.filter((b) => !b.footprint.instagramExists || b.footprint.instagramActivityScore < 40).length, color: 'text-amber-600' },
                      { label: '★4.5+ weak digital', value: businesses.filter((b) => b.googleRating >= 4.5 && b.footprint.digitalPresenceStrength < 45).length, color: 'text-orange-600' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-stone-500">{row.label}</span>
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

      <BusinessDetailModal
        business={selected}
        onClose={() => setSelected(null)}
        savedLeadsHook={savedLeadsHook}
      />

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            credits.addCredits(50)
            setShowUpgradeModal(false)
          }}
        />
      )}
    </div>
  )
}
