import type { Company, FeedEvent } from '../types'

export function buildFeedFromCompanies(companies: Company[]): FeedEvent[] {
  const events: FeedEvent[] = []

  for (const company of companies) {
    for (const signal of company.signals.slice(0, 2)) {
      events.push({
        id: `feed-${company.id}-${signal.id}`,
        companyId: company.id,
        companyName: company.name,
        signal: signal.label,
        timestamp: signal.detectedAt,
        intentScore: company.intentScore,
      })
    }
  }

  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 16)
}
