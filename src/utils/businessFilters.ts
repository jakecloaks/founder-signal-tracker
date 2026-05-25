import type { BusinessFilterKey, BusinessFilters, LocalBusiness } from '../types'

export function filterBusinesses(
  businesses: LocalBusiness[],
  filters: BusinessFilters,
  textQuery: string
): LocalBusiness[] {
  let result = [...businesses]
  const q = textQuery.trim().toLowerCase()

  if (q) {
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
    )
  }

  switch (filters.active) {
    case 'has_website':
      result = result.filter((b) => b.footprint.websiteExists)
      break
    case 'no_website':
      result = result.filter((b) => !b.footprint.websiteExists)
      break
    case 'high_opportunity':
      result = result.filter((b) => b.opportunityScore >= 70)
      break
    case 'weak_social':
      result = result.filter(
        (b) =>
          !b.footprint.instagramExists ||
          b.footprint.instagramActivityScore < 40 ||
          !b.footprint.facebookExists ||
          b.footprint.facebookActivityScore < 35
      )
      break
    case 'high_reviews':
      result = result.filter((b) => b.googleRating >= 4.5 && b.reviewCount >= 50)
      break
    case 'low_reviews':
      result = result.filter((b) => b.googleRating < 4.2 || b.reviewCount < 40)
      break
    case 'active_growth':
      result = result.filter((b) => b.activeGrowth)
      break
    default:
      break
  }

  return result.sort((a, b) => b.opportunityScore - a.opportunityScore)
}

export const FILTER_OPTIONS: { key: BusinessFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high_opportunity', label: 'High opportunity' },
  { key: 'no_website', label: 'No website' },
  { key: 'has_website', label: 'Has website' },
  { key: 'weak_social', label: 'Weak social' },
  { key: 'high_reviews', label: 'High reviews' },
  { key: 'low_reviews', label: 'Low reviews' },
  { key: 'active_growth', label: 'Active growth' },
]
