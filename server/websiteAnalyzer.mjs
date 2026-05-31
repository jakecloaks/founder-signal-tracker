/**
 * Fast URL-based website analysis — no network calls, instant results.
 * Used during search to avoid latency. Accurate on the signals that matter most:
 * website existence, HTTPS, and rough quality tier from URL patterns.
 */
export function analyzeWebsiteUrl(websiteUrl) {
  if (!websiteUrl) {
    return { websiteExists: false, isHttps: false, isLive: null, qualityScore: 0 }
  }

  const url = websiteUrl.toLowerCase().trim()
  const isHttps = url.startsWith('https://')

  let score = 32
  if (isHttps) score += 20

  // Penalize known low-quality or third-party-hosted pages
  if (
    url.includes('yellowpages.') ||
    url.includes('yelp.com') ||
    url.includes('facebook.com') ||
    url.includes('google.com') ||
    url.includes('bbb.org')
  ) {
    score -= 18
  }

  // Penalize free website builders (usually lower quality)
  if (
    url.includes('.wixsite.com') ||
    url.includes('.weebly.com') ||
    url.includes('.godaddysites.com') ||
    url.includes('.site123.me')
  ) {
    score -= 8
  }

  // Slight boost for custom domains with subpages (more developed sites)
  if (/\.(com|net|org|co|io|dental|clinic|health|care)\b/.test(url)) score += 5
  if (url.includes('/services') || url.includes('/about') || url.includes('/contact')) score += 5

  return {
    websiteExists: true,
    isHttps,
    isLive: null,        // not checked yet — null means "unknown"
    qualityScore: Math.min(85, Math.max(8, Math.round(score))),
  }
}

/**
 * Deep website analysis — fetches the actual page to extract HTML signals.
 * Used for per-business detail view where latency is acceptable.
 */
const DEEP_TIMEOUT_MS = 4000

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

export async function analyzeWebsiteDeep(websiteUrl) {
  if (!websiteUrl) {
    return { websiteExists: false, isHttps: false, isLive: false, qualityScore: 0 }
  }

  const isHttps = websiteUrl.toLowerCase().startsWith('https://')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEEP_TIMEOUT_MS)

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

    if (!res.ok) return { websiteExists: true, isHttps, isLive: false, qualityScore: isHttps ? 22 : 12 }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      return { websiteExists: true, isHttps, isLive: true, qualityScore: isHttps ? 45 : 30 }
    }

    const html = await res.text()
    return { websiteExists: true, isHttps, isLive: true, qualityScore: scoreFromHtml(html.slice(0, 30000), isHttps) }
  } catch {
    clearTimeout(timer)
    return { websiteExists: true, isHttps, isLive: false, qualityScore: isHttps ? 18 : 8 }
  }
}
