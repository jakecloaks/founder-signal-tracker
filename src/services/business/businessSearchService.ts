import { placesApiBusinessProvider } from './placesApiBusinessProvider'
import type { BusinessSearchParams, BusinessSearchResult } from './types'

export const DEFAULT_SEARCH = { industry: 'dentists', location: 'Salt Lake City, UT', serviceType: 'website redesign' }

export const SUGGESTED_SEARCHES = [
  { industry: 'dentists',      location: 'Salt Lake City, UT', service: 'website redesign' },
  { industry: 'hvac',          location: 'Phoenix, AZ',        service: 'website redesign' },
  { industry: 'roofers',       location: 'Dallas, TX',         service: 'website redesign' },
  { industry: 'plumbers',      location: 'Chicago, IL',        service: 'website redesign' },
  { industry: 'chiropractors', location: 'San Diego, CA',      service: 'website redesign' },
  { industry: 'landscaping',   location: 'Atlanta, GA',        service: 'website redesign' },
  { industry: 'pest control',  location: 'Orlando, FL',        service: 'website redesign' },
  { industry: 'med spas',      location: 'Austin, TX',         service: 'website redesign' },
]

export const TARGET_INDUSTRIES = [
  'Dentist',
  'HVAC',
  'Roofing',
  'Plumber',
  'Chiropractor',
  'Landscaping',
  'Pest Control',
  'Med Spa',
]

/**
 * Primary search — always uses Google Places API.
 * Throws if the API key is not configured or if the search fails.
 */
export async function searchBusinesses(
  industry: string,
  location: string,
  serviceType = 'website redesign'
): Promise<BusinessSearchResult> {
  const params: BusinessSearchParams = { industry, location, serviceType }
  return placesApiBusinessProvider.search(params)
}

export { placesApiBusinessProvider }
