import { placesApiBusinessProvider } from './placesApiBusinessProvider'
import { mockBusinessProvider } from './mockBusinessProvider'
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

function parseDistanceKm(distance?: string) {
  if (!distance) return null

  const normalized = distance.trim().toLowerCase()
  const match = normalized.match(/([0-9]+(?:\.[0-9]+)?)/)
  if (!match) return null

  const value = Number(match[1])
  if (Number.isNaN(value)) return null

  if (normalized.includes('km')) return value
  if (normalized.includes('mi')) return value * 1.60934

  return value
}

function filterByRadius(businesses: BusinessSearchResult['businesses'], radiusKm?: number) {
  if (radiusKm == null) return businesses
  if (radiusKm <= 0) return businesses

  return businesses.filter((business) => {
    const distanceKm = parseDistanceKm(business.distance)
    return distanceKm == null || distanceKm <= radiusKm
  })
}

/**
 * Smart search with automatic fallback:
 * 1. Checks if Google Places API is configured and available
 * 2. If available, uses real Places data
 * 3. If unavailable or request fails, falls back to demo/mock data
 * 
 * Never throws — always returns results (real or mock).
 */
export async function searchBusinesses(
  industry: string,
  location: string,
  serviceType = 'website redesign',
  radiusKm?: number,
): Promise<BusinessSearchResult> {
  const params: BusinessSearchParams = { industry, location, serviceType, radiusKm }

  // Try Places API first
  try {
    const isAvailable = await placesApiBusinessProvider.isAvailable()
    if (isAvailable) {
      try {
        const result = await placesApiBusinessProvider.search(params)
        return {
          ...result,
          businesses: filterByRadius(result.businesses, radiusKm),
        }
      } catch (err) {
        // Places request failed — fall back to mock
        console.warn('[search] Places API request failed, falling back to mock:', err instanceof Error ? err.message : String(err))
        const mockResult = await mockBusinessProvider.search(params)
        return {
          ...mockResult,
          businesses: filterByRadius(mockResult.businesses, radiusKm),
        }
      }
    }
  } catch (err) {
    // Health check failed — fall back to mock
    console.warn('[search] Cannot reach API server, falling back to mock:', err instanceof Error ? err.message : String(err))
  }

  // API unavailable (no key or server down) — use mock
  const mockResult = await mockBusinessProvider.search(params)
  return {
    ...mockResult,
    businesses: filterByRadius(mockResult.businesses, radiusKm),
  }
}

export { placesApiBusinessProvider, mockBusinessProvider }
