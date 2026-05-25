import { isGooglePlacesConfigured, searchGooglePlaces } from './googlePlacesProvider.mjs'

/**
 * Resolves business search — Google Places when configured, otherwise signals mock fallback.
 * @param {{ industry: string, location: string }} params
 */
export async function resolvePlacesSearch(params) {
  const industry = String(params.industry ?? '').trim()
  const location = String(params.location ?? '').trim()

  if (!industry || !location) {
    throw new Error('Industry and location are required.')
  }

  if (isGooglePlacesConfigured()) {
    const places = await searchGooglePlaces(industry, location)
    return {
      source: 'google_places',
      places,
      query: { industry, location },
    }
  }

  return {
    source: 'mock',
    places: null,
    query: { industry, location },
    useClientMock: true,
  }
}
