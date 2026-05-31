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
    case 'no_website':
      result = result.filter((b) => !b.footprint.websiteExists)
      break
    case 'outdated_site':
      result = result.filter((b) => b.footprint.websiteExists && b.footprint.websiteQualityScore < 50)
      break
    case 'high_reviews':
      result = result.filter((b) => b.googleRating >= 4.5 && b.reviewCount >= 50)
      break
    case 'easy_to_close':
      result = result.filter((b) => b.difficultyToClose === 'easy')
      break
    case 'has_website':
      result = result.filter((b) => b.footprint.websiteExists)
      break
    case 'weak_branding':
      result = result.filter((b) => b.footprint.brandingScore < 45)
      break
    case 'active_growth':
      result = result.filter((b) => b.activeGrowth)
      break
    default:
      break
  }

  return result.sort((a, b) => b.websiteOpportunityScore - a.websiteOpportunityScore)
}

export const FILTER_OPTIONS: { key: BusinessFilterKey; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'no_website',   label: 'No website' },
  { key: 'outdated_site',label: 'Outdated site' },
  { key: 'easy_to_close',label: 'Easy to close' },
  { key: 'high_reviews', label: 'High reviews' },
  { key: 'weak_branding',label: 'Weak branding' },
  { key: 'has_website',  label: 'Has website' },
  { key: 'active_growth',label: 'Growing' },
]
