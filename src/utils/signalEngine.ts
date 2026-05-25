import type { Company, GrowthStatus, IntentBreakdown, Signal, SignalType } from '../types'

const SIGNAL_WEIGHTS: Record<SignalType, number> = {
  hiring_sdrs: 18,
  meta_ads: 14,
  founder_scaling_post: 12,
  new_landing_page: 10,
  product_launch: 16,
  team_expansion: 15,
  funding_signal: 20,
  linkedin_outreach: 8,
}

export function calculateIntentScore(signals: Signal[]): number {
  if (signals.length === 0) return 0
  const raw = signals.reduce((sum, s) => {
    const weight = SIGNAL_WEIGHTS[s.type] ?? 10
    return sum + (weight * s.strength) / 100
  }, 0)
  return Math.min(100, Math.round(raw * 1.2))
}

export function deriveGrowthStatus(score: number): GrowthStatus {
  if (score >= 80) return 'scaling'
  if (score >= 65) return 'expanding'
  if (score >= 45) return 'warming'
  return 'watching'
}

export function calculateSignalStrength(signals: Signal[]): number {
  if (signals.length === 0) return 0
  const avg = signals.reduce((s, sig) => s + sig.strength, 0) / signals.length
  const densityBonus = Math.min(20, signals.length * 4)
  return Math.min(100, Math.round(avg * 0.7 + densityBonus))
}

export function buildIntentBreakdown(signals: Signal[]): IntentBreakdown {
  const breakdown: IntentBreakdown = {
    hiring: 0,
    marketing: 0,
    product: 0,
    social: 0,
    funding: 0,
  }

  for (const signal of signals) {
    const contribution = Math.round(signal.strength * 0.85)
    switch (signal.type) {
      case 'hiring_sdrs':
      case 'team_expansion':
        breakdown.hiring = Math.min(100, breakdown.hiring + contribution)
        break
      case 'meta_ads':
      case 'new_landing_page':
        breakdown.marketing = Math.min(100, breakdown.marketing + contribution)
        break
      case 'product_launch':
        breakdown.product = Math.min(100, breakdown.product + contribution)
        break
      case 'founder_scaling_post':
      case 'linkedin_outreach':
        breakdown.social = Math.min(100, breakdown.social + contribution)
        break
      case 'funding_signal':
        breakdown.funding = Math.min(100, breakdown.funding + contribution)
        break
    }
  }

  return breakdown
}

export function generateAiSummary(company: Pick<Company, 'name' | 'signals' | 'intentScore'>): string {
  const categories: string[] = []
  const types = new Set(company.signals.map((s) => s.type))

  if (types.has('hiring_sdrs') || types.has('team_expansion')) {
    categories.push('hiring growth')
  }
  if (types.has('meta_ads') || types.has('new_landing_page')) {
    categories.push('marketing expansion')
  }
  if (types.has('product_launch')) {
    categories.push('product momentum')
  }
  if (types.has('founder_scaling_post')) {
    categories.push('founder-led scaling signals')
  }
  if (types.has('funding_signal')) {
    categories.push('capital deployment indicators')
  }

  const categoryText =
    categories.length > 0 ? categories.join(' and ') : 'early-stage market activity'

  if (company.intentScore >= 80) {
    return `${company.name} appears to be entering aggressive acquisition mode due to ${categoryText}. Multiple high-confidence signals suggest active budget allocation within 30–60 days.`
  }
  if (company.intentScore >= 65) {
    return `${company.name} is showing strong buying indicators driven by ${categoryText}. Outreach timing is favorable before competitors engage.`
  }
  if (company.intentScore >= 45) {
    return `${company.name} is warming up with moderate signals around ${categoryText}. Monitor for 2–3 more triggers before prioritizing outreach.`
  }
  return `${company.name} is on early watch with limited but emerging signals. Add to nurture sequence and track weekly.`
}

export function generateOutreachRecommendation(
  company: Pick<Company, 'name' | 'signals' | 'outreachAngle'>
): string {
  const topSignal = [...company.signals].sort((a, b) => b.strength - a.strength)[0]
  const signalContext = topSignal ? `their recent ${topSignal.label.toLowerCase()}` : 'growth trajectory'

  return `Lead with "${company.outreachAngle}" — reference ${signalContext} and offer a 15-min audit on scaling outbound without adding headcount. Personalize with a specific metric from their public activity.`
}

export function analyzeTrend(scores: number[]): 'rising' | 'stable' | 'cooling' {
  if (scores.length < 2) return 'stable'
  const recent = scores.slice(-3)
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length
  const prev = scores.slice(0, -1)
  const prevAvg = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : avg
  if (avg - prevAvg > 5) return 'rising'
  if (avg - prevAvg < -5) return 'cooling'
  return 'stable'
}

export function enrichCompany(company: Omit<Company, 'intentScore' | 'growthStatus' | 'aiSummary' | 'outreachRecommendation' | 'intentBreakdown' | 'signalStrength'> & {
  intentScore?: number
}): Company {
  const intentScore = company.intentScore ?? calculateIntentScore(company.signals)
  const intentBreakdown = buildIntentBreakdown(company.signals)
  const signalStrength = calculateSignalStrength(company.signals)

  return {
    ...company,
    intentScore,
    growthStatus: deriveGrowthStatus(intentScore),
    intentBreakdown,
    signalStrength,
    aiSummary: generateAiSummary({ name: company.name, signals: company.signals, intentScore }),
    outreachRecommendation: generateOutreachRecommendation({
      name: company.name,
      signals: company.signals,
      outreachAngle: company.outreachAngle,
    }),
  }
}

export function filterByIntent(companies: Company[], minScore: number): Company[] {
  return companies.filter((c) => c.intentScore >= minScore)
}

export function searchCompanies(companies: Company[], query: string): Company[] {
  const q = query.trim().toLowerCase()
  if (!q) return companies
  return companies.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.signals.some((s) => s.label.toLowerCase().includes(q))
  )
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
