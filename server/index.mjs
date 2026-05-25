import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { analyzeCompany } from './analyze.mjs'
import { resolvePlacesSearch } from './services/places/placesSearchService.mjs'
import { isGooglePlacesConfigured } from './services/places/googlePlacesProvider.mjs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    places: isGooglePlacesConfigured(),
    news: Boolean(process.env.NEWS_API_KEY),
    llm: Boolean(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY),
  })
})

app.post('/api/places/search', async (req, res) => {
  const industry = typeof req.body?.industry === 'string' ? req.body.industry.trim() : ''
  const location = typeof req.body?.location === 'string' ? req.body.location.trim() : ''

  if (!industry || !location) {
    return res.status(400).json({ error: 'Industry and location are required.' })
  }

  try {
    const result = await resolvePlacesSearch({ industry, location })

    if (result.useClientMock) {
      return res.json({
        source: 'mock',
        useClientMock: true,
        query: result.query,
      })
    }

    res.json({
      source: result.source,
      places: result.places,
      query: result.query,
    })
  } catch (err) {
    console.error('[places/search]', err)
    const message = err instanceof Error ? err.message : 'Places search failed'
    res.status(500).json({ error: message })
  }
})

app.post('/api/analyze', async (req, res) => {
  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : ''
  if (!query) {
    return res.status(400).json({ error: 'Enter a company domain or name.' })
  }

  try {
    const result = await analyzeCompany(query)
    res.json(result)
  } catch (err) {
    console.error('[analyze]', err)
    const message = err instanceof Error ? err.message : 'Analysis failed'
    const status = message.includes('API key') || message.includes('not configured') ? 503 : 500
    res.status(status).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})
