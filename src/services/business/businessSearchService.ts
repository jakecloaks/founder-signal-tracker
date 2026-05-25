import { mockBusinessProvider } from './mockBusinessProvider'
import { placesApiBusinessProvider } from './placesApiBusinessProvider'
import type { BusinessSearchParams, BusinessSearchResult } from './types'

export const DEFAULT_SEARCH = { industry: 'dentists', location: 'Utah' }

export const SUGGESTED_SEARCHES = [
  { industry: 'dentists', location: 'Utah' },
  { industry: 'gyms', location: 'Miami' },
  { industry: 'roofing companies', location: 'Texas' },
  { industry: 'salons', location: 'London' },
  { industry: 'law firms', location: 'Chicago' },
  { industry: 'real estate agencies', location: 'Dubai' },
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
  location: string
): Promise<BusinessSearchResult> {
  const params: BusinessSearchParams = { industry, location }

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
