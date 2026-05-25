import type {
  DigitalFootprint,
  LocalBusiness,
  OpportunityCategory,
  BusinessMaturity,
} from '../types'
import { presenceWeaknesses } from './digitalPresence'

export function calculateOpportunityScore(footprint: DigitalFootprint, rating: number, reviewCount: number): number {
  let score = 50

  if (!footprint.websiteExists) score += 22
  else if (footprint.websiteQualityScore < 40) score += 14
  else if (footprint.websiteQualityScore > 75) score -= 12

  if (!footprint.instagramExists) score += 10
  else if (footprint.instagramActivityScore < 35) score += 12
  else if (footprint.instagramActivityScore > 70) score -= 8

  if (!footprint.facebookExists) score += 6
  else if (footprint.facebookActivityScore < 30) score += 8

  if (footprint.brandingScore < 40) score += 10
  if (footprint.consistencyScore < 40) score += 8
  if (footprint.digitalPresenceStrength < 35) score += 12
  if (footprint.digitalPresenceStrength > 70) score -= 15

  if (rating >= 4.6 && reviewCount > 100 && footprint.digitalPresenceStrength < 50) score += 8
  if (rating < 3.8) score += 6
  if (reviewCount < 25) score += 5

  if (footprint.growthIntent > 65) score += 6

  return Math.min(98, Math.max(12, Math.round(score)))
}

export function deriveOpportunityCategories(
  score: number,
  footprint: DigitalFootprint,
  rating: number,
  activeGrowth: boolean
): OpportunityCategory[] {
  const cats: OpportunityCategory[] = []

  if (score >= 75) cats.push('high_potential')
  if (footprint.digitalPresenceStrength < 42 || !footprint.websiteExists) {
    cats.push('weak_digital_presence')
  }
  if (
    footprint.websiteQualityScore < 50 ||
    footprint.brandingScore < 45 ||
    footprint.consistencyScore < 45
  ) {
    cats.push('under_optimized')
  }
  if (activeGrowth || footprint.growthIntent >= 70) cats.push('scaling_fast')
  if (footprint.digitalPresenceStrength > 72 && rating >= 4.5) cats.push('strong_competitor')
  if (
    (!footprint.instagramExists || footprint.instagramActivityScore < 40) &&
    score >= 55
  ) {
    cats.push('needs_automation')
  }

  if (cats.length === 0) cats.push(score >= 50 ? 'under_optimized' : 'strong_competitor')

  return [...new Set(cats)].slice(0, 3)
}

export function primaryCategory(categories: OpportunityCategory[]): OpportunityCategory {
  const priority: OpportunityCategory[] = [
    'high_potential',
    'weak_digital_presence',
    'under_optimized',
    'needs_automation',
    'scaling_fast',
    'strong_competitor',
  ]
  for (const p of priority) {
    if (categories.includes(p)) return p
  }
  return categories[0]
}

export function deriveBusinessMaturity(
  reviewCount: number,
  rating: number,
  footprint: DigitalFootprint
): BusinessMaturity {
  if (reviewCount > 200 && rating >= 4.5 && footprint.marketingMaturity > 65) return 'mature'
  if (reviewCount > 80 || footprint.growthIntent > 60) return 'established'
  if (reviewCount > 30) return 'growing'
  return 'early'
}

export function generateOutreachIntelligence(
  name: string,
  industry: string,
  footprint: DigitalFootprint,
  weaknesses: string[],
  rating: number,
  reviewCount: number,
  opportunityScore: number
): Pick<
  LocalBusiness,
  | 'aiSummary'
  | 'outreachAngle'
  | 'outreachRecommendation'
  | 'outreachOpener'
  | 'serviceSuggestion'
  | 'painPoint'
  | 'suggestedServicePitch'
