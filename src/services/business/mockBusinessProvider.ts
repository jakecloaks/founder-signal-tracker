import { generateMockBusinesses } from '../../data/mock/businessGenerator'
import type {
  BusinessSearchParams,
  BusinessSearchResult,
  IBusinessDataProvider,
} from './types'

export class MockBusinessProvider implements IBusinessDataProvider {
  readonly name = 'mock' as const

  async isAvailable(): Promise<boolean> {
    return true
  }

  async search(params: BusinessSearchParams): Promise<BusinessSearchResult> {
    const businesses = generateMockBusinesses(params.industry, params.location, params.serviceType)
    return {
      businesses,
      source: 'mock',
      query: params,
    }
  }
}

export const mockBusinessProvider = new MockBusinessProvider()
