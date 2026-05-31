import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { analyzeCompany } from './analyze.mjs'
import { resolvePlacesSearch } from './services/places/placesSearchService.mjs'
import { isGooglePlacesConfigured } from './services/places/googlePlacesProvider.mjs'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const WAITLIST_FILE = join(__dirname, 'waitlist.json')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

/* ── Waitlist helpers ───────────────────────────────────────────── */
async function readWaitlist() {
  try {
    const raw = await readFile(WAITLIST_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function appendWaitlist(entry) {
  const list = await readWaitlist()
  // Prevent duplicate emails
  const exists = list.some((e) => e.email.toLowerCase() === entry.email.toLowerCase())
  if (exists) return { position: list.findIndex((e) => e.email.toLowerCase() === entry.email.toLowerCase()) + 1, duplicate: true }
  const updated = [...list, { ...entry, createdAt: new Date().toISOString() }]
  await writeFile(WAITLIST_FILE, JSON.stringify(updated, null, 2))
  return { position: updated.length, duplicate: false }
}

/* ── Health ─────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    places: isGooglePlacesConfigured(),
    news: Boolean(process.env.NEWS_API_KEY),
    llm: Boolean(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY),
  })
})

/* ── Waitlist ────────────────────────────────────────────────────── */
app.get('/api/waitlist/count', async (_req, res) => {
  const list = await readWaitlist()
  res.json({ count: list.length })
})

app.post('/api/waitlist', async (req, res) => {
  const { name, email, agencyType, revenue } = req.body ?? {}
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required.' })
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRx.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  try {
    const { position, duplicate } = await appendWaitlist({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      agencyType: agencyType?.trim() ?? '',
      revenue: revenue?.trim() ?? '',
    })
    res.json({ success: true, position, duplicate })
  } catch (err) {
    console.error('[waitlist]', err)
    res.status(500).json({ error: 'Failed to save your submission. Please try again.' })
  }
})

/* ── Places search ──────────────────────────────────────────────── */
app.post('/api/places/search', async (req, res) => {
  const industry = typeof req.body?.industry === 'string' ? req.body.industry.trim() : ''
  const location = typeof req.body?.location === 'string' ? req.body.location.trim() : ''
  if (!industry || !location) {
    return res.status(400).json({ error: 'Industry and location are required.' })
  }
  try {
    const result = await resolvePlacesSearch({ industry, location })
    if (result.useClientMock) {
      return res.json({ source: 'mock', useClientMock: true, query: result.query })
    }
    res.json({ source: result.source, places: result.places, query: result.query })
  } catch (err) {
    console.error('[places/search]', err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Places search failed' })
  }
})

/* ── Analysis ───────────────────────────────────────────────────── */
app.post('/api/analyze', async (req, res) => {
  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : ''
  if (!query) return res.status(400).json({ error: 'Enter a company domain or name.' })
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
