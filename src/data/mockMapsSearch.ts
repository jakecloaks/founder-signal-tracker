/**
 * @deprecated Import from `services/business` or `data/mock/businessGenerator` instead.
 * Kept for backward compatibility.
 */
export {
  generateMockBusinesses as searchLocalBusinesses,
  normalizeIndustry,
  parseSearchQuery,
} from './mock/businessGenerator'

export { DEFAULT_SEARCH, SUGGESTED_SEARCHES } from '../services/business/businessSearchService'
