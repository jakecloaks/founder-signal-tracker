import type { FeedEvent, LocalBusiness } from '../types'
import { generateMockBusinesses } from '../data/mock/businessGenerator'

export function buildFeedFromBusinesses(businesses: LocalBusiness[]): FeedEvent[] {
  const events: FeedEvent[] = []

  for (const b of businesses) {
    const signal =
      b.weaknesses[0] ??
      b.categories[0]?.replace(/_/g, ' ') ??
      'Opportunity detected'
    events.push({
      id: `feed-${b.id}`,
      companyId: b.id,
      companyName: b.name,
      signal: signal.slice(0, 60),
      timestamp: b.lastUpdated,
      intentScore: b.fitScore,
    })
  }

  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)
}

export function tickLiveIntelligence(businesses: LocalBusiness[]): LocalBusiness[] {
  return businesses.map((b) => {
    const drift = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
    const newScore = Math.min(98, Math.max(10, b.opportunityScore + drift))
    const footprintDrift =
      Math.random() > 0.85
        ? {
            ...b.footprint,
            instagramActivityScore: Math.min(
              100,
              Math.max(0, b.footprint.instagramActivityScore + (Math.random() > 0.5 ? 2 : -2))
            ),
          }
        : b.footprint

    return {
      ...b,
      opportunityScore: newScore,
      footprint: footprintDrift,
      lastUpdated: new Date().toISOString(),
    }
  })
}

export function injectLiveOpportunity(
  businesses: LocalBusiness[],
  industry: string,
  location: string,
  serviceType: string
): LocalBusiness | null {
  if (Math.random() > 0.35 || businesses.length >= 16) return null

  const fresh = generateMockBusinesses(industry, location, serviceType)
  const candidate = fresh.find((f) => !businesses.some((b) => b.name === f.name))
  if (!candidate) return null

  return {
    ...candidate,
    id: `lb-live-${Date.now()}`,
    opportunityScore: Math.min(98, candidate.opportunityScore + 4),
    lastUpdated: new Date().toISOString(),
  }
}
