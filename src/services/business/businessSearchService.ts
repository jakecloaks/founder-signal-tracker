import { mockBusinessProvider } from './mockBusinessProvider'
import { placesApiBusinessProvider } from './placesApiBusinessProvider'
import type { BusinessSearchParams, BusinessSearchResult } from './types'

export const DEFAULT_SEARCH = { industry: 'dentists', location: 'Utah', serviceType: 'website redesign' }

export const SUGGESTED_SEARCHES = [
  { industry: 'dentists', location: 'Utah', service: 'website redesign' },
  { industry: 'gyms', location: 'Miami', service: 'social media' },
  { industry: 'roofing companies', location: 'Texas', service: 'local SEO' },
  { industry: 'salons', location: 'London', service: 'branding' },
  { industry: 'law firms', location: 'Chicago', service: 'paid ads' },
  { industry: 'real estate agencies', location: 'Dubai', service: 'photography' },
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
  serviceType = ''
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
