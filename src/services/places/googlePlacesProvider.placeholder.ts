/**
 * Placeholder for future client-side Google Places usage.
 * All live calls go through server/services/places/googlePlacesProvider.mjs
 * so API keys stay off the client.
 *
 * Swap flow:
 * 1. Set GOOGLE_PLACES_API_KEY in .env
 * 2. Run `npm run dev` (API + Vite)
 * 3. businessSearchService auto-uses Places when /api/health reports places: true
 */

export const PLACES_API_ENDPOINT = '/api/places/search'

export interface PlacesSearchRequest {
  industry: string
  location: string
}
