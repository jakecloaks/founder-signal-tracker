const TIMEOUT_MS = 4000

function isHttpsUrl(url) {
  return typeof url === 'string' && url.toLowerCase().startsWith('https://')
}

function scoreFromHtml(html, isHttps) {
  let score = 28
  if (isHttps) score += 18
  if (/<meta[^>]+name=["']viewport["']/i.test(html)) score += 12
  if (/<meta[^>]+name=["']description["']/i.test(html)) score += 8
  if (/<meta[^>]+property=["']og:/i.test(html)) score += 7
  if (/schema\.org/i.test(html)) score += 5
  if (/\b(book\s+now|schedule\s+an?\s+appointment|get\s+a?\s+quote|contact\s+us|call\s+now|request\s+a?\s+quote)\b/i.test(html)) score += 6
  if (/\b(copyright\s+200[0-9]|copyright\s+201[0-5])\b/i.test(html)) score -= 10
  if (/bgcolor=\s*["']|<font\s|<center\s|<table[^>]+cellspacing/i.test(html)) score -= 14
  return Math.min(92, Math.max(8, Math.round(score)))
}

export async function analyzeWebsite(websiteUrl) {
  if (!websiteUrl) {
    return { websiteExists: false, isHttps: false, isLive: false, qualityScore: 0 }
  }

  const isHttps = isHttpsUrl(websiteUrl)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(websiteUrl, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignalScope/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    clearTimeout(timer)

    if (!res.ok) {
      return { websiteExists: true, isHttps, isLive: false, qualityScore: isHttps ? 22 : 12 }
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      return { websiteExists: true, isHttps, isLive: true, qualityScore: isHttps ? 45 : 30 }
    }

    const html = await res.text()
    const qualityScore = scoreFromHtml(html.slice(0, 30000), isHttps)
    return { websiteExists: true, isHttps, isLive: true, qualityScore }
  } catch {
    clearTimeout(timer)
    return { websiteExists: true, isHttps, isLive: false, qualityScore: isHttps ? 18 : 8 }
  }
}
