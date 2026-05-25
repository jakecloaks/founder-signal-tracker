import type { LocalBusiness } from '../../types'

export type BusinessDataSource = 'mock' | 'google_places'

export interface BusinessSearchParams {
  industry: string
  location: string
}

export interface BusinessSearchResult {
  businesses: LocalBusiness[]
  source: BusinessDataSource
  query: BusinessSearchParams
}

/** Normalized place from any provider before opportunity enrichment */
export interface PlaceRecord {
  placeId: string
  name: string
  address: string
  rating: number
  reviewCount: number
  websiteUrl: string | null
  phone: string | null
  industry: string
  location: string
  distance?: string
}

export interface IBusinessDataProvider {
  readonly name: BusinessDataSource
  search(params: BusinessSearchParams): Promise<BusinessSearchResult>
  isAvailable(): Promise<boolean>
}
