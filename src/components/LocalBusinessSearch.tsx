import { useState, type FormEvent } from "react";
import { Loader2, MapPin, Search, ChevronDown } from "lucide-react";
import { SUGGESTED_SEARCHES, TARGET_INDUSTRIES } from "../services/business";

interface LocalBusinessSearchProps {
  onSearch: (industry: string, location: string, serviceType: string) => void;
  loading?: boolean;
  initialIndustry?: string;
  initialLocation?: string;
  initialServiceType?: string;
}

export function LocalBusinessSearch({
  onSearch,
  loading,
  initialIndustry = "dentists",
  initialLocation = "Salt Lake City, UT",
}: LocalBusinessSearchProps) {
  const [industry, setIndustry] = useState(initialIndustry);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!industry.trim() || !location.trim() || loading) return;
    onSearch(industry.trim(), location.trim(), "website redesign");
  }

  const inputClass =
    "w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] py-2.5 pl-9 pr-3 text-sm text-[#FAFAF9] placeholder:text-[#555] focus:border-[#4A90E2]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/10 transition-all disabled:opacity-50";

  return (
    <div className="border-b border-[#1E1E1E] bg-[#111] px-4 py-3 sm:px-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 lg:flex-row lg:items-center"
      >
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          {/* Industry select */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className={`${inputClass} pl-9 appearance-none cursor-pointer`}
            >
              <option value="" disabled>
                Select industry…
              </option>
              {TARGET_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind.toLowerCase()}>
                  {ind}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
          </div>
          {/* Location */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="City or region — Dallas, TX · Phoenix…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>
          {/* Fixed service label */}
          <div className="hidden items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2.5 sm:flex shrink-0">
            <span className="text-xs text-[#555]">Service:</span>
            <span className="text-xs font-semibold text-[#4A90E2]">
              Website Redesign
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !industry.trim() || !location.trim()}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4A90E2] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3D7CC9] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <MapPin className="h-3.5 w-3.5" />
              Find leads
            </>
          )}
        </button>
      </form>

      {/* Quick search chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTED_SEARCHES.map((s) => (
          <button
            key={`${s.industry}-${s.location}`}
            type="button"
            disabled={loading}
            onClick={() => {
              setIndustry(s.industry);
              setLocation(s.location);
              onSearch(s.industry, s.location, "website redesign");
            }}
            className="rounded-md border border-[#2A2A2A] bg-[#1A1A1A] px-2 py-1 text-[11px] font-medium text-[#888] transition-colors hover:border-[#333] hover:text-[#FAFAF9] disabled:opacity-40"
          >
            {s.industry} · {s.location}
          </button>
        ))}
      </div>
    </div>
  );
}
