import { mockBusinessProvider } from './mockBusinessProvider'
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

let cachedPlacesAvailable: boolean | null = null

async function placesAvailable(): Promise<boolean> {
  if (cachedPlacesAvailable !== null) return cachedPlacesAvailable
  cachedPlacesAvailable = await placesApiBusinessProvider.isAvailable()
  return cachedPlacesAvailable
}

export function resetProviderCache(): void {
  cachedPlacesAvailable = null
}

/**
 * Primary search entry — tries Google Places API via backend, falls back to mock.
 */
export async function searchBusinesses(
  industry: string,
  location: string,
  serviceType = 'website redesign'
): Promise<BusinessSearchResult> {
  const params: BusinessSearchParams = { industry, location, serviceType }

  if (await placesAvailable()) {
    try {
      return await placesApiBusinessProvider.search(params)
    } catch (err) {
      console.warn('[businessSearch] Places API failed, using mock:', err)
    }
  }

  return mockBusinessProvider.search(params)
}

export { mockBusinessProvider, placesApiBusinessProvider }
