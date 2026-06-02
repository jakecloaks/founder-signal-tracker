import type { LocalBusiness } from '../../types'

export type BusinessDataSource = 'mock' | 'google_places'

export interface BusinessSearchParams {
  industry: string
  location: string
  serviceType: string
  radiusKm?: number
}

export interface BusinessSearchResult {
  businesses: LocalBusiness[]
  source: BusinessDataSource
  query: BusinessSearchParams
}

export interface WebsiteAnalysis {
  websiteExists: boolean
  isHttps: boolean
  isLive: boolean
  qualityScore: number
}

/** Normalized place from Google Places before opportunity enrichment */
export interface PlaceRecord {
  placeId: string
  name: string
  address: string
  rating: number
  reviewCount: number
  websiteUrl: string | null
  phone: string | null
  googleMapsUrl: string | null
  photoName: string | null
  industry: string
  location: string
  distance?: string
  websiteAnalysis: WebsiteAnalysis
}

export interface IBusinessDataProvider {
  readonly name: BusinessDataSource
  search(params: BusinessSearchParams): Promise<BusinessSearchResult>
  isAvailable(): Promise<boolean>
}
