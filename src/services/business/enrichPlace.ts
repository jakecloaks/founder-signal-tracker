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

/** Infer social/branding scores when Places API has no social fields */
function inferSupplementalScores(place: PlaceRecord) {
  const seed = hashFromString(place.placeId)
  const websiteExists = Boolean(place.websiteUrl)
  const r = (n: number) => seeded(seed, n)

  const websiteQualityScore = websiteExists
    ? Math.floor(35 + r(1) * 45)
    : 0

  const instagramExists = websiteExists ? r(2) > 0.25 : r(3) > 0.55
  const facebookExists = websiteExists ? r(4) > 0.2 : r(5) > 0.5

  return {
    websiteExists,
    websiteQualityScore,
    instagramExists,
    instagramActivityScore: instagramExists ? Math.floor(12 + r(6) * 70) : 0,
    facebookExists,
    facebookActivityScore: facebookExists ? Math.floor(10 + r(7) * 65) : 0,
    brandingScore: Math.floor(28 + r(8) * 55),
    consistencyScore: websiteExists
      ? Math.floor(30 + r(9) * 50)
      : Math.floor(15 + r(10) * 35),
  }
}

export function enrichPlaceToLocalBusiness(
  place: PlaceRecord,
  dataSource: LocalBusiness['dataSource'] = 'google_places'
): LocalBusiness {
  const industry = normalizeIndustry(place.industry)
  const supplemental = inferSupplementalScores(place)
  const rating = place.rating || 0
  const reviewCount = place.reviewCount || 0
  const activeGrowth = reviewCount > 80 && rating >= 4.3

  const footprint = analyzeDigitalPresence({
    ...supplemental,
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
  })
}

export function enrichPlacesToBusinesses(
  places: PlaceRecord[],
  dataSource: LocalBusiness['dataSource'] = 'google_places'
): LocalBusiness[] {
  return places
    .map((p) => enrichPlaceToLocalBusiness(p, dataSource))
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
}
