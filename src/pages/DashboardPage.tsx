import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Flame, Target, DollarSign, TrendingUp } from "lucide-react";
import { DEFAULT_SEARCH, searchBusinesses } from "../services/business";
import type { BusinessDataSource } from "../types";
import { filterBusinesses } from "../utils/businessFilters";
import {
  buildFeedFromBusinesses,
  tickLiveIntelligence,
} from "../utils/liveIntelligence";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { LocalBusinessSearch } from "../components/LocalBusinessSearch";
import { BusinessFiltersBar } from "../components/BusinessFiltersBar";
import { BusinessCard } from "../components/BusinessCard";
import { BusinessCardSkeleton } from "../components/BusinessCardSkeleton";
import { BusinessDetailModal } from "../components/BusinessDetailModal";
import { MapsResultsPanel } from "../components/MapsResultsPanel";
import { HotLeadsFeed } from "../components/HotLeadsFeed";
import { UpgradeGate } from "../components/UpgradeGate";
import { UpgradeModal } from "../components/UpgradeModal";
import { useCredits } from "../hooks/useCredits";
import { useSavedLeads } from "../hooks/useSavedLeads";
import { SignalScopeLogo } from "../components/SignalScopeLogo";
import { MrQuakEmpty } from "../components/MrQuak";
import type {
  BusinessFilterKey,
  BusinessFilters,
  BusinessSortKey,
  LocalBusiness,
} from "../types";

const FREE_RESULTS_LIMIT = 3;

function estimateOpportunityValue(
  businesses: LocalBusiness[],
  serviceType: string,
) {
  const highFit = businesses.filter((b) => b.fitScore >= 65).length;
  const svc = serviceType.toLowerCase();
  let min = 1500,
    max = 5000;
  if (svc.includes("website") || svc.includes("redesign")) {
    min = 2500;
    max = 8000;
  } else if (svc.includes("seo")) {
    min = 1000;
    max = 4000;
  } else if (svc.includes("social")) {
    min = 800;
    max = 3000;
  } else if (svc.includes("ads") || svc.includes("ppc")) {
    min = 1500;
    max = 6000;
  }
  return { min: highFit * min, max: highFit * max };
}

function formatMoney(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
}

