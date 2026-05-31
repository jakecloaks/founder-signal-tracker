import type { LocalBusiness } from '../../types'
import type { PlaceRecord } from './types'
import { analyzeDigitalPresence } from '../../utils/digitalPresence'
import { buildLocalBusiness } from '../../utils/opportunityEngine'
import { normalizeIndustry } from '../../data/mock/businessGenerator'

function hashFromString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h)
}

function seeded(seed: number, n: number): number {
  const x = Math.sin(seed + n * 777) * 10000
  return x - Math.floor(x)
}

/**
 * Infer social/branding scores — these aren't available from Places API.
 * Deterministic per placeId so the same business always shows the same scores.
 */
function inferSocialScores(place: PlaceRecord) {
  const seed = hashFromString(place.placeId)
  const r = (n: number) => seeded(seed, n)

  const instagramExists = place.websiteAnalysis.websiteExists ? r(2) > 0.28 : r(3) > 0.58
  const facebookExists  = place.websiteAnalysis.websiteExists ? r(4) > 0.22 : r(5) > 0.52

  return {
    instagramExists,
    instagramActivityScore: instagramExists ? Math.floor(10 + r(6) * 72) : 0,
    facebookExists,
    facebookActivityScore: facebookExists ? Math.floor(8 + r(7) * 68) : 0,
    brandingScore: Math.floor(22 + r(8) * 58),
    consistencyScore: place.websiteAnalysis.websiteExists
      ? Math.floor(28 + r(9) * 52)
      : Math.floor(12 + r(10) * 38),
  }
}

function mobileFriendlinessScore(qualityScore: number): number {
  // viewport meta adds 12pts in scoring, so quality >= 58 likely has it
  if (!qualityScore) return 0
  return qualityScore >= 58
    ? Math.round(qualityScore * 0.88)
    : Math.round(qualityScore * 0.52)
}

export function enrichPlaceToLocalBusiness(
  place: PlaceRecord,
  dataSource: LocalBusiness['dataSource'] = 'google_places',
  serviceType = ''
): LocalBusiness {
  const industry = normalizeIndustry(place.industry)
  const social    = inferSocialScores(place)
  const rating     = place.rating || 0
  const reviewCount = place.reviewCount || 0
  const activeGrowth = reviewCount > 80 && rating >= 4.3

  const { websiteExists, qualityScore } = place.websiteAnalysis

  const footprint = analyzeDigitalPresence({
    websiteExists,
    websiteQualityScore: qualityScore,
    mobileFriendlinessScore: mobileFriendlinessScore(qualityScore),
    ...social,
    googleRating: rating,
    reviewCount,
  })

  const initials = place.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '??'

  const photoUrl = place.photoName
    ? `/api/places/photo?ref=${encodeURIComponent(place.photoName)}`
    : null

  return buildLocalBusiness({
    id: `lb-${dataSource}-${place.placeId}`,
    name: place.name,
    industry,
    location: place.location,
    address: place.address,
    googleRating: rating,
    reviewCount,
    footprint,
    logo: initials.slice(0, 2),
    distance: place.distance ?? '—',
    lastUpdated: new Date().toISOString(),
    activeGrowth,
    dataSource,
    placeId: place.placeId,
    phone: place.phone,
    websiteUrl: place.websiteUrl,
    photoUrl,
    serviceType,
  })
}

export function enrichPlacesToBusinesses(
  places: PlaceRecord[],
  dataSource: LocalBusiness['dataSource'] = 'google_places',
  serviceType = ''
): LocalBusiness[] {
  return places
    .map((p) => enrichPlaceToLocalBusiness(p, dataSource, serviceType))
    .sort((a, b) => b.fitScore - a.fitScore)
}
