const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.websiteUri',
  'places.nationalPhoneNumber',
  'places.googleMapsUri',
].join(',')

export function isGooglePlacesConfigured() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY)
}

/**
 * @param {string} industry
 * @param {string} location
 * @returns {Promise<import('./types.mjs').PlaceRecord[]>}
 */
export async function searchGooglePlaces(industry, location) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY not configured')
  }

  const textQuery = `${industry} in ${location}`.trim()

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 15,
      languageCode: 'en',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google Places API ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const places = data.places ?? []

  return places.map((place, index) => ({
    placeId: place.id?.replace('places/', '') ?? `unknown-${index}`,
    name: place.displayName?.text ?? 'Unknown Business',
    address: place.formattedAddress ?? location,
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
    websiteUrl: place.websiteUri ?? null,
    phone: place.nationalPhoneNumber ?? null,
    industry,
    location,
    distance: `${(0.5 + index * 0.35).toFixed(1)} mi`,
  }))
}
