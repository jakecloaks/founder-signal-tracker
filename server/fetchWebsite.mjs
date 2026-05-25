const HIRING_PATTERNS = [
  { pattern: /\b(hiring|we['']?re hiring|join our team|open roles?|careers)\b/i, label: 'Hiring language on website' },
  { pattern: /\b(SDR|BDR|sales development|account executive|AE)\b/i, label: 'Sales hiring signals' },
  { pattern: /\b(team expansion|growing team|scale our team)\b/i, label: 'Team expansion messaging' },
  { pattern: /\b(series [a-d]|raised|funding|venture)\b/i, label: 'Funding / growth capital signals' },
  { pattern: /\b(launch|announcing|new product|ship(ped)?)\b/i, label: 'Product launch signals' },
  { pattern: /\b(scale|scaling|growth|go-to-market|GTM)\b/i, label: 'Scaling / GTM language' },
]

function extractMeta(html) {
  const pick = (regex) => {
    const m = html.match(regex)
    return m?.[1]?.trim().replace(/\s+/g, ' ') ?? ''
  }

  const title = pick(/<title[^>]*>([^<]+)<\/title>/i)
  const description =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
  const ogTitle =
    pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
  const ogDescription =
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 12000)

  return {
    title: ogTitle || title,
    description: ogDescription || description,
    bodySnippet: bodyText.slice(0, 4000),
  }
}

export function normalizeQuery(query) {
  const trimmed = query.trim()
  const looksLikeDomain = /\./.test(trimmed) && !trimmed.includes(' ')
  if (looksLikeDomain) {
    const domain = trimmed
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .toLowerCase()
    const name = domain.split('.')[0]
    const brand = name.charAt(0).toUpperCase() + name.slice(1)
    return { domain, name: brand, searchName: brand }
  }
  return {
    domain: '',
    name: trimmed,
    searchName: trimmed,
  }
}

export function detectWebsiteIndicators(text) {
  const found = []
  for (const { pattern, label } of HIRING_PATTERNS) {
    if (pattern.test(text) && !found.some((f) => f.label === label)) {
      found.push({ source: 'website', label, confidence: 'medium' })
    }
  }
  return found
}

export async function fetchWebsiteMetadata(domain) {
  if (!domain) {
    return { url: null, title: '', description: '', bodySnippet: '', indicators: [], error: 'no_domain' }
  }

  const url = `https://${domain}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FounderSignalTracker/1.0 (MVP research bot)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })

    if (!res.ok) {
      return {
        url,
        title: domain,
        description: '',
        bodySnippet: '',
        indicators: [],
        error: `HTTP ${res.status}`,
      }
    }

    const html = await res.text()
    const meta = extractMeta(html)
    const combined = `${meta.title} ${meta.description} ${meta.bodySnippet}`
    const indicators = detectWebsiteIndicators(combined)

    return { url, ...meta, indicators, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'fetch_failed'
    return {
      url,
      title: domain,
      description: '',
      bodySnippet: '',
      indicators: [],
      error: message,
    }
  } finally {
    clearTimeout(timeout)
  }
}
