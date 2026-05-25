import type {
  ContactChannelVisibility,
  ContactMethod,
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

function normalizeServiceType(raw: string): string {
  return raw.trim().toLowerCase()
}

export function generateFitAnalysis(
  name: string,
  industry: string,
  footprint: DigitalFootprint,
  serviceType: string,
  opportunityScore: number,
  rating: number,
  reviewCount: number
): { fitScore: number; fitExplanation: string } {
  const svc = normalizeServiceType(serviceType || 'marketing')
  const industryLabel = industry.toLowerCase()

  let fitScore = Math.round(opportunityScore * 0.6 + 20)

  const isWebsite = /website|web design|web dev|redesign|landing page/i.test(svc)
  const isSocial = /social|instagram|facebook|content|tiktok|reels/i.test(svc)
  const isSEO = /seo|search|google|rank|organic/i.test(svc)
  const isBranding = /brand|logo|identity|design|visual/i.test(svc)
  const isAds = /ads|paid|ppc|facebook ads|google ads|advertising/i.test(svc)
  const isEmail = /email|newsletter|crm|automation/i.test(svc)
  const isPhoto = /photo|photography|video|media/i.test(svc)

  let explanation = ''

  if (isWebsite) {
    if (!footprint.websiteExists) {
      fitScore = Math.min(98, fitScore + 22)
      explanation = `${name} has no website at all — a blank-slate opportunity for a full site build. With ${reviewCount} Google reviews and ${rating}★, the offline reputation is already there. A professional site could immediately convert local search traffic into booked appointments.`
    } else if (footprint.websiteQualityScore < 45) {
      fitScore = Math.min(98, fitScore + 14)
      explanation = `${name} has an outdated or low-quality website (quality score: ${footprint.websiteQualityScore}/100). A redesign could immediately improve credibility and conversion rate. They have the reviews (${reviewCount}) to back up a premium digital presence.`
    } else {
      fitScore = Math.max(20, fitScore - 15)
      explanation = `${name} already has a reasonably functional website (quality score: ${footprint.websiteQualityScore}/100). A redesign may be a harder sell unless you can position around UX improvements or conversion optimization.`
    }
  } else if (isSocial) {
    if (!footprint.instagramExists && !footprint.facebookExists) {
      fitScore = Math.min(98, fitScore + 20)
      explanation = `${name} has zero social media presence — no Instagram, no Facebook. For a ${industryLabel} with ${rating}★ and ${reviewCount} reviews, this is a significant missed opportunity. They're a strong fit for a social media launch and content management package.`
    } else if (footprint.instagramActivityScore < 40 || footprint.facebookActivityScore < 35) {
      fitScore = Math.min(98, fitScore + 12)
      explanation = `${name} has social accounts but low engagement — Instagram activity at ${footprint.instagramActivityScore}/100. Their strong offline reputation (${rating}★, ${reviewCount} reviews) isn't translating to social visibility. A content system could change that.`
    } else {
      fitScore = Math.max(20, fitScore - 10)
      explanation = `${name} already maintains relatively active social channels. They may still benefit from content strategy and growth, but this is a softer fit — position around scaling, not starting from scratch.`
    }
  } else if (isSEO) {
    if (!footprint.websiteExists) {
      fitScore = Math.min(98, fitScore + 18)
      explanation = `${name} has no website — they can't rank for anything. Before SEO, they need a site, which means a larger engagement opportunity. Lead with web + SEO as a bundle.`
    } else if (footprint.websiteQualityScore < 55) {
      fitScore = Math.min(98, fitScore + 14)
      explanation = `${name} has a weak website (${footprint.websiteQualityScore}/100 quality) and almost certainly poor local SEO. With ${reviewCount} reviews and a ${rating}★ rating, they have review signals Google loves — they just need on-page optimization and a local SEO strategy to rank.`
    } else {
      fitScore = Math.max(25, fitScore - 8)
      explanation = `${name} has a reasonable web presence. They may already have basic SEO in place. A technical audit could uncover gaps, but this is a moderate-fit opportunity.`
    }
  } else if (isBranding) {
    if (footprint.brandingScore < 40) {
      fitScore = Math.min(98, fitScore + 18)
      explanation = `${name} has severely inconsistent or dated branding (score: ${footprint.brandingScore}/100). For a ${industryLabel} with ${rating}★, the brand should command the same trust their reviews do. A branding overhaul could directly impact perceived value and pricing power.`
    } else if (footprint.brandingScore < 60) {
      fitScore = Math.min(98, fitScore + 8)
      explanation = `${name} has mediocre branding (${footprint.brandingScore}/100). There's room to improve cohesion and visual identity, especially if they want to compete on premium positioning.`
    } else {
      fitScore = Math.max(20, fitScore - 12)
      explanation = `${name}'s branding is above average (${footprint.brandingScore}/100). A branding pitch may be a tough sell — consider positioning around a brand refresh rather than a full rebrand.`
    }
  } else if (isAds) {
    const weakPresence = footprint.digitalPresenceStrength < 50
    if (weakPresence && !footprint.websiteExists) {
      fitScore = Math.min(98, fitScore + 10)
      explanation = `${name} lacks a website, making paid ads less effective without a landing page. Consider bundling ads with a landing page build. Good long-term opportunity, but needs foundation work first.`
    } else if (rating >= 4.5 && reviewCount > 50) {
      fitScore = Math.min(98, fitScore + 16)
      explanation = `${name} has strong social proof (${rating}★, ${reviewCount} reviews) — the raw material for high-converting local ad campaigns. A paid ads strategy with review-led creative could deliver fast ROI for this ${industryLabel}.`
    } else {
      fitScore = Math.min(98, fitScore + 8)
      explanation = `${name} could benefit from targeted local ads to increase new customer acquisition. Moderate fit — stronger if paired with a landing page or offer.`
    }
  } else if (isPhoto) {
    const weakImg = footprint.brandingScore < 50 || footprint.websiteQualityScore < 50
    if (weakImg) {
      fitScore = Math.min(98, fitScore + 16)
      explanation = `${name} has low visual quality scores across their digital presence. Professional photography or video would immediately elevate their website, social, and Google Business profile — making them a natural fit for media services.`
    } else {
      fitScore = Math.min(98, fitScore + 6)
      explanation = `${name} could benefit from updated media assets, though their current visual quality is decent. A good pitch would focus on seasonal content or video for social media.`
    }
  } else {
    fitScore = Math.min(98, fitScore + 4)
    explanation = `${name} is a ${industryLabel} with ${rating}★ and ${reviewCount} reviews but a digital presence score of ${footprint.digitalPresenceStrength}/100. ${footprint.digitalPresenceStrength < 45 ? 'They are under-optimized across the board — a strong prospect for general marketing services.' : 'They have moderate digital presence with specific gaps your services could address.'}`
  }

  fitScore = Math.min(98, Math.max(12, Math.round(fitScore)))
  return { fitScore, fitExplanation: explanation }
}

export function generateContactChannelVisibility(
  footprint: DigitalFootprint,
  hasPhone: boolean
): ContactChannelVisibility {
  return {
    instagram: footprint.instagramExists ? footprint.instagramActivityScore : 0,
    facebook: footprint.facebookExists ? footprint.facebookActivityScore : 0,
    phone: hasPhone ? Math.round(65 + footprint.reviewQualityScore * 0.2) : 0,
    website_form: footprint.websiteExists ? Math.round(footprint.websiteQualityScore * 0.75) : 0,
    email: footprint.websiteExists ? Math.round(30 + footprint.consistencyScore * 0.3) : 10,
  }
}

export function determineBestContactMethod(
  footprint: DigitalFootprint,
  hasPhone: boolean
): { method: ContactMethod; reason: string } {
  const visibility = generateContactChannelVisibility(footprint, hasPhone)

  if (footprint.instagramExists && footprint.instagramActivityScore > 55) {
    return {
      method: 'instagram',
      reason: `Instagram is the best outreach channel — the business actively posts with a ${footprint.instagramActivityScore}/100 activity score. DMs are likely to be seen by the owner directly.`,
    }
  }

  if (hasPhone && visibility.phone > 70) {
    return {
      method: 'phone',
      reason: `Direct phone call is recommended. With ${footprint.reviewCount !== undefined ? 'strong' : ''} Google presence, the owner likely handles calls personally. Best for high-urgency, first-impression outreach.`,
    }
  }

  if (footprint.websiteExists && footprint.websiteQualityScore > 40) {
    return {
      method: 'website_form',
      reason: `Their website has a contact form (quality score: ${footprint.websiteQualityScore}/100). Reaching out via the form is professional and signals you researched them — good for warm, value-led outreach.`,
    }
  }

  if (footprint.facebookExists && footprint.facebookActivityScore > 30) {
    return {
      method: 'facebook',
      reason: `Facebook is their most active channel (activity: ${footprint.facebookActivityScore}/100). Business messaging on Facebook is monitored and often reaches the owner directly.`,
    }
  }

  if (hasPhone) {
    return {
      method: 'phone',
      reason: `Phone is the most reliable channel for this business. Their limited digital presence makes direct calls the fastest path to the decision maker.`,
    }
  }

  return {
    method: 'email',
    reason: `Email outreach via their listed contact is the most practical option. Keep it concise, lead with a specific observation about their digital presence, and include one clear call to action.`,
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
    | 'fitScore'
    | 'fitExplanation'
    | 'bestContactMethod'
    | 'bestContactMethodReason'
    | 'contactChannelVisibility'
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

  const { fitScore, fitExplanation } = generateFitAnalysis(
    partial.name,
    partial.industry,
    partial.footprint,
    partial.serviceType,
    opportunityScore,
    partial.googleRating,
    partial.reviewCount
  )

  const { method: bestContactMethod, reason: bestContactMethodReason } = determineBestContactMethod(
    partial.footprint,
    Boolean(partial.phone)
  )

  const contactChannelVisibility = generateContactChannelVisibility(
    partial.footprint,
    Boolean(partial.phone)
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
    fitScore,
    fitExplanation,
    bestContactMethod,
    bestContactMethodReason,
    contactChannelVisibility,
  }
}
