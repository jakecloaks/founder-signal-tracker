import { isGooglePlacesConfigured, searchGooglePlaces } from './googlePlacesProvider.mjs'
import { analyzeWebsiteUrl } from '../../websiteAnalyzer.mjs'

/**
 * Resolves business search using Google Places API.
 * Website analysis is URL-based (instant, no network calls).
 * @param {{ industry: string, location: string }} params
 */
export async function resolvePlacesSearch(params) {
  const industry = String(params.industry ?? '').trim()
  const location = String(params.location ?? '').trim()

  if (!industry || !location) {
    throw new Error('Industry and location are required.')
  }

  if (!isGooglePlacesConfigured()) {
    throw new Error(
      'Google Places API key is not configured. Add GOOGLE_PLACES_API_KEY to your environment secrets.'
    )
  }

  const places = await searchGooglePlaces(industry, location)

  // URL-based analysis — instant, no network calls
  const analyzed = places.map((place) => ({
    ...place,
    websiteAnalysis: analyzeWebsiteUrl(place.websiteUrl),
  }))

  return {
    source: 'google_places',
    places: analyzed,
    query: { industry, location },
  }
}
