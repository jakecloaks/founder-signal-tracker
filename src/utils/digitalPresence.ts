import type { DigitalFootprint } from '../types'

export interface PresenceInput {
  websiteExists: boolean
  websiteQualityScore: number
  instagramExists: boolean
  instagramActivityScore: number
  facebookExists: boolean
  facebookActivityScore: number
  brandingScore: number
  consistencyScore: number
  googleRating: number
  reviewCount: number
}

export function analyzeDigitalPresence(input: PresenceInput): DigitalFootprint {
  const reviewQualityScore = Math.min(
    100,
    Math.round(input.googleRating * 18 + Math.min(30, Math.log10(input.reviewCount + 1) * 12))
  )

  const socialAvg =
    input.instagramExists || input.facebookExists
      ? Math.round(
          ((input.instagramExists ? input.instagramActivityScore : 0) +
            (input.facebookExists ? input.facebookActivityScore : 0)) /
            (Number(input.instagramExists) + Number(input.facebookExists) || 1)
        )
      : 0

  const channelScores = [
    input.websiteExists ? input.websiteQualityScore : 0,
    socialAvg,
    input.brandingScore,
    input.consistencyScore,
    reviewQualityScore,
  ]

  const digitalPresenceStrength = Math.round(
    channelScores.reduce((a, b) => a + b, 0) / channelScores.length
  )

  const marketingMaturity = Math.round(
    digitalPresenceStrength * 0.45 +
      (input.websiteExists ? input.websiteQualityScore : 15) * 0.25 +
      socialAvg * 0.2 +
      reviewQualityScore * 0.1
  )

  const growthIntent = Math.min(
    100,
    Math.round(
      (input.reviewCount > 80 ? 25 : 10) +
        (input.googleRating >= 4.5 ? 20 : 8) +
        (input.instagramActivityScore > 60 ? 22 : 0) +
        (input.websiteExists && input.websiteQualityScore < 50 ? 18 : 0) +
        (input.consistencyScore < 45 ? 15 : 0)
    )
  )

  return {
    websiteExists: input.websiteExists,
    websiteQualityScore: input.websiteQualityScore,
    instagramExists: input.instagramExists,
    instagramActivityScore: input.instagramActivityScore,
    facebookExists: input.facebookExists,
    facebookActivityScore: input.facebookActivityScore,
    brandingScore: input.brandingScore,
    consistencyScore: input.consistencyScore,
    reviewQualityScore,
    digitalPresenceStrength,
    marketingMaturity,
    growthIntent,
  }
}

export function presenceWeaknesses(footprint: DigitalFootprint): string[] {
  const w: string[] = []
  if (!footprint.websiteExists) w.push('No website — high friction for new patient/customer discovery')
  else if (footprint.websiteQualityScore < 45) w.push('Outdated or low-quality website')
  if (!footprint.instagramExists) w.push('Missing Instagram presence')
  else if (footprint.instagramActivityScore < 35) w.push('Inactive or inconsistent Instagram posting')
  if (!footprint.facebookExists) w.push('No Facebook business page')
  else if (footprint.facebookActivityScore < 30) w.push('Weak Facebook engagement')
  if (footprint.brandingScore < 45) w.push('Inconsistent or dated branding')
  if (footprint.consistencyScore < 40) w.push('Fragmented online presence across channels')
  if (footprint.reviewQualityScore < 50) w.push('Review volume or rating below local competitors')
  return w
}
