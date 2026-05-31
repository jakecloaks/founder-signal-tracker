import type {
  BusinessSearchParams,
  BusinessSearchResult,
  IBusinessDataProvider,
  PlaceRecord,
} from './types'
import { enrichPlacesToBusinesses } from './enrichPlace'

interface PlacesSearchResponse {
  source: 'google_places'
  places?: PlaceRecord[]
  businesses?: import('../../types').LocalBusiness[]
  error?: string
}

export class PlacesApiBusinessProvider implements IBusinessDataProvider {
  readonly name = 'google_places' as const

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/health')
      if (!res.ok) return false
      const data = await res.json()
      return Boolean(data.places)
    } catch {
      return false
    }
  }

  async search(params: BusinessSearchParams): Promise<BusinessSearchResult> {
    const res = await fetch('/api/places/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    const data: PlacesSearchResponse = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `Places search failed (${res.status})`)
    }

    if (data.businesses?.length) {
      return {
        businesses: data.businesses,
        source: 'google_places',
        query: params,
      }
    }

    if (data.places?.length) {
      return {
        businesses: enrichPlacesToBusinesses(data.places, 'google_places', params.serviceType),
        source: 'google_places',
        query: params,
      }
    }

    return {
      businesses: [],
      source: 'google_places',
      query: params,
    }
  }
}

export const placesApiBusinessProvider = new PlacesApiBusinessProvider()
