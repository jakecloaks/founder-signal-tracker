import type {
  BusinessSearchParams,
  BusinessSearchResult,
  IBusinessDataProvider,
  PlaceRecord,
} from './types'
import { enrichPlacesToBusinesses } from './enrichPlace'
import { mockBusinessProvider } from './mockBusinessProvider'

interface PlacesSearchResponse {
  source: 'google_places' | 'mock'
  places?: PlaceRecord[]
  businesses?: import('../../types').LocalBusiness[]
  useClientMock?: boolean
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

    if (data.useClientMock) {
      return mockBusinessProvider.search(params)
    }

    if (data.businesses?.length) {
      return {
        businesses: data.businesses,
        source: data.source === 'google_places' ? 'google_places' : 'mock',
        query: params,
      }
    }

    if (data.places?.length) {
      return {
        businesses: enrichPlacesToBusinesses(data.places, data.source, params.serviceType),
        source: data.source,
        query: params,
      }
    }

    return {
      businesses: [],
      source: data.source,
      query: params,
    }
  }
}

export const placesApiBusinessProvider = new PlacesApiBusinessProvider()