> {
  const topWeak = weaknesses[0] ?? 'limited digital footprint'
  const industryLabel = industry.toLowerCase()

  const painPoint =
    !footprint.websiteExists
      ? 'Prospects cannot easily validate credibility or book online'
      : footprint.instagramActivityScore < 35
        ? 'Social channels are not driving consistent local discovery'
        : footprint.brandingScore < 45
          ? 'Brand feels dated compared to newer local competitors'
          : 'Marketing systems are not compounding reviews into pipeline'

  const serviceSuggestion =
    !footprint.websiteExists
      ? 'Website + local SEO launch package'
      : footprint.instagramActivityScore < 40
        ? 'Social media growth & content system'
        : footprint.marketingMaturity < 50
          ? 'Full-funnel local marketing retainer'
          : 'Marketing automation & review acceleration'

  const outreachOpener =
    rating >= 4.5 && reviewCount > 50
      ? `Hi — noticed ${name} has strong Google reviews (${rating}★, ${reviewCount}+) but your digital presence isn't matching that reputation yet.`
      : `Hi — I've been researching top ${industryLabel} in your area and ${name} stood out as a business with room to dominate local search.`

  const outreachAngle =
    opportunityScore >= 75
      ? `Turn ${name}'s local reputation into a predictable lead engine`
      : `Close the gap between offline success and online visibility`

  const aiSummary =
    opportunityScore >= 75
      ? `${name} is a ${industryLabel} with ${rating}★ (${reviewCount} reviews) but ${topWeak.toLowerCase()}. Strong offline proof — digital channels are under-leveraged. High-fit for agency services that package credibility + acquisition. Opportunity score ${opportunityScore}/100.`
      : `${name} shows ${footprint.digitalPresenceStrength}/100 digital presence strength. ${topWeak}. ${opportunityScore >= 60 ? 'Good timing for outreach before competitors consolidate local SERP.' : 'Monitor or nurture — stronger competitors may already own paid/social.'}`

  const outreachRecommendation = `Lead with: "${outreachOpener}" Offer a ${serviceSuggestion.toLowerCase()} audit focused on ${painPoint.toLowerCase()}. Reference their ${reviewCount} reviews and one specific gap (e.g. ${topWeak.split('—')[0].trim()}).`

  const suggestedServicePitch = `We help ${industryLabel} like ${name} turn strong local reputation into booked appointments — typically via ${serviceSuggestion.toLowerCase()}, without adding in-house marketing headcount.`

  return {
    aiSummary,
    outreachAngle,
    outreachRecommendation,
    outreachOpener,
    serviceSuggestion,
    painPoint,
    suggestedServicePitch,
  }
}

export function buildLocalBusiness(
  partial: Omit<
    LocalBusiness,
    | 'opportunityScore'
    | 'opportunityCategory'
    | 'categories'
    | 'weaknesses'
    | 'outreachOpener'
    | 'serviceSuggestion'
    | 'painPoint'
    | 'businessMaturity'
    | 'outreachAngle'
    | 'aiSummary'
    | 'outreachRecommendation'
    | 'suggestedServicePitch'
  >
): LocalBusiness {
  const weaknesses = presenceWeaknesses(partial.footprint)
  const opportunityScore = calculateOpportunityScore(
    partial.footprint,
    partial.googleRating,
    partial.reviewCount
  )
  const categories = deriveOpportunityCategories(
    opportunityScore,
    partial.footprint,
    partial.googleRating,
    partial.activeGrowth
  )
  const outreach = generateOutreachIntelligence(
    partial.name,
    partial.industry,
    partial.footprint,
    weaknesses,
    partial.googleRating,
    partial.reviewCount,
    opportunityScore
  )

  return {
    ...partial,
    opportunityScore,
    opportunityCategory: primaryCategory(categories),
    categories,
    weaknesses,
    businessMaturity: deriveBusinessMaturity(
      partial.reviewCount,
      partial.googleRating,
      partial.footprint
    ),
    ...outreach,
  }
}
