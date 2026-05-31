import { isGooglePlacesConfigured, searchGooglePlaces } from './googlePlacesProvider.mjs'
import { analyzeWebsite } from '../../websiteAnalyzer.mjs'

/**
 * Resolves business search — Google Places when configured, otherwise throws.
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

  // Run website analysis in parallel for all places
  const analyzed = await Promise.all(
    places.map(async (place) => {
      const websiteAnalysis = await analyzeWebsite(place.websiteUrl)
      return { ...place, websiteAnalysis }
    })
  )

  return {
    source: 'google_places',
    places: analyzed,
    query: { industry, location },
  }
}
