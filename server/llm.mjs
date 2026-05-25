const SIGNAL_TYPES = [
  'hiring_sdrs',
  'meta_ads',
  'founder_scaling_post',
  'new_landing_page',
  'product_launch',
  'team_expansion',
  'funding_signal',
  'linkedin_outreach',
]

export async function generateIntelligence(payload) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY or OPENAI_API_KEY not configured')
  }

  const useOpenRouter = Boolean(process.env.OPENROUTER_API_KEY)
  const baseUrl = useOpenRouter
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'

  const model =
    process.env.LLM_MODEL ||
    (useOpenRouter ? 'openai/gpt-4o-mini' : 'gpt-4o-mini')

  const system = `You are a B2B growth intelligence analyst for agencies and outbound teams.
Given real website metadata, news, and heuristic indicators, produce a JSON object ONLY (no markdown).
Schema:
{
  "name": string,
  "domain": string,
  "industry": string,
  "intentScore": number 0-100,
  "signals": [{ "type": one of ${JSON.stringify(SIGNAL_TYPES)}, "label": string, "description": string, "strength": number 0-100 }],
  "aiSummary": string (2-3 sentences),
  "outreachAngle": string (short hook for cold email),
  "outreachRecommendation": string (2-3 sentences),
  "intentBreakdown": { "hiring": 0-100, "marketing": 0-100, "product": 0-100, "social": 0-100, "funding": 0-100 },
  "recentActivity": [{ "title": string, "description": string }]
}
Base intent on evidence. If data is thin, score conservatively (35-55) and say so in aiSummary.
Use 2-5 signals max. Map indicators to appropriate signal types.`

  const user = JSON.stringify(payload, null, 2)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }
  if (useOpenRouter) {
    headers['HTTP-Referer'] = 'https://foundersignal.app'
    headers['X-Title'] = 'Founder Signal Tracker'
  }

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM error: ${res.status} ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty LLM response')

  const parsed = JSON.parse(content)
  return sanitizeLlmOutput(parsed, payload)
}

function sanitizeLlmOutput(raw, payload) {
  const { domain, name } = payload.company
  const validTypes = new Set(SIGNAL_TYPES)

  const signals = Array.isArray(raw.signals)
    ? raw.signals
        .filter((s) => s && validTypes.has(s.type))
        .slice(0, 6)
        .map((s) => ({
          type: s.type,
          label: String(s.label || 'Signal detected').slice(0, 80),
          description: String(s.description || '').slice(0, 200),
          strength: Math.min(100, Math.max(0, Number(s.strength) || 50)),
        }))
    : []

  const intentScore = Math.min(100, Math.max(0, Number(raw.intentScore) || 50))

  const breakdown = raw.intentBreakdown || {}
  const clamp = (v) => Math.min(100, Math.max(0, Number(v) || 0))

  return {
    name: String(raw.name || name).slice(0, 100),
    domain: String(raw.domain || domain || '').slice(0, 100),
    industry: String(raw.industry || 'Technology').slice(0, 80),
    intentScore,
    signals,
    aiSummary: String(raw.aiSummary || 'Limited public data available for analysis.'),
    outreachAngle: String(raw.outreachAngle || 'Help them scale outbound efficiently'),
    outreachRecommendation: String(
      raw.outreachRecommendation ||
        'Reference recent public activity and offer a short audit tailored to their growth stage.'
    ),
    intentBreakdown: {
      hiring: clamp(breakdown.hiring),
      marketing: clamp(breakdown.marketing),
      product: clamp(breakdown.product),
      social: clamp(breakdown.social),
      funding: clamp(breakdown.funding),
    },
    recentActivity: Array.isArray(raw.recentActivity)
      ? raw.recentActivity.slice(0, 5).map((a) => ({
          title: String(a.title || 'Activity').slice(0, 100),
          description: String(a.description || '').slice(0, 200),
        }))
      : [],
  }
}