export function DashboardPage() {
  const [industry, setIndustry] = useState(DEFAULT_SEARCH.industry);
  const [location, setLocation] = useState(DEFAULT_SEARCH.location);
  const [serviceType, setServiceType] = useState(DEFAULT_SEARCH.serviceType);
  const [radius, setRadius] = useState(10);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [dataSource, setDataSource] = useState<BusinessDataSource>("mock");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<BusinessFilters>({ active: "all" });
  const [sortBy, setSortBy] = useState<BusinessSortKey>("opportunity");
  const [selected, setSelected] = useState<LocalBusiness | null>(null);
  const [scanning, setScanning] = useState(false);
  const [listView, setListView] = useState(true);
  const [flashIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const credits = useCredits();
  const savedLeadsHook = useSavedLeads();

  const runSearch = useCallback(
    async (ind: string, loc: string, svc: string, rad: number) => {
      setScanning(true);
      setSearchError(null);
      setIndustry(ind);
      setLocation(loc);
      setServiceType(svc);
      setRadius(rad);
      try {
        // searchBusinesses() always succeeds — it falls back to mock data if API is unavailable
        const result = await searchBusinesses(ind, loc, svc, rad);
        setBusinesses(result.businesses);
        setDataSource(result.source);
      } catch (err) {
        // Unexpected error — should not happen, but handle gracefully
        const msg =
          err instanceof Error
            ? err.message
            : "Search failed. Please try again.";
        setSearchError(msg);
        setBusinesses([]);
      } finally {
        setScanning(false);
      }
    },
    [],
  );

  const handleSearch = useCallback(
    async (ind: string, loc: string, svc: string, rad: number) => {
      if (!credits.hasCredits) {
        setShowUpgradeModal(true);
        return;
      }
      credits.useCredit();
      await runSearch(ind, loc, svc, rad);
    },
    [credits, runSearch],
  );

  useEffect(() => {
    if (!initialized) {
      runSearch(
        DEFAULT_SEARCH.industry,
        DEFAULT_SEARCH.location,
        DEFAULT_SEARCH.serviceType,
        radius,
      );
      setInitialized(true);
    }
  }, [initialized, radius, runSearch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusinesses((prev) => tickLiveIntelligence(prev));
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(
    () => filterBusinesses(businesses, filters, search, sortBy),
    [businesses, filters, search, sortBy],
  );
  const feedEvents = useMemo(
    () => buildFeedFromBusinesses(businesses),
    [businesses],
  );

  const stats = useMemo(() => {
    const hot = businesses.filter((b) => b.fitScore >= 70).length;
    const avg = businesses.length
      ? Math.round(
          businesses.reduce((s, b) => s + b.fitScore, 0) / businesses.length,
        )
      : 0;
    return { total: businesses.length, hot, avg };
  }, [businesses]);

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
    [businesses],
  );

  const opportunityValue = useMemo(
    () => estimateOpportunityValue(businesses, serviceType),
    [businesses, serviceType],
  );

  const isLocked = !credits.hasCredits;
  const visibleResults = isLocked
    ? filtered.slice(0, FREE_RESULTS_LIMIT)
    : filtered;
  const lockedResults = isLocked ? filtered.slice(FREE_RESULTS_LIMIT) : [];

  return (
    <div className="flex min-h-screen bg-[#0C0C10] text-[#EAEAF0]">
      <Sidebar
        credits={credits.credits}
        savedCount={savedLeadsHook.savedLeads.length}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center gap-2 border-b border-[#1F1F30] bg-[#101015] px-4 py-3 md:hidden">
          <SignalScopeLogo size="sm" />
          <Link
            to="/"
            className="ml-auto text-xs text-[#424258] hover:text-[#82829A] transition-colors"
          >
            Home
          </Link>
        </div>

        <TopBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Filter results by business name…"
          hideIntentFilter
        />
        <LocalBusinessSearch
          onSearch={handleSearch}
          loading={scanning}
          initialIndustry={industry}
          initialLocation={location}
          initialRadius={radius}
          initialServiceType={serviceType}
        />

        <main className="flex-1 overflow-auto">
          {/* Stats strip */}
          {!scanning && businesses.length > 0 && (
            <div className="flex items-center overflow-x-auto border-b border-[#1F1F30] bg-[#101015]">
              {[
                {
                  icon: Building2,
                  label: "Scanned",
                  value: String(stats.total),
                  color: "text-[#EAEAF0]",
                },
                {
                  icon: Flame,
                  label: "High fit ≥70",
                  value: String(stats.hot),
                  color: "text-[#E07A45]",
                },
                {
                  icon: Target,
                  label: "Avg fit",
                  value: String(stats.avg),
                  color: "text-[#4A8FE0]",
                },
                ...(opportunityValue.min > 0
                  ? [
                      {
                        icon: DollarSign,
                        label: "Est. opportunity",
                        value: `${formatMoney(opportunityValue.min)}–${formatMoney(opportunityValue.max)}`,
                        color: "text-[#3DCC6E]",
                      },
                    ]
                  : []),
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-2 px-5 py-3 shrink-0 ${i < arr.length - 1 ? "border-r border-[#1F1F30]" : ""}`}
                >
                  <stat.icon className="h-3.5 w-3.5 text-[#424258]" />
                  <span className="text-xs text-[#82829A]">{stat.label}</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${stat.color}`}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid xl:grid-cols-3">
            {/* Main results */}
            <div className="min-w-0 xl:col-span-2 xl:border-r xl:border-[#1F1F30]">
              {/* Toolbar */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#1F1F30] bg-[#0C0C10]/96 backdrop-blur-sm px-5 py-2">
                <BusinessFiltersBar
                  filters={filters}
                  onChange={(key: BusinessFilterKey) =>
                    setFilters({ active: key })
                  }
                />
                <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-[#1F1F30] bg-[#16161D] px-2.5 py-1 text-xs text-[#82829A]">
                  <span className="font-medium text-[#EAEAF0]">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as BusinessSortKey)}
                    className="rounded-md border border-[#1F1F30] bg-[#0C0C10] px-2 py-1 text-xs text-[#EAEAF0] outline-none"
                  >
                    <option value="opportunity">Best opportunity</option>
                    <option value="distance">Closest distance</option>
                  </select>
                </div>
                <div className="flex shrink-0 rounded-lg border border-[#1F1F30] bg-[#16161D] p-0.5 text-xs">
                  {(["List", "Cards"] as const).map((label) => {
                    const active = label === "List" ? listView : !listView;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setListView(label === "List")}
                        className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                          active
                            ? "bg-[#4A8FE0]/10 text-[#4A8FE0]"
                            : "text-[#424258] hover:text-[#82829A]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              </div>

              {!scanning && businesses.length > 0 && (
                <div className="px-5 pt-3">
                  <MapsResultsPanel
                    industry={industry}
                    location={location}
                    serviceType={serviceType}
                    count={filtered.length}
                    dataSource={dataSource}
                  />
                </div>
              )}

              {!scanning &&
                isLocked &&
                filtered.length > FREE_RESULTS_LIMIT && (
                  <div className="mx-5 mb-2 flex items-center justify-between gap-3 rounded-xl border border-[#E8A520]/20 bg-[#E8A520]/8 px-4 py-2.5">
                    <p className="text-xs text-[#E8A520]">
                      Showing{" "}
                      <span className="font-bold">3 of {filtered.length}</span>{" "}
                      results — no searches left.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowUpgradeModal(true)}
                      className="shrink-0 rounded-lg bg-[#4A8FE0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3A7CC8] transition-colors"
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
              ) : searchError ? (
                <div className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-6 py-5 max-w-md w-full">
                    <p className="text-sm font-semibold text-red-400 mb-1">
                      Search failed
                    </p>
                    <p className="text-xs text-[#82829A]">{searchError}</p>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <MrQuakEmpty
                  title="No businesses match your filters"
                  subtitle="Try adjusting the filters above or run a new search"
                />
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
                      location={location}
                      onUpgrade={() => setShowUpgradeModal(true)}
                      lockedPreviews={
                        <div>
                          {lockedResults.slice(0, 3).map((b, i) => (
                            <BusinessCard
                              key={b.id}
                              business={b}
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
                  <div className="grid gap-3 p-5 sm:grid-cols-2">
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
                      location={location}
                      onUpgrade={() => setShowUpgradeModal(true)}
                      lockedPreviews={
                        <div className="grid gap-3 px-5 pb-2 sm:grid-cols-2">
                          {lockedResults.slice(0, 4).map((b, i) => (
                            <BusinessCard
                              key={b.id}
                              business={b}
                              index={i}
                              onClick={() => {}}
                            />
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
                <div className="overflow-hidden rounded-xl border border-[#1F1F30] bg-[#16161D]">
                  <div className="border-b border-[#1F1F30] bg-[#101015] px-4 py-2.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#424258]">
                      Top outreach targets
                    </h3>
                  </div>
                  <div className="divide-y divide-[#1A1A28]">
                    {topOutreach.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.business)}
                        className="w-full px-4 py-3 text-left transition-colors hover:bg-[#1C1C26]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-semibold text-[#EAEAF0]">
                            {item.name}
                          </span>
                          <span className="shrink-0 text-xs font-bold tabular-nums text-[#E07A45]">
                            {item.fitScore}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#82829A]">
                          {item.angle}
                        </p>
                        <p className="mt-1 text-[10px] capitalize font-medium text-[#4A8FE0]">
                          {item.contactMethod.replace("_", " ")}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {businesses.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-[#1F1F30] bg-[#16161D]">
                  <div className="flex items-center gap-1.5 border-b border-[#1F1F30] bg-[#101015] px-4 py-2.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#3DCC6E]" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#424258]">
                      Market breakdown
                    </h3>
                  </div>
                  <div className="divide-y divide-[#1A1A28]">
                    {[
                      {
                        label: "No website",
                        value: businesses.filter(
                          (b) => !b.footprint.websiteExists,
                        ).length,
                        color: "text-[#D95555]",
                      },
                      {
                        label: "Weak social",
                        value: businesses.filter(
                          (b) =>
                            !b.footprint.instagramExists ||
                            b.footprint.instagramActivityScore < 40,
                        ).length,
                        color: "text-[#E8A520]",
                      },
                      {
                        label: "★4.5+ weak digital",
                        value: businesses.filter(
                          (b) =>
                            b.googleRating >= 4.5 &&
                            b.footprint.digitalPresenceStrength < 45,
                        ).length,
                        color: "text-[#E07A45]",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <span className="text-xs text-[#82829A]">
                          {row.label}
                        </span>
                        <span
                          className={`text-xs font-bold tabular-nums ${row.color}`}
                        >
                          {row.value}
                        </span>
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
            credits.addCredits(50);
            setShowUpgradeModal(false);
          }}
        />
      )}
    </div>
  );
}
